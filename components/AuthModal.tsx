import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { useSchemaStore } from '../store';

const AuthModal = ({ onClose }: { onClose: () => void }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setUser } = useSchemaStore();

    const handleAuth = async () => {
        if (!email || !password) return;
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                if (data.user && data.session) {
                    setUser({ id: data.user.id, email: data.user.email! }, data.session);
                    onClose();
                }
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                if (data.user) {
                     alert("Check your email for the confirmation link!");
                     onClose();
                }
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-dark-surface border border-dark-border rounded-xl shadow-2xl w-full max-w-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Email</label>
                        <input 
                            type="email" 
                            className="w-full bg-dark-bg border border-dark-border rounded p-2 text-white outline-none focus:border-blue-500"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-dark-bg border border-dark-border rounded p-2 text-white outline-none focus:border-blue-500"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded border border-red-500/20">{error}</div>}

                    <button 
                        onClick={handleAuth}
                        disabled={loading}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : (isLogin ? <LogIn size={16} /> : <UserPlus size={16} />)}
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>

                    <div className="text-center text-sm text-gray-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button 
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;