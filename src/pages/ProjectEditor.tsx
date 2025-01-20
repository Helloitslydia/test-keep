import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/editor/Sidebar';
import Toggle from 'react-toggle';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toggle/style.css';

const statusOptions = [
  { value: 'just_started', label: 'Just started' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' }
];

const countries = [
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
  { value: 'in', label: 'India' },
  { value: 'br', label: 'Brazil' }
];

const continents = [
  { value: 'africa', label: 'Africa' },
  { value: 'asia', label: 'Asia' },
  { value: 'europe', label: 'Europe' },
  { value: 'north_america', label: 'North America' },
  { value: 'south_america', label: 'South America' },
  { value: 'oceania', label: 'Oceania' },
  { value: 'antarctica', label: 'Antarctica' }
];

interface Country {
  value: string;
  label: string;
}

export function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    isOnline: false,
    status: statusOptions[0],
    projectName: '',
    budget: '',
    startDate: new Date(),
    endDate: new Date(),
    selectedCountries: [] as Country[],
    cities: '',
    continent: null,
    beneficiaries: '',
    shortDescription: '',
    longDescription: ''
  });

  useEffect(() => {
    const fetchProject = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      if (!id || id === 'undefined') {
        navigate('/dashboard');
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            navigate('/dashboard');
            return;
          }
          throw fetchError;
        }

        if (data) {
          setFormData({
            isOnline: data.is_online || false,
            status: statusOptions.find(s => s.value === data.status) || statusOptions[0],
            projectName: data.title || '',
            budget: data.budget?.toString() || '',
            startDate: data.start_date ? new Date(data.start_date) : new Date(),
            endDate: data.end_date ? new Date(data.end_date) : new Date(),
            selectedCountries: data.countries?.map(c => countries.find(country => country.value === c))
              .filter(Boolean) || [],
            cities: data.cities || '',
            continent: continents.find(c => c.value === data.continent) || null,
            beneficiaries: data.beneficiaries?.toString() || '',
            shortDescription: data.short_description || '',
            longDescription: data.long_description || ''
          });
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project data');
        setTimeout(() => navigate('/dashboard'), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, user, navigate]);

  const handleSave = async () => {
    if (!id || !user) {
      setError('Missing project ID or user information');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          is_online: formData.isOnline,
          status: formData.status.value,
          title: formData.projectName,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          start_date: formData.startDate.toISOString(),
          end_date: formData.endDate.toISOString(),
          countries: formData.selectedCountries.map(c => c.value),
          cities: formData.cities,
          continent: formData.continent?.value,
          beneficiaries: formData.beneficiaries ? parseInt(formData.beneficiaries) : null,
          short_description: formData.shortDescription,
          long_description: formData.longDescription,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg';
      successMessage.textContent = 'Changes saved successfully';
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);

    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to save project changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-64 flex-1 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1">
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-3xl font-light text-gray-900">{formData.projectName || 'Edit Project'}</h1>
        </div>
        
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-light mb-6">General Information</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Project Status
                </label>
                <Toggle
                  checked={formData.isOnline}
                  onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                />
                <span className="text-sm text-gray-600">
                  {formData.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Phase
                </label>
                <Select
                  value={formData.status}
                  onChange={(value) => value && setFormData({ ...formData, status: value })}
                  options={statusOptions}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planned Budget (in euros)
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start of Programme
                  </label>
                  <DatePicker
                    selected={formData.startDate}
                    onChange={(date) => date && setFormData({ ...formData, startDate: date })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End of Programme
                  </label>
                  <DatePicker
                    selected={formData.endDate}
                    onChange={(date) => date && setFormData({ ...formData, endDate: date })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Countries
                </label>
                <Select
                  isMulti
                  value={formData.selectedCountries}
                  onChange={(value) => setFormData({ ...formData, selectedCountries: value as Country[] })}
                  options={countries}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cities
                </label>
                <input
                  type="text"
                  value={formData.cities}
                  onChange={(e) => setFormData({ ...formData, cities: e.target.value })}
                  className="input-field"
                  placeholder="Separate multiple cities with commas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Continent
                </label>
                <Select
                  value={formData.continent}
                  onChange={(value) => setFormData({ ...formData, continent: value })}
                  options={continents}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Beneficiaries
                </label>
                <input
                  type="number"
                  value={formData.beneficiaries}
                  onChange={(e) => setFormData({ ...formData, beneficiaries: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="input-field"
                  maxLength={150}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Long Description
                </label>
                <textarea
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  className="input-field min-h-[150px]"
                  rows={5}
                  maxLength={500}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}