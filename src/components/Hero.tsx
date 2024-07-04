import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gray-800 text-white h-screen flex flex-col justify-center items-center text-center p-4">
      <div className="absolute inset-0 bg-cover bg-center opacity-40 z-0" style={{ backgroundImage: "url('/path-to-your-background-image.jpg')" }}></div>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-gray-900 opacity-80 z-1"></div>
      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4 leading-tight">
          Welcome to Spot Rover
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl mb-8 max-w-3xl mx-auto leading-relaxed">
          Discover parkings and adventures with ease.
        </p>
        <a href="/map" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full shadow-lg transition-transform hover:scale-105">
          Get Started
        </a>
      </div>
    </div>
  );
};

export default Hero;
