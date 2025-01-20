import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, DollarSign, Heart, Star, Zap, Trophy, Target, Lightbulb, Flag, Rocket, ExternalLink } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { supabase } from '../lib/supabase';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface ProjectData {
  continent: string;
  countries: string[];
  cities: string;
  start_date: string;
  end_date: string;
  budget: number;
  beneficiaries: number;
  long_description: string;
  money_spent: number;
  dv1_titre?: string;
  dv1_vizualisation_type?: string;
  dv1_value?: number;
  dv1_nom_icon?: string;
  dv1_short_description?: string;
  dv2_titre?: string;
  dv2_vizualisation_type?: string;
  dv2_value?: number;
  dv2_nom_icon?: string;
  dv2_short_description?: string;
  dv3_titre?: string;
  dv3_vizualisation_type?: string;
  dv3_value?: number;
  dv3_nom_icon?: string;
  dv3_short_description?: string;
  dv4_titre?: string;
  dv4_vizualisation_type?: string;
  dv4_value?: number;
  dv4_nom_icon?: string;
  dv4_short_description?: string;
  dv5_titre?: string;
  dv5_vizualisation_type?: string;
  dv5_value?: number;
  dv5_nom_icon?: string;
  dv5_short_description?: string;
}

interface Milestone {
  id: string;
  name_milestone: string;
  status_milestone: string;
}

interface Resource {
  id: string;
  title_resource: string;
  link_resource: string;
}

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  job_title: string;
  linkedin_url: string;
}

interface PressLink {
  id: string;
  press_url: string;
}

interface Photo {
  id: string;
  la_photo: string;
}

