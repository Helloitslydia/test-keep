import React, { useState, useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const user = useAuthStore((state) => state.user);
  const [organizationName, setOrganizationName] = useState(user?.organizationName || '');
  const [organizationImage, setOrganizationImage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch initial organization data
  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!user?.organizationId) return;

      try {
        const { data, error } = await supabase
          .from('organisations')
          .select('image_url, facebook_url, twitter_url, instagram_url, linkedin_url')
          .eq('id', user.organizationId)
          .single();

        if (error) throw error;

        if (data) {
          setOrganizationImage(data.image_url || '');
          setSocialLinks({
            facebook: data.facebook_url || '',
            twitter: data.twitter_url || '',
            instagram: data.instagram_url || '',
            linkedin: data.linkedin_url || ''
          });
        }
      } catch (err) {
        console.error('Error fetching organization data:', err);
      }
    };

    if (isOpen) {
      fetchOrganizationData();
    }
  }, [isOpen, user?.organizationId]);

  const handleSave = async () => {
    if (!user?.organizationId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Update organization name in auth metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          organization_name: organizationName
        }
      });

      if (updateError) throw updateError;

      // Update organization in organizations table
      const { error: orgUpdateError } = await supabase
        .from('organisations')
        .update({
          name: organizationName,
          image_url: organizationImage,
          facebook_url: socialLinks.facebook || null,
          twitter_url: socialLinks.twitter || null,
          instagram_url: socialLinks.instagram || null,
          linkedin_url: socialLinks.linkedin || null
        })
        .eq('id', user.organizationId);

      if (orgUpdateError) throw orgUpdateError;

      // Update local state in auth store
      useAuthStore.setState((state) => ({
        user: {
          ...state.user!,
          organizationName
        }
      }));

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = 'Settings saved successfully';
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);

      onClose();
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setOrganizationImage(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-light mb-6">Organization Settings</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name
            </label>
            <input
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="input-field"
              placeholder="Enter organization name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Image
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? 'border-black bg-gray-50' : 'border-gray-300'
              } cursor-pointer`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleImageDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {organizationImage ? (
                <img
                  src={organizationImage}
                  alt="Organization"
                  className="max-h-32 mx-auto mb-4"
                />
              ) : (
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              )}
              <p className="text-sm text-gray-500">
                Drag and drop an image here, or click to select
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Social Media Links</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="url"
                value={socialLinks.facebook}
                onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                className="input-field"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                X (Twitter)
              </label>
              <input
                type="url"
                value={socialLinks.twitter}
                onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                className="input-field"
                placeholder="https://twitter.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={socialLinks.instagram}
                onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                className="input-field"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={socialLinks.linkedin}
                onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                className="input-field"
                placeholder="https://linkedin.com/company/..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}