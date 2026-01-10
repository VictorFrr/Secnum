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

    // Simuler l'envoi d'email (dans une vraie application, ceci appellerait une API backend)
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`;
    
    // Sauvegarder le token de réinitialisation
    const updatedUsers = users.map(u => 
      u.email === forgotEmail 
        ? { ...u, resetToken: resetToken, resetTokenExpiry: Date.now() + 3600000 } // Token valide 1h
        : u
    );
    saveUsers(updatedUsers);

    // Simuler l'envoi d'email
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
      score: currentUser?.modules?.[1]?.score || 0,
      icon: Globe,
      bgColor: "#5B9BD5"
    },
    {
      id: 2,
      title: "Sécurité de l'authentification",
      timeSpent: currentUser?.modules?.[2]?.timeSpent || 0,
      score: currentUser?.modules?.[2]?.score || 0,
      icon: Shield,
      bgColor: "#F4B942"
    },
    {
      id: 3,
      title: "Sécurité sur Internet",
      timeSpent: currentUser?.modules?.[3]?.timeSpent || 0,
      score: currentUser?.modules?.[3]?.score || 0,
      icon: Wifi,
      bgColor: "#D97373"
    },
    {
      id: 4,
      title: "Sécurité du poste de travail et nomadisme",
      timeSpent: currentUser?.modules?.[4]?.timeSpent || 0,
      score: currentUser?.modules?.[4]?.score || 0,
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
    // Forgot Password Form
    if (showForgotPassword) {
      return (
        <div className="min-h-screen relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' fill='none' stroke='%23003d5c' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}></div>

          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="mr-4" style={{ color: '#003d5c' }}>
                  <Mail size={80} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold" style={{ color: '#003d5c' }}>Mot de passe oublié</h1>
                  <p className="text-lg text-gray-500">SecNum académie</p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Votre adresse email"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#5B9BD5] hover:bg-[#4A8AC4] text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
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
                  className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-full transition-all"
                >
                  Retour à la connexion
                </button>
              </form>
            </div>

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

    // Register Form
    if (showRegister) {
      return (
        <div className="min-h-screen relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' fill='none' stroke='%23003d5c' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}></div>

          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
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
                  <h1 className="text-5xl font-bold" style={{ color: '#003d5c' }}>SecNum</h1>
                  <p className="text-3xl italic text-gray-500">académie</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">ANSSI</p>
            </div>

            <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
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
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Nom d'utilisateur"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Adresse email"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Mot de passe (min. 6 caractères)"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Confirmer le mot de passe"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#F4B942] hover:bg-[#E5A832] text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
                >
                  CRÉER MON COMPTE
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(false);
                    setError('');
                  }}
                  className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-full transition-all"
                >
                  Retour à la connexion
                </button>
              </form>
            </div>

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

    // Login Form
    return (
      <div className="min-h-screen relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' fill='none' stroke='%23003d5c' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }}></div>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
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
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-[#5B9BD5] hover:text-[#4A8AC4] font-medium"
                >
                  Mot de passe oublié ?
                </button>
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

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-[#003d5c] text-white flex flex-col">
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

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center space-x-3 p-3 rounded hover:bg-[#004d73] transition">
                <User size={20} />
                <span>Mon profil</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-[#004d73]">
          <div className="mb-2 px-3 py-2 bg-[#004d73] rounded">
            <p className="text-xs text-gray-300">Connecté en tant que</p>
            <p className="text-sm font-semibold">{currentUser?.username}</p>
          </div>
          <a href="#" className="flex items-center space-x-3 p-3 rounded hover:bg-[#004d73] transition">
            <HelpCircle size={20} />
            <span>Aide</span>
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-end p-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow transition-colors border border-gray-200"
          >
            <LogOut size={18} />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 mx-4">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Le MOOC de l'ANSSI SecNumacadémie ne sera plus disponible sur cette plateforme à partir du 28 février 2026.</strong>
          </p>
          <p className="text-sm text-gray-600">
            Tout parcours commencé d'ici-là devra donc être complété avant fin février. Soyez rassurés : Une nouvelle version de cette formation en ligne est en préparation et viendra lui succéder. Les contenus de la version actuelle du MOOC sont accessibles gratuitement au format SCORM pour les entités disposant d'un Learning management système (LMS) sur demande à l'adresse suivante : <a href="mailto:secnumacademie@ssi.gouv.fr" className="text-blue-600 underline">secnumacademie@ssi.gouv.fr</a>
          </p>
        </div>

        <div className="px-8 pb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">MODULES</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module) => {
              const IconComponent = module.icon;
              return (
                <div key={module.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
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

                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2 font-medium">MODULE {module.id}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{module.title}</h3>
                    
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span>Temps passé : {formatTime(module.timeSpent)}</span>
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

export default SecNumAcademy;-3 rounded hover:bg-[#004d73] transition">
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
              <a href="#" className="flex items-center space-x-3 p