export function ProjectView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pressLinks, setPressLinks] = useState<PressLink[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) return;

      try {
        // Fetch project data
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (projectError) throw projectError;
        setProjectData(projectData);

        // Fetch milestones
        const { data: milestonesData, error: milestonesError } = await supabase
          .from('key_milestones')
          .select('*')
          .eq('project_id', id)
          .order('created_at', { ascending: true });

        if (milestonesError) throw milestonesError;
        setMilestones(milestonesData || []);

        // Fetch resources
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('resources')
          .select('*')
          .eq('project_id', id)
          .order('created_at', { ascending: true });

        if (resourcesError) throw resourcesError;
        setResources(resourcesData || []);

        // Fetch team members
        const { data: teamData, error: teamError } = await supabase
          .from('team')
          .select('*')
          .eq('project_id', id)
          .order('created_at', { ascending: true });

        if (teamError) throw teamError;
        setTeamMembers(teamData || []);

        // Fetch press links
        const { data: pressData, error: pressError } = await supabase
          .from('press')
          .select('*')
          .eq('project_id', id)
          .order('created_at', { ascending: true });

        if (pressError) throw pressError;
        setPressLinks(pressData || []);

        // Fetch photos
        const { data: photosData, error: photosError } = await supabase
          .from('photos_projet')
          .select('*')
          .eq('project_id', id)
          .order('created_at', { ascending: true });

        if (photosError) throw photosError;
        setPhotos(photosData || []);

      } catch (err) {
        console.error('Error fetching project data:', err);
        setError('Failed to load project data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project data...</p>
        </div>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Project not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 btn-primary"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType } = {
      Heart, Star, Zap, Trophy, Target, Lightbulb, Flag, Rocket
    };
    return icons[iconName] || null;
  };

  const renderDataViz = (
    title?: string,
    type?: string,
    value?: number,
    iconName?: string,
    description?: string
  ) => {
    if (!title) return null;

    const IconComponent = iconName ? getIconComponent(iconName) : null;

    return (
      <div className="p-6 rounded-xl bg-white/50 backdrop-blur-sm text-center">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        {IconComponent && (
          <div className="flex justify-center mb-4">
            <IconComponent className="h-8 w-8 text-gray-700" />
          </div>
        )}
        <div className="mb-2">
          {type === 'pie' && (
            <div className="relative w-16 h-16 mx-auto">
              <svg className="transform -rotate-90 w-full h-full">
                <circle
                  className="text-gray-200"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r="30"
                  cx="32"
                  cy="32"
                />
                <circle
                  className="text-blue-500"
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 30}
                  strokeDashoffset={2 * Math.PI * 30 * (1 - (value || 0) / 100)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="30"
                  cx="32"
                  cy="32"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm">
                {value}%
              </span>
            </div>
          )}
          {type === 'progress' && (
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${value || 0}%` }}
              />
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -left-[10%] -top-[10%] w-[40%] h-[40%] rounded-full bg-blue-200 blur-[100px] opacity-30"></div>
        <div className="absolute -right-[20%] top-[20%] w-[50%] h-[50%] rounded-full bg-purple-200 blur-[100px] opacity-30"></div>
        <div className="absolute left-[10%] -bottom-[10%] w-[45%] h-[45%] rounded-full bg-pink-200 blur-[100px] opacity-30"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 backdrop-blur-xl bg-white/30 px-4 py-2 rounded-full transition-all duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span className="text-sm font-light">Back to Dashboard</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-lg border border-white/20 overflow-hidden">
            <div className="h-[400px]">
              <MapContainer
                center={[0, 0]}
                zoom={2}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {projectData.countries?.map((country, index) => (
                  <Marker key={index} position={[0, 0]}>
                    <Popup>{country}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-8 shadow-lg border border-white/20">
            <h2 className="text-3xl font-extralight text-gray-900 mb-8">Project Information</h2>
            <div className="space-y-6">
              <div className="group">
                <span className="text-sm font-light text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                  Continent
                </span>
                <p className="text-lg font-light text-gray-900">{projectData.continent}</p>
              </div>
              <div className="group">
                <span className="text-sm font-light text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                  Countries
                </span>
                <p className="text-lg font-light text-gray-900">{projectData.countries?.join(', ')}</p>
              </div>
              <div className="group">
                <span className="text-sm font-light text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                  Cities
                </span>
                <p className="text-lg font-light text-gray-900">{projectData.cities}</p>
              </div>
              <div className="group">
                <span className="text-sm font-light text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                  Program Duration
                </span>
                <p className="text-lg font-light text-gray-900">
                  {formatDate(projectData.start_date)} – {formatDate(projectData.end_date)}
                </p>
              </div>
              <div className="group">
                <span className="text-sm font-light text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                  Planned Budget
                </span>
                <p className="text-lg font-light text-gray-900">{formatCurrency(projectData.budget)}</p>
              </div>
              <div className="group">
                <span className="text-sm font-light text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                  Number of Participants
                </span>
                <p className="text-lg font-light text-gray-900">{projectData.beneficiaries}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-8 shadow-lg border border-white/20 mb-8">
          <h2 className="text-3xl font-extralight text-gray-900 mb-4">Project Description</h2>
          <p className="text-gray-600 leading-relaxed font-light">
            {projectData.long_description}
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-8 shadow-lg border border-white/20 mb-8">
          <h2 className="text-3xl font-extralight text-gray-900 mb-8 text-center">
            Activity Monitoring | In real time
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-light mb-4">Key Milestones</h3>
              <div className="space-y-3">
                {milestones.map(milestone => (
                  <div key={milestone.id} className="flex items-center space-x-3">
                    <div className={`h-3 w-3 rounded-full ${
                      milestone.status_milestone === 'completed' ? 'bg-green-500' :
                      milestone.status_milestone === 'in_progress' ? 'bg-yellow-500' :
                      'bg-gray-300'
                    }`} />
                    <span className="text-sm font-light">{milestone.name_milestone}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-light mb-4">Resources</h3>
              <div className="space-y-3">
                {resources.map(resource => (
                  <div key={resource.id} className="p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                    <a
                      href={resource.link_resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600"
                    >
                      <h4 className="font-medium">{resource.title_resource}</h4>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-light mb-4">Press Links</h3>
              <div className="space-y-3">
                {pressLinks.map(link => (
                  <div key={link.id} className="p-4 rounded-xl bg-white/50 backdrop-blur-sm">
                    <a
                      href={link.press_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {link.press_url}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {renderDataViz(
              projectData.dv1_titre,
              projectData.dv1_vizualisation_type,
              projectData.dv1_value,
              projectData.dv1_nom_icon,
              projectData.dv1_short_description
            )}
            {renderDataViz(
              projectData.dv2_titre,
              projectData.dv2_vizualisation_type,
              projectData.dv2_value,
              projectData.dv2_nom_icon,
              projectData.dv2_short_description
            )}
            {renderDataViz(
              projectData.dv3_titre,
              projectData.dv3_vizualisation_type,
              projectData.dv3_value,
              projectData.dv3_nom_icon,
              projectData.dv3_short_description
            )}
            {renderDataViz(
              projectData.dv4_titre,
              projectData.dv4_vizualisation_type,
              projectData.dv4_value,
              projectData.dv4_nom_icon,
              projectData.dv4_short_description
            )}
            {renderDataViz(
              projectData.dv5_titre,
              projectData.dv5_vizualisation_type,
              projectData.dv5_value,
              projectData.dv5_nom_icon,
              projectData.dv5_short_description
            )}
            <div className="p-6 rounded-xl bg-white/50 backdrop-blur-sm text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-sm font-light">Budget Progress</p>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${(projectData.money_spent / projectData.budget) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-sm">
                {formatCurrency(projectData.money_spent)} / {formatCurrency(projectData.budget)}
              </p>
            </div>
          </div>
        </div>

        {/* Photo Gallery Section */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-8 shadow-lg border border-white/20 mb-8">
          <h2 className="text-3xl font-extralight text-gray-900 mb-8 text-center">
            Project Gallery
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square rounded-lg overflow-hidden group relative"
              >
                <img
                  src={photo.la_photo}
                  alt="Project"
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300" />
              </div>
            ))}
          </div>
          
          {photos.length === 0 && (
            <p className="text-center text-gray-500 italic">No photos available</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-8 shadow-lg border border-white/20">
            <h3 className="text-xl font-light mb-6">Team</h3>
            <div className="space-y-4">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xl font-medium text-gray-600">
                      {member.first_name[0]}{member.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{member.first_name} {member.last_name}</p>
                    <p className="text-sm text-gray-500">{member.job_title}</p>
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/70 rounded-3xl p-8 shadow-lg border border-white/20">
            <h3 className="text-xl font-light mb-6">Media Coverage</h3>
            <div className="space-y-4">
              {pressLinks.map((link, index) => (
                <a
                  key={link.id}
                  href={link.press_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Press Coverage {index + 1}
                      </span>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {link.press_url}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </a>
              ))}
              
              {pressLinks.length === 0 && (
                <p className="text-center text-gray-500 italic">No press coverage available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}