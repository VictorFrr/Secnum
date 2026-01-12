import React, { useState, useEffect } from 'react';
import { Home, Book, FileText, User, HelpCircle, Clock, Star, Globe, Shield, Wifi, Monitor, LogOut, Mail } from 'lucide-react';

const SecNumAcademy = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [forgotEmail, setForgotEmail] = useState('');
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      setIsLoading(true);
      const usersData = localStorage.getItem('secnum-users-database');
      
      if (!usersData) {
        localStorage.setItem('secnum-users-database', JSON.stringify([]));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllUsers = () => {
    try {
      const usersData = localStorage.getItem('secnum-users-database');
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  };

  const saveUsers = (users) => {
    try {
      localStorage.setItem('secnum-users-database', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
      return false;
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!username || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const users = getAllUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setError('');
      
      if (rememberMe) {
        localStorage.setItem('secnum-current-user', JSON.stringify(user));
      }
    } else {
      setError('Identifiant ou mot de passe incorrect');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!registerData.username || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setError('Adresse email invalide');
      return;
    }

    const users = getAllUsers();
    
    const userExists = users.find(u => u.username === registerData.username);
    if (userExists) {
      setError('Ce nom d\'utilisateur existe déjà');
      return;
    }

    const emailExists = users.find(u => u.email === registerData.email);
    if (emailExists) {
      setError('Cette adresse email est déjà utilisée');
      return;
    }

    const newUser = {
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
      createdAt: new Date().toISOString(),
      modules: {
        1: { timeSpent: 0, score: 0 },
        2: { timeSpent: 0, score: 0 },
        3: { timeSpent: 0, score: 0 },
        4: { timeSpent: 0, score: 0 }
      }
    };

    users.push(newUser);
    const saved = saveUsers(users);

    if (saved) {
      setShowRegister(false);
      setError('');
      setSuccess('✅ Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      setUsername(registerData.username);
      setPassword(registerData.password);
      setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
    } else {
      setError('Erreur lors de la création du compte. Veuillez réessayer.');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!forgotEmail) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      setError('Adresse email invalide');
      return;
    }

    const users = getAllUsers();
    const user = users.find(u => u.email === forgotEmail);

    if (!user) {
      setError('Aucun compte associé à cette adresse email');
      return;
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`;
    
    const updatedUsers = users.map(u => 
      u.email === forgotEmail 
        ? { ...u, resetToken: resetToken, resetTokenExpiry: Date.now() + 3600000 }
        : u
    );
    saveUsers(updatedUsers);

    console.log(`
═══════════════════════════════════════════════════════
📧 EMAIL DE RÉINITIALISATION
═══════════════════════════════════════════════════════
À: ${forgotEmail}
De: noreply@secnumacademie.fr
Sujet: Réinitialisation de votre mot de passe SecNum

Bonjour ${user.username},

Vous avez demandé la réinitialisation de votre mot de passe.

Votre mot de passe actuel est: ${user.password}

Vous pouvez également utiliser ce lien pour le réinitialiser:
${resetLink}

Ce lien expire dans 1 heure.

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

Cordialement,
L'équipe SecNum Académie
═══════════════════════════════════════════════════════
    `);

    setSuccess(`✅ Un email a été envoyé à ${forgotEmail} avec les instructions de réinitialisation.\n\n📋 Pour cette démo, votre mot de passe est: ${user.password}\n(Vérifiez aussi la console du navigateur)`);
    setForgotEmail('');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUsername('');
    setPassword('');
    setRememberMe(false);
    localStorage.removeItem('secnum-current-user');
  };

  const modules = [
    {
      id: 1,
      title: "Panorama de la SSI",
      timeSpent: currentUser?.modules?.[1]?.timeSpent || 0,
      score: currentUser?.modules?.[1]?.score || 75,
      icon: Globe,
      bgColor: "#5B9BD5"
    },
    {
      id: 2,
      title: "Sécurité de l'authentification",
      timeSpent: currentUser?.modules?.[2]?.timeSpent || 0,
      score: currentUser?.modules?.[2]?.score || 75,
      icon: Shield,
      bgColor: "#F4B942"
    },
    {
      id: 3,
      title: "Sécurité sur Internet",
      timeSpent: currentUser?.modules?.[3]?.timeSpent || 0,
      score: currentUser?.modules?.[3]?.score || 75,
      icon: Wifi,
      bgColor: "#D97373"
    },
    {
      id: 4,
      title: "Sécurité du poste de travail et nomadisme",
      timeSpent: currentUser?.modules?.[4]?.timeSpent || 0,
      score: currentUser?.modules?.[4]?.score || 75,
      icon: Monitor,
      bgColor: "#70AD47"
    }
  ];

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#003d5c] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    if (showForgotPassword) {
      return (
        <div 
          className="min-h-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/img/FondSecNum.jpg')" }}
        >
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="mb-10 text-center">
              <img src="/img/logo-secnum.png" alt="SecNum Académie" className="h-32 mx-auto" />
            </div>

            <div className="w-full max-w-md bg-white/98 rounded-2xl shadow-2xl p-8">
              <div className="flex items-center justify-center mb-6">
                <Mail size={40} className="text-[#003d5c] mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Mot de passe oublié</h2>
              </div>
              
              <p className="text-center text-gray-600 mb-6">
                Entrez votre adresse email et nous vous enverrons les instructions pour réinitialiser votre mot de passe.
              </p>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm whitespace-pre-line">
                  {success}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Votre adresse email"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-[#64A8E1] hover:bg-[#4A8AC4] text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl text-sm tracking-wide"
                >
                  ENVOYER LE LIEN
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="w-full px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-full transition-all"
                >
                  Retour à la connexion
                </button>
              </form>
            </div>

            <div className="mt-20">
              <img src="/img/logo-anssi.png" alt="ANSSI" className="h-36 mx-auto" />
            </div>
          </div>
        </div>
      );
    }

    if (showRegister) {
      return (
        <div 
          className="min-h-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/img/FondSecNum.jpg')" }}
        >
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="mb-10 text-center">
              <img src="/img/logo-secnum.png" alt="SecNum Académie" className="h-32 mx-auto" />
            </div>

            <div className="w-full max-w-md bg-white/98 rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Créer un compte</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                    className="w-full px-6 py-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Nom d'utilisateur"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    className="w-full px-6 py-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Adresse email"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    className="w-full px-6 py-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Mot de passe (min. 6 caractères)"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    className="w-full px-6 py-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Confirmer le mot de passe"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-[#F4B942] hover:bg-[#E5A832] text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl text-sm tracking-wide"
                >
                  CRÉER MON COMPTE
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(false);
                    setError('');
                  }}
                  className="w-full px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-full transition-all"
                >
                  Retour à la connexion
                </button>
              </form>
            </div>

            <div className="mt-20">
              <img src="/img/logo-anssi.png" alt="ANSSI" className="h-36 mx-auto" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img/FondSecNum.jpg')" }}
      >
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="mb-10 text-center">
            <img src="/img/logo-secnum.png" alt="SecNum Académie" className="h-32 mx-auto" />
          </div>

          <div className="w-full max-w-md">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm text-center">
                {success}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-6 py-4 bg-white border border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                  placeholder="Identifiant"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-white border border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                  placeholder="Mot de passe"
                />
              </div>

              <div className="flex items-center justify-between px-4 text-sm">
                <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded"
                  />
                  <span>Se souvenir de moi</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-gray-500 hover:text-gray-700 italic"
                >
                  Identifiant ou mot de passe oublié ?
                </button>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="flex-1 px-6 py-4 bg-[#F4B942] hover:bg-[#E5A832] text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl text-sm tracking-wide"
                >
                  CRÉER UN COMPTE
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-[#64A8E1] hover:bg-[#4A8AC4] text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl text-sm tracking-wide"
                >
                  CONNEXION
                </button>
              </div>
            </form>
          </div>

          <div className="mt-20">
            <img src="/img/logo-anssi.png" alt="ANSSI" className="h-36 mx-auto" />
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
              <a href="#" className="flex items-center space-x-3 p-3 rounded hover:bg-[#003051] transition">
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

      <div className="flex-1 overflow-y-auto">
        {/* Barre du haut avec bouton déconnexion - 65px */}
        <div className="h-[65px] bg-white flex items-center justify-end px-6" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.25)' }}>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-lg transition-colors"
            title="Déconnexion"
          >
            <img src="/icon/deconnexion.png" alt="Déconnexion" className="w-5 h-5" />
          </button>
        </div>

        {/* Barre d'avertissement - 137px */}
        <div className="h-[137px] bg-white flex items-center px-10 mb-6" style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.25)' }}>
          <div className="max-w-[calc(100%-361px)] mt-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-extrabold text-gray-900">Le MOOC de l'ANSSI SecNumacadémie ne sera plus disponible sur cette plateforme à partir du 28 février 2026.</span>
              <br /><br />
              Tout parcours commencé d'ici-là devra donc être complété avant fin février. Soyez rassurés : Une nouvelle version de cette formation en ligne est en préparation et viendra lui succéder. Les contenus de la version actuelle du MOOC sont accessibles gratuitement au format SCORM pour les entités disposant d'un Learning management système (LMS) sur demande à l'adresse suivante : <a href="mailto:secnumacademie@ssi.gouv.fr" className="underline" style={{ color: '#F4B066' }}>secnumacademie@ssi.gouv.fr</a>
            </p>
          </div>
        </div>

        <div style={{ marginLeft: '60px', marginRight: '314px' }}>
          <h2 className="text-3xl font-bold text-gray-800" style={{ marginBottom: '100px' }}>MODULES</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '30px' }}>
            {modules.map((module) => {
              return (
                <div key={module.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow" style={{ width: '620px' }}>
                  <div className="relative" style={{ height: '207px' }}>
                    <img 
                      src={`/module/Module${module.id}.png`} 
                      alt={module.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Barre grise avec barre de progression */}
                  <div className="relative bg-[#808080]" style={{ height: '18px' }}>
                    <div 
                      className="absolute top-0 left-0 h-full bg-[#3E8EF7] transition-all duration-500 ease-out"
                      style={{ width: `${module.score}%` }}
                    ></div>
                  </div>

                  <div className="p-6 bg-white" style={{ height: '265px' }}>
                    <div className="text-sm text-gray-500 mb-2 font-bold">MODULE {module.id}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{module.title}</h3>
                    
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span className="font-bold">Temps passé : {formatTime(module.timeSpent)}</span>
                      </div>
                      <div className="flex items-center">
                        <Star size={16} className={`mr-2 ${module.score > 0 ? 'text-[#F4B942]' : 'text-gray-400'}`} fill={module.score > 0 ? '#F4B942' : 'none'} />
                        <span className={`font-bold ${module.score > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          Score : {module.score}%
                        </span>
                      </div>
                    </div>

                    <button 
                      className="w-full bg-[#F4B942] hover:bg-[#E5A832] text-white font-bold py-3 rounded-full transition-colors"
                    >
                      Afficher les unités
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
