import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, Users, LogOut, Menu, X, LogIn, Loader2, Share2, Copy, Check, Settings, KeyRound, Sparkles } from 'lucide-react';
import { useSchemaStore } from '../store';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import AuthModal from './AuthModal';

const Navbar = () => {
  const location = useLocation();
  const { user, setUser, saveProject, currentProjectName, toggleSettings, isSettingsOpen, apiKey, setApiKey, guestUsage, maxGuestUsage, checkGuestUsage } = useSchemaStore();
  const [showAuth, setShowAuth] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const isEditor = location.pathname === '/editor';

  // New styling for links
  const isActive = (path: string) => location.pathname === path 
    ? "text-primary-700 font-semibold bg-primary-50" 
    : "text-slate-600 hover:text-primary-700 hover:bg-slate-50";

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open to prevent background scrolling
  useEffect(() => {
    if (isMenuOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => {
        document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    // Refresh guest usage on load
    checkGuestUsage();

    if (isSupabaseConfigured()) {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser({ id: session.user.id, email: session.user.email! }, session);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
             if (session?.user) {
                setUser({ id: session.user.id, email: session.user.email! }, session);
            } else {
                setUser(null, null);
            }
        });

        return () => subscription.unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
      await supabase.auth.signOut();
      setUser(null, null);
      setIsMenuOpen(false);
  };

  const handleShare = async () => {
      setIsSharing(true);
      try {
        // Attempt to save project to cloud to generate an ID
        // If ID exists, it updates; otherwise, it creates new.
        const id = await saveProject(currentProjectName);
        
        if (id) {
            // Cloud share mode
            setShareUrl(`${window.location.origin}${window.location.pathname}#/editor?id=${id}`);
            setShowShare(true);
        } else {
            // Fallback: Client-side URL encoding
            const { exportProjectState } = useSchemaStore.getState();
            const encoded = exportProjectState();
            if (encoded) {
                setShareUrl(`${window.location.origin}${window.location.pathname}#/editor?data=${encoded}`);
                setShowShare(true);
            } else {
                 alert("Failed to generate a shareable link. The project might be too large.");
            }
        }
      } catch (error) {
          console.error("Share failed", error);
          alert("An unexpected error occurred while sharing.");
      } finally {
          setIsSharing(false);
      }
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => {
    const baseClasses = mobile 
      ? "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full" 
      : "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2";
    
    return (
      <>
        {/* On Mobile, show a Home link explicitly */}
        {mobile && (
            <Link to="/" className={`${baseClasses} ${isActive('/')}`}>
                Home
            </Link>
        )}
        <Link to="/editor" className={`${baseClasses} ${isActive('/editor')}`}>
            Editor
        </Link>
        <Link to="/ai" className={`${baseClasses} ${isActive('/ai')}`}>
            <Sparkles size={16} className={location.pathname === '/ai' ? "text-primary-600" : "text-slate-400"} />
            AI Generator
        </Link>
         <Link to="/templates" className={`${baseClasses} ${isActive('/templates')}`}>
            Templates
        </Link>
        <Link to="/docs" className={`${baseClasses} ${isActive('/docs')}`}>
            Docs
        </Link>
      </>
    );
  };
  
  // Logic for Red Dot on Settings:
  // Only show if user has hit the limit and still hasn't added a key.
  const isLimitReached = !apiKey && (guestUsage >= maxGuestUsage);

  return (
    <>
        <nav className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 md:px-12 flex items-center justify-between border-b border-transparent transition-all">
            <div className="flex items-center gap-2.5 z-50">
                <div className="w-9 h-9 bg-primary-700 rounded-lg flex items-center justify-center shadow-lg shadow-primary-700/20">
                    <Database className="text-white" size={20} strokeWidth={2.5} />
                </div>
                <Link to="/" className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                    SchemaForge
                </Link>
                
                {isEditor && (
                    <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-300 ml-2">
                         <span className="text-sm font-medium text-slate-500">/</span>
                         <span className="text-sm font-semibold text-slate-800">{currentProjectName}</span>
                    </div>
                )}
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center gap-1">
                <NavLinks />
            </div>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center gap-4">
                <button 
                    onClick={() => toggleSettings(true)}
                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors relative"
                    title="Settings & API Key"
                >
                    <Settings size={20} />
                    {isLimitReached && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                    )}
                </button>

                {user ? (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-600 font-medium max-w-[150px] truncate">{user.email}</span>
                        <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors" title="Log Out">
                            <LogOut size={18} />
                        </button>
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner">
                            {user.email[0].toUpperCase()}
                        </div>
                    </div>
                ) : (
                   isSupabaseConfigured() && (
                       <button 
                           onClick={() => setShowAuth(true)}
                           className="text-sm font-semibold text-slate-600 hover:text-primary-700 transition-colors"
                       >
                           Sign In
                       </button>
                   )
                )}
                
                {isEditor ? (
                    <button 
                        onClick={handleShare}
                        disabled={isSharing}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary-700/20 hover:shadow-primary-700/30 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSharing ? <Loader2 size={18} className="animate-spin" /> : <Users size={18} />} Collaborate
                    </button>
                ) : (
                    <Link to="/editor" className="flex items-center gap-2 px-5 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary-700/20 hover:shadow-primary-700/30">
                         Try it for yourself <span className="text-primary-200">→</span>
                    </Link>
                )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
                className="md:hidden p-2 text-slate-600 hover:text-primary-700 z-50 rounded-lg hover:bg-slate-100 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
            >
                <Menu size={24} />
            </button>
        </nav>
        
        {/* Mobile Sidebar Navigation (Right Slide-out) */}
        <>
            {/* Backdrop */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
            
            {/* Sidebar Drawer */}
            <div className={`fixed inset-y-0 right-0 z-[70] w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out md:hidden flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                    <span className="font-bold text-slate-800 text-lg">Menu</span>
                    <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <NavLinks mobile />
                    </div>

                    <div className="h-px bg-slate-100 w-full"></div>

                    <div className="flex flex-col gap-3">
                         <button 
                            onClick={() => { toggleSettings(true); setIsMenuOpen(false); }}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors w-full"
                         >
                            <Settings size={18} /> Settings & API Key
                         </button>

                         {user ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {user.email[0].toUpperCase()}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-xs text-slate-500 font-semibold uppercase">Signed in as</span>
                                        <span className="text-sm text-slate-800 font-medium truncate">{user.email}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full border border-transparent hover:border-red-100"
                                >
                                    <LogOut size={18} /> Log Out
                                </button>
                            </div>
                        ) : (
                            isSupabaseConfigured() && (
                                <button 
                                    onClick={() => { setShowAuth(true); setIsMenuOpen(false); }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors w-full"
                                >
                                    <LogIn size={18} /> Sign In
                                </button>
                            )
                        )}
                        
                        {isEditor ? (
                            <button 
                                onClick={() => { handleShare(); setIsMenuOpen(false); }}
                                disabled={isSharing}
                                className="mt-2 flex items-center justify-center gap-2 px-4 py-3.5 bg-primary-700 text-white rounded-xl text-sm font-bold w-full shadow-lg shadow-primary-700/20 active:scale-[0.98] transition-all"
                            >
                                {isSharing ? <Loader2 size={20} className="animate-spin" /> : <Users size={20} />} Collaborate
                            </button>
                        ) : (
                            <Link to="/editor" className="mt-2 flex items-center justify-center gap-2 px-4 py-3.5 bg-primary-700 text-white rounded-xl text-sm font-bold w-full shadow-lg shadow-primary-700/20 active:scale-[0.98] transition-all">
                                Try it for yourself
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
        
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        {showShare && <ShareModal url={shareUrl} onClose={() => setShowShare(false)} />}
        {isSettingsOpen && <SettingsModal />}
    </>
  );
};

const SettingsModal = () => {
    const { apiKey, setApiKey, toggleSettings, guestUsage, maxGuestUsage } = useSchemaStore();
    const [localKey, setLocalKey] = useState(apiKey);
    const [showKey, setShowKey] = useState(false);

    const handleSave = () => {
        setApiKey(localKey);
        toggleSettings(false);
    };

    const remaining = Math.max(0, maxGuestUsage - guestUsage);

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-200 animate-in scale-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Settings size={20} className="text-primary-600" /> Settings
                    </h3>
                    <button onClick={() => toggleSettings(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="space-y-4">
                    {!apiKey && remaining > 0 && (
                         <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                            <span className="font-bold">Guest Mode Active:</span> You have {remaining}/{maxGuestUsage} free generations left today. You don't need a key yet!
                         </div>
                    )}
                    
                    {!apiKey && remaining === 0 && (
                         <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
                            <span className="font-bold">Limit Reached:</span> You've used your free daily quota. Please add your own key below to continue.
                         </div>
                    )}

                    <div>
                        <label className="text-sm font-semibold text-slate-700 mb-1 block">Gemini API Key</label>
                        <p className="text-xs text-slate-500 mb-3">
                            Required for unlimited AI generation. Your key is stored locally in your browser.
                        </p>
                        <div className="relative">
                            <input 
                                type={showKey ? "text" : "password"}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-10 pr-12 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                placeholder="Enter your Gemini API Key"
                                value={localKey}
                                onChange={(e) => setLocalKey(e.target.value)}
                            />
                            <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <button 
                                onClick={() => setShowKey(!showKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary-600 hover:text-primary-800"
                            >
                                {showKey ? "HIDE" : "SHOW"}
                            </button>
                        </div>
                         <p className="text-[10px] text-slate-400 mt-2">
                             Don't have a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Get one from Google AI Studio</a>.
                         </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                     <button onClick={() => toggleSettings(false)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors">
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-6 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                    >
                        Save Settings
                    </button>
                </div>
             </div>
        </div>
    );
};

const ShareModal = ({ url, onClose }: { url: string, onClose: () => void }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-200 animate-in scale-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Share2 size={20} className="text-primary-600" /> Share Project
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    Invite others to collaborate or view your schema. Anyone with this link can access the project.
                </p>

                <div className="flex gap-2">
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-600 font-mono truncate select-all">
                        {url}
                    </div>
                    <button 
                        onClick={handleCopy}
                        className="bg-primary-700 hover:bg-primary-800 text-white px-4 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                </div>

                <div className="mt-6 flex justify-end">
                     <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-800 font-medium">
                        Done
                    </button>
                </div>
             </div>
        </div>
    );
}

export default Navbar;