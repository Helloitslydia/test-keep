import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, Calendar, Users, MapPin, ExternalLink, Search, Filter } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

interface Project {
  id: string;
  title: string;
  short_description: string;
  start_date: string;
  end_date: string;
  beneficiaries: number | null;
  countries: string[];
  cities: string;
  is_online: boolean;
  status: 'just_started' | 'in_progress' | 'completed';
}

export function Monitoring() {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const user = useAuthStore((state) => state.user);
  const [showProjects, setShowProjects] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const fetchProjects = async () => {
    if (!user?.organizationId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', user.organizationId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProjects(data || []);
      setFilteredProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showProjects) {
      applyFilters();
    }
  }, [searchQuery, statusFilter, dateFilter, projects]);

  const applyFilters = () => {
    let filtered = [...projects];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.short_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.countries?.some(country => country.toLowerCase().includes(searchQuery.toLowerCase())) ||
        project.cities?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Apply date filter
    const now = new Date();
    if (dateFilter === 'active') {
      filtered = filtered.filter(project => {
        const endDate = project.end_date ? new Date(project.end_date) : null;
        return endDate ? endDate >= now : false;
      });
    } else if (dateFilter === 'completed') {
      filtered = filtered.filter(project => {
        const endDate = project.end_date ? new Date(project.end_date) : null;
        return endDate ? endDate < now : false;
      });
    }

    setFilteredProjects(filtered);
  };

  const handleConsultClick = async () => {
    await fetchProjects();
    setShowProjects(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const renderFilterBar = () => (
    <div className="mb-8">
      <div className="backdrop-blur-xl bg-white/30 rounded-2xl border border-white/20 p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-white/50 border border-white/20 rounded-lg hover:bg-white/60 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            <span>Filters</span>
          </button>
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 bg-white/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">All Statuses</option>
                <option value="just_started">Just Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Date filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as 'all' | 'active' | 'completed')}
                className="w-full px-4 py-2 bg-white/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">All Time</option>
                <option value="active">Active Projects</option>
                <option value="completed">Completed Projects</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600 mt-2">
        Showing {filteredProjects.length} of {projects.length} projects
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Background image with lighter overlay for iOS 7 style */}
      <div className="fixed inset-0 -z-20">
        <img
          src="https://af394c170e9ffeadce0ce4575f7674d3.cdn.bubble.io/f1687958760340x540867982441213500/27295710_l_normal_none.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/60" />
      </div>

      {/* iOS 7 style thin translucent bars */}
      <div className="fixed top-0 inset-x-0 h-[1px] bg-white/20 z-10" />
      <div className="fixed bottom-0 inset-x-0 h-[1px] bg-white/20 z-10" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center">
        {!showProjects ? (
          <div className="flex-1 flex items-center justify-center w-full max-w-2xl mx-auto px-4">
            <div className="backdrop-blur-xl bg-white/30 rounded-3xl p-12 border border-white/20 w-full">
              <div className="text-center space-y-12">
                <h1 className="text-[3rem] font-extralight tracking-tight text-gray-800">
                  Follow{' '}
                  <span className="relative inline-block">
                    <span className="font-light text-gray-900">
                      {user?.organizationName}
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-[0.5px] bg-gray-200" />
                  </span>
                  <br />
                  <span className="text-gray-600">projects in real time</span>
                </h1>

                <button 
                  onClick={handleConsultClick}
                  className="group relative overflow-hidden px-10 py-2.5 rounded-full bg-gradient-to-b from-blue-400 to-blue-500 text-white font-light text-base transition-all duration-300 hover:opacity-90 active:opacity-100"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="tracking-wide">Consult</span>
                    <ChevronRight className="ml-1.5 h-4 w-4 stroke-[1.5] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>

                <div className="flex justify-center space-x-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300/60" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto px-4 py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extralight text-gray-900">
                {user?.organizationName} Projects
              </h2>
              <p className="text-gray-600 mt-2 font-light">
                Real-time overview of all active projects
              </p>
            </div>

            {/* Filter bar */}
            {renderFilterBar()}

            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="backdrop-blur-xl bg-white/30 rounded-2xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-light text-gray-900">
                          {project.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          project.is_online 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.is_online ? 'Online' : 'Offline'}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-6">
                        {project.short_description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {formatDate(project.start_date)} - {formatDate(project.end_date)}
                          </span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{project.beneficiaries?.toLocaleString() || 'No'} beneficiaries</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>
                            {project.countries?.join(', ') || 'No countries'} - {project.cities || 'No cities'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/project/${project.id}`)}
                        className="mt-6 w-full flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <span>View Details</span>
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredProjects.length === 0 && !isLoading && !error && (
              <div className="text-center text-gray-500">
                No projects found matching your filters
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}