import React, { useState, useEffect } from 'react';
import { Home, Book, FileText, User, HelpCircle, Clock, Star, Globe, Shield, Wifi, Monitor, LogOut } from 'lucide-react';

const SecNumAcademy = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Charger les utilisateurs depuis le stockage au démarrage
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      // Initialiser avec des comptes par défaut si la base est vide
      const usersResult = await window.storage.get('users-database');
      if (!usersResult) {
        const defaultUsers = [
          { username: 'admin', password: 'admin123', email: 'admin@secnum.fr', createdAt: new Date().toISOString() },
          { username: 'demo', password: 'demo123', email: 'demo@secnum.fr', createdAt: new Date().toISOString() }
        ];
        await window.storage.set('users-database', JSON.stringify(defaultUsers));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllUsers = async () => {
    try {
      const result = await window.storage.get('users-database');
      return result ? JSON.parse(result.value) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  };

  const saveUsers = async (users) => {
    try {
      await window.storage.set('users-database', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
      return false;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const users = await getAllUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setError('');
      
      // Sauvegarder la session si "Se souvenir de moi" est coché
      if (rememberMe) {
        localStorage.setItem('secnum-user', JSON.stringify(user));
      }
    } else {
      setError('Identifiant ou mot de passe incorrect');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

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

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setError('Adresse email invalide');
      return;
    }

    const users = await getAllUsers();
    
    // Vérifier si l'utilisateur existe déjà
    const userExists = users.find(u => u.username === registerData.username);
    if (userExists) {
      setError('Ce nom d\'utilisateur existe déjà');
      return;
    }

    // Vérifier si l'email existe déjà
    const emailExists = users.find(u => u.email === registerData.email);
    if (emailExists) {
      setError('Cette adresse email est déjà utilisée');
      return;
    }

    // Créer le nouveau compte
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
    const saved = await saveUsers(users);

    if (saved) {
      setUsername(registerData.username);
      setPassword(registerData.password);
      setShowRegister(false);
      setError('');
      alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
    } else {
      setError('Erreur lors de la création du compte. Veuillez réessayer.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUsername('');
    setPassword('');
    setRememberMe(false);
    localStorage.removeItem('secnum-user');
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

    return (
      <div className="min-h-screen relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' fill='none' stroke='%230
