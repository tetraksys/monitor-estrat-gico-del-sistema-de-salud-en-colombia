
import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen font-sans text-slate-800">
      <Header />
      <main className="p-4 md:p-8">
        <Dashboard />
      </main>
    </div>
  );
};

export default App;
