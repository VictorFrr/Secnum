import React, { useState } from 'react';
import { Home, Book, FileText, User, HelpCircle, Clock, Star, Globe, Shield, Wifi, Monitor, LogOut } from 'lucide-react';

const SecNumAcademy = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    // Connexion réussie même avec des champs vides pour la démo
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setRememberMe(false);
  };

  const modules = [
    {
      id: 1,
      title: "Panorama de la SSI",
      timeSpent: "03:38:16",
      score: 44,
      icon: Globe,
      bgColor: "#5B9BD5"
    },
    {
      id: 2,
      title: "Sécurité de l'authentification",
      timeSpent: "02:04:28",
      score: 0,
      icon: Shield,
      bgColor: "#F4B942"
    },
    {
      id: 3,
      title: "Sécurité sur Internet",
      timeSpent: "00:00:00",
      score: 0,
      icon: Wifi,
      bgColor: "#D97373"
    },
    {
      id: 4,
      title: "Sécurité du poste de travail et nomadisme",
      timeSpent: "00:00:00",
      score: 0,
      icon: Monitor,
      bgColor: "#70AD47"
    }
  ];

  // Login Page
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        {/* Hexagonal Pattern Background */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' fill='none' stroke='%23003d5c' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}></div>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          {/* Logo Section */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="mr-4" style={{ color: '#003d5c' }}>
                <svg width="80" height="80" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 10 L20 25 L20 50 C20 70 35 85 50 90 C65 85 80 70 80 50 L80 25 Z"/>
                  <rect x="45" y="60" width="10" height="15" fill="currentColor"/>
                  <circle cx="50" cy="60" r="3" fill="white"/>
                </svg>
              </div>
              <div>
                <h1 className="text-5xl font-bold" style={{ color: '#003d5c' }}>
                  SecNum
                </h1>
                <p className="text-3xl italic text-gray-500">académie</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600">ANSSI</p>
          </div>

          {/* Login Form */}
          <div className="w-full max-w-md">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-0 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                  placeholder="Identifiant"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border-0 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
                  placeholder="Mot de passe"
                />
              </div>

              <div className="flex items-center justify-between px-2">
                <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded"
                  />
                  <span>Se souvenir de moi</span>
                </label>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700 italic">
                  Identifiant ou mot de passe oublié ?
                </a>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="flex-1 px-6 py-4 bg-[#F4B942] hover:bg-[#E5A832] text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
                >
                  CRÉER UN COMPTE
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-[#5B9BD5] hover:bg-[#4A8AC4] text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
                >
                  CONNEXION
                </button>
              </div>
            </form>
          </div>

          {/* ANSSI Logo at Bottom */}
          <div className="mt-16">
            <div className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center">
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" fill="#003d5c"/>
                <circle cx="50" cy="50" r="38" fill="white"/>
                <path d="M35 50 L45 60 L65 40" stroke="#003d5c" strokeWidth="4" fill="none"/>
                <path d="M50 20 L70 35 L70 50 L50 65 L30 50 L30 35 Z" fill="#E1000F"/>
                <path d="M50 30 L60 37 L60 50 L50 57 L40 50 L40 37 Z" fill="#0055A4"/>
                <text x="50" y="85" textAnchor="middle" fill="#003d5c" fontSize="10" fontWeight="bold">ANSSI</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#003d5c] text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#004d73]">
          <div className="flex items-center space-x-3">
            <div className="text-white">
              <svg width="35" height="35" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 10 L20 25 L20 50 C20 70 35 85 50 90 C65 85 80 70 80 50 L80 25 Z"/>
                <rect x="45" y="60" width="10" height="15" fill="currentColor"/>
                <circle cx="50" cy="60" r="3" fill="#003d5c"/>
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg">SecNum</h1>
              <p className="text-xs italic">académie</p>
              <p className="text-[10px]">ANSSI</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center space-x-3 p-3 rounded hover:bg-[#004d73] transition">
                <Home size={20} />
                <span>Accueil</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 p-3 rounded hover:bg-[#004d73] transition">
                <Book size={20} />
                <span>Mes ressources</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 p-3 rounded hover:bg-[#004d73] transition">
                <FileText size={20} />
                <span>Mon attestation</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 p-3 rounded hover:bg-[#004d73] transition">
                <User size={20} />
                <span>Mon profil</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Help Button */}
        <div className="p-4 border-t border-[#004d73]">
          <a href="#" className="flex items-center space-x-3 p-3 rounded hover:bg-[#004d73] transition">
            <HelpCircle size={20} />
            <span>Aide</span>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Logout Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow transition-colors border border-gray-200"
          >
            <LogOut size={18} />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>

        {/* Header Alert */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 mx-4">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Le MOOC de l'ANSSI SecNumacadémie ne sera plus disponible sur cette plateforme à partir du 28 février 2026.</strong>
          </p>
          <p className="text-sm text-gray-600">
            Tout parcours commencé d'ici-là devra donc être complété avant fin février. Soyez rassurés : Une nouvelle version de cette formation en ligne est en préparation et viendra lui succéder. Les contenus de la version actuelle du MOOC sont accessibles gratuitement au format SCORM pour les entités disposant d'un Learning management système (LMS) sur demande à l'adresse suivante : <a href="mailto:secnumacademie@ssi.gouv.fr" className="text-blue-600 underline">secnumacademie@ssi.gouv.fr</a>
          </p>
        </div>

        {/* Modules Section */}
        <div className="px-8 pb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">MODULES</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module) => {
              const IconComponent = module.icon;
              return (
                <div key={module.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Module Image Header */}
                  <div 
                    className="h-48 flex items-center justify-center relative"
                    style={{ backgroundColor: module.bgColor }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <IconComponent size={120} className="text-white" />
                    </div>
                    <div className="relative z-10 text-white text-center">
                      <IconComponent size={64} className="mx-auto mb-2" />
                    </div>
                  </div>

                  {/* Module Content */}
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2 font-medium">MODULE {module.id}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{module.title}</h3>
                    
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span>Temps passé : {module.timeSpent}</span>
                      </div>
                      <div className="flex items-center">
                        <Star size={16} className={`mr-2 ${module.score > 0 ? 'text-[#F4B942]' : 'text-gray-400'}`} fill={module.score > 0 ? '#F4B942' : 'none'} />
                        <span className={`font-bold ${module.score > 0 ? 'text-[#F4B942]' : 'text-gray-600'}`}>
                          Score : {module.score}%
                        </span>
                      </div>
                    </div>

                    <button 
                      className="w-full bg-[#F4B942] hover:bg-[#E5A832] text-white font-semibold py-3 rounded-full transition-colors"
                    >
                      Afficher les unités
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 text-sm text-gray-600 border-t">
          <div className="flex justify-between items-center">
            <span>© 2026 ANSSI</span>
            <a href="#" className="text-blue-600 hover:underline">Mentions légales</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecNumAcademy;