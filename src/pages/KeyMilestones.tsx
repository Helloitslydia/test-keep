import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/editor/Sidebar';
import { Pencil, Trash2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Milestone {
  id: string;
  name_milestone: string;
  status_milestone: 'completed' | 'in_progress' | 'pending';
}

export function KeyMilestones() {
  const { id: projectId } = useParams();
  const [milestoneName, setMilestoneName] = useState('');
  const [status, setStatus] = useState<'completed' | 'in_progress' | 'pending'>('pending');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing milestones
  useEffect(() => {
    const fetchMilestones = async () => {
      if (!projectId) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('key_milestones')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        if (data) {
          setMilestones(data);
        }
      } catch (err) {
        console.error('Error fetching milestones:', err);
        setError('Failed to load milestones');
      }
    };

    fetchMilestones();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;

    setIsLoading(true);
    setError(null);

    try {
      if (editingId) {
        // Update existing milestone
        const { error: updateError } = await supabase
          .from('key_milestones')
          .update({
            name_milestone: milestoneName,
            status_milestone: status
          })
          .eq('id', editingId)
          .eq('project_id', projectId);

        if (updateError) throw updateError;

        setMilestones(milestones.map(m => 
          m.id === editingId 
            ? { ...m, name_milestone: milestoneName, status_milestone: status }
            : m
        ));
      } else {
        // Create new milestone
        const { data, error: insertError } = await supabase
          .from('key_milestones')
          .insert({
            project_id: projectId,
            name_milestone: milestoneName,
            status_milestone: status
          })
          .select()
          .single();

        if (insertError) throw insertError;

        if (data) {
          setMilestones([...milestones, data]);
        }
      }

      setMilestoneName('');
      setStatus('pending');
      setEditingId(null);
    } catch (err) {
      console.error('Error saving milestone:', err);
      setError('Failed to save milestone');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (milestone: Milestone) => {
    setMilestoneName(milestone.name_milestone);
    setStatus(milestone.status_milestone);
    setEditingId(milestone.id);
  };

  const handleDelete = async (id: string) => {
    if (!projectId) return;

    try {
      const { error: deleteError } = await supabase
        .from('key_milestones')
        .delete()
        .eq('id', id)
        .eq('project_id', projectId);

      if (deleteError) throw deleteError;

      setMilestones(milestones.filter(m => m.id !== id));
    } catch (err) {
      console.error('Error deleting milestone:', err);
      setError('Failed to delete milestone');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1">
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-3xl font-light text-gray-900">Key Milestones</h1>
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
                  Name of the key milestone
                </label>
                <input
                  type="text"
                  value={milestoneName}
                  onChange={(e) => setMilestoneName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'completed' | 'in_progress' | 'pending')}
                  className="input-field"
                >
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading 
                  ? (editingId ? 'Updating...' : 'Adding...') 
                  : (editingId ? 'Update Milestone' : 'Add Milestone')
                }
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Milestone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {milestones.map((milestone) => (
                    <tr key={milestone.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {milestone.name_milestone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          milestone.status_milestone === 'completed' ? 'bg-green-100 text-green-800' :
                          milestone.status_milestone === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {milestone.status_milestone.replace('_', ' ').charAt(0).toUpperCase() + 
                           milestone.status_milestone.slice(1).replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(milestone)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(milestone.id)}
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