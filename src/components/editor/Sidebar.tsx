import React from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  ArrowLeft,
  FolderKanban,
  Milestone,
  FileBox,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  Users,
  Image,
  Newspaper,
} from 'lucide-react';

const navItems = [
  { icon: FolderKanban, label: 'General Information', path: '/project/:id/edit' },
  { icon: Milestone, label: 'Key Milestones', path: '/project/:id/milestones' },
  { icon: FileBox, label: 'Resources', path: '/project/:id/resources' },
  { icon: BarChart3, label: 'Dataviz 1', path: '/project/:id/dataviz/1' },
  { icon: PieChart, label: 'Dataviz 2', path: '/project/:id/dataviz/2' },
  { icon: LineChart, label: 'Dataviz 3', path: '/project/:id/dataviz/3' },
  { icon: BarChart3, label: 'Dataviz 4', path: '/project/:id/dataviz/4' },
  { icon: PieChart, label: 'Dataviz 5', path: '/project/:id/dataviz/5' },
  { icon: DollarSign, label: 'Budget spent', path: '/project/:id/budget' },
  { icon: Users, label: 'Team', path: '/project/:id/team' },
  { icon: Image, label: 'Picture', path: '/project/:id/picture' },
  { icon: Newspaper, label: 'Press', path: '/project/:id/press' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="https://e5c2eae5631116d71a41f379337b0582.cdn.bubble.io/f1732792043421x255623216349219360/Capture_d_e%CC%81cran_2024-11-28_a%CC%80_12.06.56-removebg-preview.png"
              alt="Organization Logo"
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-gray-900">{user?.organizationName || 'Loading...'}</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            // Replace :id in the path with the actual project ID
            const path = item.path.replace(':id', id || '');
            
            return (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}