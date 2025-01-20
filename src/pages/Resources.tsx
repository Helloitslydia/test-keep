import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/editor/Sidebar';
import { Pencil, Trash2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Resource {
  id: string;
  title_resource: string;
  link_resource: string;
}

export function Resources() {
  const { id: projectId } = useParams();
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing resources
  useEffect(() => {
    const fetchResources = async () => {
      if (!projectId) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('resources')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        if (data) {
          setResources(data);
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources');
      }
    };

    fetchResources();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;

    setIsLoading(true);
    setError(null);

    try {
      if (editingId) {
        // Update existing resource
        const { error: updateError } = await supabase
          .from('resources')
          .update({
            title_resource: title,
            link_resource: link
          })
          .eq('id', editingId)
          .eq('project_id', projectId);

        if (updateError) throw updateError;

        setResources(resources.map(r => 
          r.id === editingId 
            ? { ...r, title_resource: title, link_resource: link }
            : r
        ));
      } else {
        // Create new resource
        const { data, error: insertError } = await supabase
          .from('resources')
          .insert({
            project_id: projectId,
            title_resource: title,
            link_resource: link
          })
          .select()
          .single();

        if (insertError) throw insertError;

        if (data) {
          setResources([...resources, data]);
        }
      }

      setTitle('');
      setLink('');
      setEditingId(null);
    } catch (err) {
      console.error('Error saving resource:', err);
      setError('Failed to save resource');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (resource: Resource) => {
    setTitle(resource.title_resource);
    setLink(resource.link_resource);
    setEditingId(resource.id);
  };

  const handleDelete = async (id: string) => {
    if (!projectId) return;

    try {
      const { error: deleteError } = await supabase
        .from('resources')
        .delete()
        .eq('id', id)
        .eq('project_id', projectId);

      if (deleteError) throw deleteError;

      setResources(resources.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error deleting resource:', err);
      setError('Failed to delete resource');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1">
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-3xl font-light text-gray-900">Resources</h1>
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
                  Title of the resource
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link to the resource
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading 
                  ? (editingId ? 'Updating...' : 'Adding...') 
                  : (editingId ? 'Update Resource' : 'Add Resource')
                }
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Link
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resources.map((resource) => (
                    <tr key={resource.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {resource.title_resource}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={resource.link_resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {resource.link_resource}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(resource)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(resource.id)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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