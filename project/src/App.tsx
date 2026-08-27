import { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import EducationalPage from './components/EducationalPage';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'educational'>('landing');

  if (currentView === 'landing') {
    return (
      <LandingPage
        onEnter={() => setCurrentView('dashboard')}
        onEducational={() => setCurrentView('educational')}
      />
    );
  }

  if (currentView === 'educational') {
    return <EducationalPage onBack={() => setCurrentView('landing')} />;
  }

  return <Dashboard onBack={() => setCurrentView('landing')} />;
}

export default App;
