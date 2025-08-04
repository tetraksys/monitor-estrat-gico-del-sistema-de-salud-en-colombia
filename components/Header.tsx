
import React from 'react';

const Header: React.FC = () => {
  // Using an inline SVG for the logo for simplicity
  const Logo = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white flex-shrink-0">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 4.5L7 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <header className="bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Logo />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Monitor Estratégico del Sistema de Salud en Colombia
            </h1>
            <p className="text-sm text-slate-200 mt-2">
              Análisis en tiempo real sobre flujos financieros, regulación, acceso a innovación y narrativa política.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
