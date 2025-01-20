import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import { Dashboard } from './pages/Dashboard';
import { ProjectEditor } from './pages/ProjectEditor';
import { ProjectView } from './pages/ProjectView';
import { KeyMilestones } from './pages/KeyMilestones';
import { Resources } from './pages/Resources';
import { DataViz1 } from './pages/DataViz1';
import { DataViz2 } from './pages/DataViz2';
import { DataViz3 } from './pages/DataViz3';
import { DataViz4 } from './pages/DataViz4';
import { DataViz5 } from './pages/DataViz5';
import { BudgetSpent } from './pages/BudgetSpent';
import { Team } from './pages/Team';
import { Picture } from './pages/Picture';
import { Press } from './pages/Press';
import { Monitoring } from './pages/Monitoring';
import { useAuthStore } from './store/authStore';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/monitoring/:orgId?"
          element={
            <PrivateRoute>
              <Monitoring />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <PrivateRoute>
              <ProjectView />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id/edit"
          element={
            <PrivateRoute>
              <ProjectEditor />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id/milestones"
          element={
            <PrivateRoute>
              <KeyMilestones />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id/resources"
          element={
            <PrivateRoute>
              <Resources />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id/dataviz/1"
          element={
            <PrivateRoute>
              <DataViz1 />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id/dataviz/2"
          element={
            <PrivateRoute>
              <DataViz2 />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id/dataviz/3"
          element={
            <PrivateRoute>
              <DataViz3 />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id/dataviz/4"
          element={
            <PrivateRoute>
              <DataViz4 />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id/dataviz/5"
          element={
            <PrivateRoute>
              <DataViz5 />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id/budget"
          element={
            <PrivateRoute>
              <BudgetSpent />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id/team"
          element={
            <PrivateRoute>
              <Team />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id/picture"
          element={
            <PrivateRoute>
              <Picture />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id/press"
          element={
            <PrivateRoute>
              <Press />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;