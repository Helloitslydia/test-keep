import React, { useState } from 'react';
import { Sidebar } from '../components/editor/Sidebar';
import { Pencil, Image } from 'lucide-react';

export function DomainName() {
  const [domain, setDomain] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [savedDomain, setSavedDomain] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isEditingImage, setIsEditingImage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedDomain(domain);
    setIsEditing(false);
  };

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingImage(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1">
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-3xl font-light text-gray-900">Nom de domaine</h1>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de domaine
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="input-field"
                    placeholder="Enter domain name"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <button type="submit" className="btn-primary">
                    Save
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditing(false);
                      setDomain(savedDomain);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Domain Name
                  </label>
                  <p className="text-lg">{savedDomain || 'No domain set'}</p>
                </div>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setDomain(savedDomain);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Pencil className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-light mb-4">Organization Image</h2>
            {isEditingImage ? (
              <form onSubmit={handleImageSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="input-field"
                    placeholder="Enter image URL"
                    required
                  />
                </div>
                {imageUrl && (
                  <div className="mt-2">
                    <img
                      src={imageUrl}
                      alt="Organization"
                      className="max-w-xs rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                <div className="flex space-x-2">
                  <button type="submit" className="btn-primary">
                    Save Image
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditingImage(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                {imageUrl ? (
                  <div className="flex items-center space-x-4">
                    <img
                      src={imageUrl}
                      alt="Organization"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <button
                      onClick={() => setIsEditingImage(true)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingImage(true)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Image className="h-5 w-5" />
                    <span>Add Organization Image</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}