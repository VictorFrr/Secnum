import React, { useState, useEffect } from 'react';
import { Home, Book, FileText, User, HelpCircle, Clock, Star, Globe, Shield, Wifi, Monitor, LogOut, Mail, ChevronRight } from 'lucide-react';

const SecNumAcademy = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedModule, setSelectedModule] = useState(null);

  const moduleUnitsData = {
    1: [
      { id: 1, title: "Un monde numérique hyper-connecté", timeSpent: 3420, score: 90 },
      { id: 2, title: "Un monde à hauts risques", timeSpent: 4680, score: 100 },
      { id: 3, title: "Les acteurs de la cybersécurité", timeSpent: 5340, score: 80 },
      { id: 4, title: "Protéger le cyberespace", timeSpent: 3900, score: 90 },
      { id: 5, title: "Les règles d'or de la sécurité", timeSpent: 4200, score: 100 }
    ],
    2: [
      { id: 1, title: "Principes de l'authentification", timeSpent: 3780, score: 90 },
      { id: 2, title: "Attaques sur les mots de passe", timeSpent: 4920, score: 100 },
      { id: 3, title: "Sécurité de ses mots de passe", timeSpent: 3240, score: 80 },
      { id: 4, title: "Gérer ses mots de passe", timeSpent: 4560, score: 90 },
      { id: 5, title: "Notions de cryptographie", timeSpent: 5100, score: 80 }
    ],
    3: [
      { id: 1, title: "Internet : de quoi s'agit-il ?", timeSpent: 3420, score: 80 },
      { id: 2, title: "Les fichiers en provenance d'Internet", timeSpent: 0, score: 0 },
      { id: 3, title: "La navigation web", timeSpent: 0, score: 0 },
      { id: 4, title: "L'envers du décor d'une connexion Web", timeSpent: 0, score: 0 },
      { id: 5, title: "La messagerie électronique", timeSpent: 0, score: 0 }
    ],
    4: [
      { id: 1, title: "Applications et mises à jour", timeSpent: 0, score: 0 },
      { id: 2, title: "Options de configuration de base", timeSpent: 0, score: 0 },
      { id: 3, title: "Configurations complémentaires", timeSpent: 0, score: 0 },
      { id: 4, title: "Sécurité des périphériques amovibles", timeSpent: 0, score: 0 },
      { id: 5, title: "Séparation des usages", timeSpent: 0, score: 0 }
    ]
  };

  const handleLogin = () => {
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setSelectedModule(null);
  };

  const modules = [
    { id: 1, title: "Panorama de la SSI", totalTime: 21540, avgScore: 90 },
    { id: 2, title: "Sécurité de l'authentification", totalTime: 21600, avgScore: 80 },
    { id: 3, title: "Sécurité sur Internet", totalTime: 3420, avgScore: 10 },
    { id: 4, title: "Sécurité du poste de travail et nomadisme", totalTime: 0, avgScore: 0 }
  ];

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!isLoggedIn) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img/FondSecNum.jpg')" }}
      >
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="mb-10 text-center">
            <img src="/img/logo-secnum.png" alt="SecNum Académie" className="h-32 mx-auto" />
          </div>

          <div className="w-full max-w-md space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-6 py-4 bg-white border border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm font-bold"
                placeholder="Identifiant"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full px-6 py-4 bg-[#64A8E1] hover:bg-[#4A8AC4] text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl text-sm tracking-wide"
            >
              CONNEXION
            </button>
          </div>

          <div className="mt-20">
            <img src="/img/logo-anssi.png" alt="ANSSI" className="h-36 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (selectedModule) {
    const module = modules.find(m => m.id === selectedModule);
    const units = moduleUnitsData[selectedModule];

    return (
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 bg-[#00416B] text-white flex flex-col">
          <div className="py-3 px-4 bg-[#003051] flex items-center justify-center">
            <img src="/img/logo-secnum-white.png" alt="SecNum Académie" className="h-12 w-auto object-contain" />
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <a href="#" onClick={() => setSelectedModule(null)} className="flex items-center space-x-3 p-3 rounded hover:bg-[#003051] transition">
                  <img src="/icon/house.png" alt="Accueil" className="w-5 h-5 flex-shrink-0 object-contain" />
                  <span className="font-bold">Accueil</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded hover:bg-[#003051] transition">
                  <img src="/icon/ressources.png" alt="Ressources" className="w-5 h-5 flex-shrink-0 object-contain" />
                  <span className="font-bold">Mes ressources</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded hover:bg-[#003051] transition">
                  <img src="/icon/attestation.png" alt="Attestation" className="w-5 h-5 flex-shrink-0 object-contain" />
                  <span className="font-bold">Mon attestation</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-3 p-3 rounded hover:bg-[#003051] transition">
                  <img src="/icon/accueil.png" alt="Profil" className="w-5 h-5 flex-shrink-0 object-contain" />
                  <span className="font-bold">Mon profil</span>
                </a>
              </li>
            </ul>
          </nav>

          <a href="#" className="h-[75px] px-6 bg-[#003051] hover:bg-[#002540] transition-colors cursor-pointer flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <HelpCircle size={20} className="flex-shrink-0" style={{ color: '#4289DB' }} />
              <span className="font-bold" style={{ color: '#4289DB' }}>Aide</span>
            </div>
          </a>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          {/* Barre blanche avec déconnexion */}
          <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-100 rounded-lg shadow-sm transition-colors border border-gray-200"
            >
              <img src="/icon/deconnexion.png" alt="Déconnexion" className="w-5 h-5" />
            </button>
          </div>

          {/* Barre d'avertissement */}
          <div className="bg-blue-50 border-l-4 border-blue-500 px-8 py-6 mx-8 my-6">
            <p className="text-sm text-gray-700 mb-2 font-bold">
              Le MOOC de l'ANSSI SecNumacadémie ne sera plus disponible sur cette plateforme à partir du 28 février 2026.
            </p>
            <p className="text-sm text-gray-600 font-bold">
              Tout parcours commencé d'ici-là devra donc être complété avant fin février. Les contenus sont accessibles au format SCORM sur demande : <a href="mailto:secnumacademie@ssi.gouv.fr" className="text-blue-600 underline">secnumacademie@ssi.gouv.fr</a>
            </p>
          </div>

          <div className="px-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Module {selectedModule} : {module.title}</h1>
            
            <button
              onClick={() => setSelectedModule(null)}
              className="flex items-center space-x-2 text-white bg-[#64A8E1] hover:bg-[#4A8AC4] font-bold rounded-full transition-colors mb-8"
              style={{ width: '102px', height: '38px', paddingLeft: '12px' }}
            >
              <ChevronRight size={16} className="transform rotate-180" />
              <span>Accueil</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {units.map((unit) => (
                <div key={unit.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow" style={{ width: '620px' }}>
                  <div className="relative group" style={{ height: '207px' }}>
                    <img 
                      src={`/module/Module${selectedModule}_Unit${unit.id}.png`} 
                      alt={unit.title}
                      className="w-full h-full object-cover group-hover:brightness-50 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="relative bg-gray-400" style={{ height: '18px' }}>
                    <div 
                      className="absolute top-0 left-0 h-full transition-all duration-500 bg-[#2FAC66]"
                      style={{ width: `100%` }}
                    ></div>
                  </div>

                  <div className="bg-white" style={{ height: '265px', paddingLeft: '12px', paddingRight: '12px', paddingTop: '18px' }}>
                    <div className="text-sm text-gray-400 font-bold">UNITÉ {unit.id}</div>
                    <h3 className="text-xl font-bold text-gray-800" style={{ marginTop: '37px', marginBottom: '40px' }}>{unit.title}</h3>
                    
                    <div className="flex items-center text-sm" style={{ marginBottom: '38px', gap: '135px' }}>
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span className="font-bold">Temps passé : {formatTime(unit.timeSpent)}</span>
                      </div>
                      <div className="flex items-center">
                        <Star size={16} className="mr-2 text-[#F4B942]" fill="#F4B942" />
                        <span className="font-bold text-black">
                          Score : {unit.score}%
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        className="bg-[#2FAC66] hover:bg-[#1A6038] text-white font-bold rounded-full transition-colors"
                        style={{ width: '281px', height: '34px' }}
                      >
                        Commencer
                      </button>
                      <button 
                        className={`${unit.score >= 80 ? 'bg-[#2FAC66] hover:bg-[#1A6038]' : 'bg-[#F5B607] hover:bg-[#8F610E]'} text-white font-bold rounded-full transition-colors`}
                        style={{ width: '281px', height: '34px' }}
                      >
                        S'évaluer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-8 py-4 text-sm text-gray-600 border-t mt-8 font-bold">
            <div className="flex justify-between items-center">
              <span>© 2026 ANSSI</span>
              <a href="#" className="text-blue-600 hover:underline">Mentions légales</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-[#00416B] text-white flex flex-col">
        <div className="py-3 px-4 bg-[#003051] flex items-center justify-center">
          <img src="/img/logo-secnum-white.png" alt="SecNum Académie" className="h-12 w-auto object-contain" />
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a href="#" onClick={() => setSelectedModule(null)} className="flex items-center space-x-3 p-3 rounded hover:bg-[#003051] transition">
                <img src="/icon/house.png" alt="Accueil" className="w-5 h-5 flex-shrink-0 object-contain" />
                <span className="font-bold">Accueil</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 p-3 rounded hover:bg-[#003051] transition">
                <img src="/icon/ressources.png" alt="Ressources" className="w-5 h-5 flex-shrink-0 object-contain" />
                <span className="font-bold">Mes ressources</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 p-3 rounded hover:bg-[#003051] transition">
                <img src="/icon/attestation.png" alt="Attestation" className="w-5 h-5 flex-shrink-0 object-contain" />
                <span className="font-bold">Mon attestation</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center space-x-3 p-3 rounded hover:bg-[#003051] transition">
                <img src="/icon/accueil.png" alt="Profil" className="w-5 h-5 flex-shrink-0 object-contain" />
                <span className="font-bold">Mon profil</span>
              </a>
            </li>
          </ul>
        </nav>

        <a href="#" className="h-[75px] px-6 bg-[#003051] hover:bg-[#002540] transition-colors cursor-pointer flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <HelpCircle size={20} className="flex-shrink-0" style={{ color: '#4289DB' }} />
            <span className="font-bold" style={{ color: '#4289DB' }}>Aide</span>
          </div>
        </a>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        {/* Barre blanche avec déconnexion */}
        <div className="bg-white px-8 py-4 flex justify-end">
          <button
            onClick={handleLogout}
            className="hover:opacity-70 transition-opacity"
          >
            <img src="/icon/deconnexion.png" alt="Déconnexion" className="w-6 h-6" />
          </button>
        </div>

        {/* Barre d'avertissement */}
        <div className="bg-blue-50 border-l-4 border-blue-500 px-8 py-6 mx-8 my-6">
          <p className="text-sm text-gray-700 mb-2 font-bold">
            Le MOOC de l'ANSSI SecNumacadémie ne sera plus disponible sur cette plateforme à partir du 28 février 2026.
          </p>
          <p className="text-sm text-gray-600 font-bold">
            Tout parcours commencé d'ici-là devra donc être complété avant fin février. Soyez rassurés : Une nouvelle version de cette formation en ligne est en préparation et viendra lui succéder. Les contenus de la version actuelle du MOOC sont accessibles gratuitement au format SCORM pour les entités disposant d'un Learning management système (LMS) sur demande à l'adresse suivante : <a href="mailto:secnumacademie@ssi.gouv.fr" className="text-blue-600 underline">secnumacademie@ssi.gouv.fr</a>
          </p>
        </div>

        <div className="px-8 pb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">MODULES</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12" style={{ marginLeft: '0px' }}>
            {modules.map((module) => {
              return (
                <div 
                  key={module.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow" 
                  style={{ width: '620px' }}
                >
                  <div className="relative group" style={{ height: '207px' }}>
                    <img 
                      src={`/module/Module${module.id}.png`} 
                      alt={module.title}
                      className="w-full h-full object-cover group-hover:brightness-[0.3] transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedModule(module.id)}
                    />
                  </div>
                  
                  <div className="relative bg-gray-400" style={{ height: '18px' }}>
                    <div 
                      className="absolute top-0 left-0 h-full transition-all duration-500 bg-[#2FAC66]"
                      style={{ width: `100%` }}
                    ></div>
                  </div>

                  <div className="bg-white" style={{ height: '265px', paddingLeft: '12px', paddingRight: '12px', paddingTop: '18px' }}>
                    <div className="text-sm text-gray-400 font-bold">MODULE {module.id}</div>
                    <h3 className="text-xl font-bold text-gray-800" style={{ marginTop: '37px', marginBottom: '40px' }}>{module.title}</h3>
                    
                    <div className="flex items-center text-sm" style={{ marginBottom: '38px', gap: '135px' }}>
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span className="font-bold">Temps passé : {formatTime(module.totalTime)}</span>
                      </div>
                      <div className="flex items-center">
                        <Star size={16} className="mr-2 text-[#F4B942]" fill="#F4B942" />
                        <span className="font-bold text-black">
                          Score : {module.avgScore}%
                        </span>
                      </div>
                    </div>
                    <button 
                      className="bg-[#F4B942] hover:bg-[#E5A832] text-white font-bold rounded-full transition-colors"
                      style={{ width: '280px', height: '37px' }}
                      onClick={() => setSelectedModule(module.id)}
                    >
                      Afficher les unités
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-8 py-4 text-sm text-gray-600 border-t font-bold">
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
