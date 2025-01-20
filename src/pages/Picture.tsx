import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/editor/Sidebar';
import { Trash2, Upload } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Picture {
  id: string;
  la_photo: string;
  name: string;
}

export function Picture() {
  const { id: projectId } = useParams();
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing pictures
  useEffect(() => {
    const fetchPictures = async () => {
      if (!projectId) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('photos_projet')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        if (data) {
          setPictures(data.map(photo => ({
            id: photo.id,
            la_photo: photo.la_photo,
            name: photo.la_photo.split('/').pop() || 'Untitled'
          })));
        }
      } catch (err) {
        console.error('Error fetching pictures:', err);
        setError('Failed to load pictures');
      }
    };

    fetchPictures();
  }, [projectId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      await handleFiles(Array.from(files));
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    await handleFiles(Array.from(files));
  };

  const handleFiles = async (files: File[]) => {
    if (!projectId) return;

    setIsLoading(true);
    setError(null);

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;

        // Convert file to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = (e) => {
            const base64 = e.target?.result as string;
            resolve(base64);
          };
        });
        reader.readAsDataURL(file);
        const base64Data = await base64Promise;

        // Save to Supabase
        const { data, error: insertError } = await supabase
          .from('photos_projet')
          .insert({
            project_id: projectId,
            la_photo: base64Data
          })
          .select()
          .single();

        if (insertError) throw insertError;

        if (data) {
          setPictures(prev => [...prev, {
            id: data.id,
            la_photo: data.la_photo,
            name: file.name
          }]);
        }
      }
    } catch (err) {
      console.error('Error uploading pictures:', err);
      setError('Failed to upload pictures');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!projectId) return;

    try {
      const { error: deleteError } = await supabase
        .from('photos_projet')
        .delete()
        .eq('id', id)
        .eq('project_id', projectId);

      if (deleteError) throw deleteError;

      setPictures(pictures.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting picture:', err);
      setError('Failed to delete picture');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1">
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-3xl font-light text-gray-900">Picture</h1>
        </div>
        
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-light mb-6">Upload photos of the project</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? 'border-black bg-gray-50' : 'border-gray-300'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <label className="block">
                <span className="btn-primary inline-block cursor-pointer">
                  {isLoading ? 'Uploading...' : 'Select Files'}
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">
                or drag and drop your images here
              </p>
            </div>

            <div className="mt-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pictures.map((picture) => (
                  <div
                    key={picture.id}
                    className="relative group rounded-lg overflow-hidden border border-gray-200"
                  >
                    <img
                      src={picture.la_photo}
                      alt={picture.name}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleDelete(picture.id)}
                          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm truncate">
                      {picture.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}