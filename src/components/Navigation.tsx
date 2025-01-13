import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const Navigation: React.FC = () => {
  const isModalOpen = useSelector((state: RootState) => state.transactions.isModalOpen);

  return (
    <nav className={`fixed top-0 w-full bg-white shadow-lg transition-opacity duration-300 ${isModalOpen ? 'opacity-0' : 'opacity-100'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-gray-900">Dashboard</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Analytics</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Settings</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Profile</a>
          </div>
        </div>
      </div>
    </nav>
  );
};
