import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { PlayCircle, PlusCircle, Settings, Globe } from 'lucide-react';
import { AddProjectModal } from './AddProjectModal';
import { SettingsModal } from './SettingsModal';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const user = useAuthStore((state) => state.user);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddProject = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsAddProjectOpen(true);
  };

  const handleWebsiteClick = () => {
    if (user?.organizationId) {
      navigate(`/monitoring/${user.organizationId}`);
    } else {
      navigate('/monitoring');
    }
  };

  return (
    <div className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-light text-gray-900">
                Hello {user?.firstName}
              </h1>
              <p className="text-sm text-gray-600 mt-1">Organisation: {user?.organizationName || 'Loading...'}</p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={handleWebsiteClick}
                className="btn-secondary flex items-center"
              >
                <Globe className="mr-2 h-5 w-5" />
                Site Web
              </button>
              <button className="btn-secondary flex items-center">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch tutorial
              </button>
              <button 
                onClick={handleAddProject}
                className="btn-primary flex items-center"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add project
              </button>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AddProjectModal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
      />
    </div>
  );
}