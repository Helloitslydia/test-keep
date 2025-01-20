import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/editor/Sidebar';
import { Pencil, Trash2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  job_title: string;
  linkedin_url: string;
}

export function Team() {
  const { id: projectId } = useParams();
  const [member, setMember] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    linkedinUrl: ''
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!projectId) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('team')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        if (data) {
          setTeamMembers(data);
        }
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError('Failed to load team members');
      }
    };

    fetchTeamMembers();
  }, [projectId]);

  const validateLinkedInUrl = (url: string): string => {
    if (!url) return '';
    
    // Remove any trailing slashes
    url = url.trim().replace(/\/+$/, '');

    // If URL doesn't start with http/https, add https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // If URL doesn't contain linkedin.com, add it
    if (!url.includes('linkedin.com')) {
      // Check if it's just a profile ID
      if (url.includes('/in/')) {
        url = `https://linkedin.com${url}`;
      } else if (!url.includes('/')) {
        url = `https://linkedin.com/in/${url}`;
      }
    }

    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;

    setIsLoading(true);
    setError(null);

    try {
      const linkedinUrl = validateLinkedInUrl(member.linkedinUrl);

      if (linkedinUrl && !linkedinUrl.match(/^https?:\/\/.*linkedin\.com.*$/)) {
        throw new Error('Please enter a valid LinkedIn URL');
      }

      if (editingId) {
        // Update existing team member
        const { error: updateError } = await supabase
          .from('team')
          .update({
            first_name: member.firstName,
            last_name: member.lastName,
            job_title: member.jobTitle,
            linkedin_url: linkedinUrl
          })
          .eq('id', editingId)
          .eq('project_id', projectId);

        if (updateError) throw updateError;

        setTeamMembers(teamMembers.map(m => 
          m.id === editingId 
            ? {
                ...m,
                first_name: member.firstName,
                last_name: member.lastName,
                job_title: member.jobTitle,
                linkedin_url: linkedinUrl
              }
            : m
        ));
      } else {
        // Create new team member
        const { data, error: insertError } = await supabase
          .from('team')
          .insert({
            project_id: projectId,
            first_name: member.firstName,
            last_name: member.lastName,
            job_title: member.jobTitle,
            linkedin_url: linkedinUrl
          })
          .select()
          .single();

        if (insertError) throw insertError;

        if (data) {
          setTeamMembers([...teamMembers, data]);
        }
      }

      setMember({ firstName: '', lastName: '', jobTitle: '', linkedinUrl: '' });
      setEditingId(null);

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = editingId ? 'Team member updated successfully' : 'Team member added successfully';
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);

    } catch (err) {
      console.error('Error saving team member:', err);
      setError(err instanceof Error ? err.message : 'Failed to save team member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (teamMember: TeamMember) => {
    setMember({
      firstName: teamMember.first_name,
      lastName: teamMember.last_name,
      jobTitle: teamMember.job_title,
      linkedinUrl: teamMember.linkedin_url
    });
    setEditingId(teamMember.id);
  };

  const handleDelete = async (id: string) => {
    if (!projectId) return;

    try {
      const { error: deleteError } = await supabase
        .from('team')
        .delete()
        .eq('id', id)
        .eq('project_id', projectId);

      if (deleteError) throw deleteError;

      setTeamMembers(teamMembers.filter(m => m.id !== id));

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = 'Team member deleted successfully';
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);

    } catch (err) {
      console.error('Error deleting team member:', err);
      setError('Failed to delete team member');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1">
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-3xl font-light text-gray-900">Team</h1>
        </div>
        
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={member.firstName}
                    onChange={(e) => setMember({ ...member, firstName: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={member.lastName}
                    onChange={(e) => setMember({ ...member, lastName: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={member.jobTitle}
                  onChange={(e) => setMember({ ...member, jobTitle: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn URL or Profile ID
                </label>
                <input
                  type="text"
                  value={member.linkedinUrl}
                  onChange={(e) => setMember({ ...member, linkedinUrl: e.target.value })}
                  className="input-field"
                  placeholder="e.g., https://linkedin.com/in/username or just username"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter a full LinkedIn URL or just the profile ID (e.g., "johndoe")
                </p>
              </div>

              <button 
                type="submit" 
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading 
                  ? (editingId ? 'Updating...' : 'Adding...') 
                  : (editingId ? 'Update Team Member' : 'Add Team Member')
                }
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      LinkedIn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamMembers.map((teamMember) => (
                    <tr key={teamMember.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {teamMember.first_name} {teamMember.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {teamMember.job_title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {teamMember.linkedin_url && (
                          <a
                            href={teamMember.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            View Profile
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(teamMember)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(teamMember.id)}
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