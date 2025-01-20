import React from 'react';
import { Header } from '../components/dashboard/Header';
import { ProjectList } from '../components/dashboard/ProjectList';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectList />
      </main>
    </div>
  );
}