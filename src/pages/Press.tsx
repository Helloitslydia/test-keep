import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/editor/Sidebar';
import { Trash2, Link } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface PressLink {
  id: string;
  press_url: string;
}

export function Press() {
  const { id: projectId } = useParams();
  const [url, setUrl] = useState('');
  const [pressLinks, setPressLinks] = useState<PressLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing press links
  useEffect(() => {
    const fetchPressLinks = async () => {
      if (!projectId) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('press')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        if (data) {
          setPressLinks(data);
        }
      } catch (err) {
        console.error('Error fetching press links:', err);
        setError('Failed to load press links');
      }
    };

    fetchPressLinks();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('press')
        .insert({
          project_id: projectId,
          press_url: url
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (data) {
        setPressLinks([...pressLinks, data]);
        setUrl('');
      }
    } catch (err) {
      console.error('Error saving press link:', err);
      setError('Failed to save press link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!projectId) return;

    try {
      const { error: deleteError } = await supabase
        .from('press')
        .delete()
        .eq('id', id)
        .eq('project_id', projectId);

      if (deleteError) throw deleteError;

      setPressLinks(pressLinks.filter(link => link.id !== id));
    } catch (err) {
      console.error('Error deleting press link:', err);
      setError('Failed to delete press link');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1">
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-3xl font-light text-gray-900">Press</h1>
        </div>
        
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Press URL
                </label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="input-field"
                      placeholder="Enter press URL"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn-primary flex items-center"
                    disabled={isLoading}
                  >
                    <Link className="h-5 w-5 mr-2" />
                    {isLoading ? 'Adding...' : 'Add Link'}
                  </button>
                </div>
              </div>
            </form>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pressLinks.map((link) => (
                    <tr key={link.id}>
                      <td className="px-6 py-4">
                        <a
                          href={link.press_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {link.press_url}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(link.id)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}