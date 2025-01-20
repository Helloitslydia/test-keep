import React, { useEffect, useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { Eye, Pencil, Trash2, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export function ProjectList() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organizationLogo, setOrganizationLogo] = useState<string | null>(null);
  const projects = useProjectStore((state) => state.projects);
  const setProjects = useProjectStore((state) => state.setProjects);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!user?.organizationId) return;

      try {
        const { data, error: orgError } = await supabase
          .from('organisations')
          .select('image_url')
          .eq('id', user.organizationId)
          .single();

        if (orgError) throw orgError;
        if (data) {
          setOrganizationLogo(data.image_url);
        }
      } catch (err) {
        console.error('Error fetching organization logo:', err);
      }
    };

    fetchOrganizationData();
  }, [user?.organizationId]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;

      try {
        const { data, error: supabaseError } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id);

        if (supabaseError) throw supabaseError;

        if (data) {
          const formattedProjects = data.map(project => ({
            id: project.id,
            name: project.title,
            progress: 0,
            status: project.is_online ? 'online' : 'offline',
            logo: organizationLogo || 'https://images.unsplash.com/photo-1636819488537-a9b1e5680b1a?w=800&auto=format&fit=crop&q=60'
          }));
          setProjects(formattedProjects);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user, setProjects, organizationLogo]);

  const handleDelete = async (id: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;

      deleteProject(id);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
    }
  };

  if (isLoading) {
    return (
      <div className="mt-12 flex justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl border border-gray-200 p-6 h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 text-center">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex flex-col space-y-8">
        <button className="btn-secondary flex items-center w-fit">
          <UserPlus className="mr-2 h-5 w-5" />
          Invite a colleague to join the organisation
        </button>
        
        <div>
          <h2 className="text-2xl font-light mb-8">{user?.organizationName} projects</h2>
          {projects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-600">No projects yet. Click "Add project" to create your first project.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={project.logo}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium">{project.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          project.status === 'online'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <div className="mb-6">
                      <div className="w-full bg-gray-100 rounded-full h-1">
                        <div
                          className="bg-black h-1 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 mt-2">
                        {project.progress}% complete
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <button 
                        className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => navigate(`/project/${project.id}/edit`)}
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}