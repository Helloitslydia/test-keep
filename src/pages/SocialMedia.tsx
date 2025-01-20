import React from 'react';
import { Sidebar } from '../components/editor/Sidebar';
import { Linkedin, Facebook, Instagram } from 'lucide-react';

export function SocialMedia() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1">
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-3xl font-light text-gray-900">Social Media</h1>
          <div className="flex space-x-4 mt-4">
            <Linkedin className="h-8 w-8 text-[#0A66C2]" />
            <Facebook className="h-8 w-8 text-[#1877F2]" />
            <Instagram className="h-8 w-8 text-[#E4405F]" />
          </div>
        </div>
        
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-8">
            {/* LinkedIn Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Connect your social networks - LinkedIn</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  The keyword to save only posts related to this keyword
                </label>
                <input type="text" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input type="email" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input type="password" className="input-field" />
              </div>
            </div>

            {/* Facebook Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Connect your social networks - Facebook</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  The keyword to save only posts related to this keyword
                </label>
                <input type="text" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input type="email" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input type="password" className="input-field" />
              </div>
            </div>

            {/* Instagram Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Connect your social networks - Instagram</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  The keyword to save only posts related to this keyword
                </label>
                <input type="text" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input type="email" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input type="password" className="input-field" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}