import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Loader2, AlertCircle, Play, Settings, Battery, Zap } from 'lucide-react';
import { generateSchemaFromPrompt } from '../services/ai';
import { useSchemaStore } from '../store';

const AIGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loadSchema, apiKey, toggleSettings, guestUsage, maxGuestUsage, checkGuestUsage } = useSchemaStore();
  const navigate = useNavigate();

  useEffect(() => {
      // Check limits on mount to update UI state
      checkGuestUsage();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const tables = await generateSchemaFromPrompt(prompt);
      loadSchema(tables);
      navigate('/editor');
    } catch (err: any) {
      if (err.message === 'API_KEY_MISSING') {
          // If the system key is completely missing from env, warn the user they might need a key
          setError("Guest mode unavailable. Please configure your API Key in Settings.");
          toggleSettings(true);
      } else if (err.message === 'LIMIT_REACHED') {
          // This will trigger the UI to show the limit reached block below
          setError(null); // Clear generic error, rely on isLimitReached
          // Re-check usage to ensure UI updates immediately
          await checkGuestUsage();
      } else {
          setError("Failed to generate schema. Please try a different prompt.");
      }
    } finally {
      setLoading(false);
    }
  };

  const remaining = Math.max(0, maxGuestUsage - guestUsage);
  // We consider the limit reached ONLY if no user key is set AND remaining is 0.
  const isLimitReached = !apiKey && remaining === 0;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4 md:p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          {/* Decorative Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary-50 rounded-xl border border-primary-100">
                <Wand2 className="text-primary-600" size={24} />
            </div>
            <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">AI Schema Generator</h1>
                {!apiKey ? (
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Free Daily Quota:</span>
                        <div className="flex items-center gap-1">
                            {Array.from({length: maxGuestUsage}).map((_, i) => (
                                <div key={i} className={`w-2 h-4 rounded-sm ${i < remaining ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                            ))}
                        </div>
                        <span className="text-xs text-slate-400 font-mono">({remaining}/{maxGuestUsage})</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-green-600 uppercase tracking-wider">
                         <Zap size={12} fill="currentColor" /> Unlimited Mode Active
                    </div>
                )}
            </div>
          </div>

          <p className="text-slate-600 mb-6 text-sm md:text-base leading-relaxed">
            Describe your application (e.g., "A modern e-commerce platform with users, products, orders, and reviews") and let Gemini build the database structure for you.
          </p>

          {isLimitReached && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                      <Battery size={18} />
                  </div>
                  <div>
                      <h4 className="font-bold text-amber-800 text-sm">Daily Limit Reached</h4>
                      <p className="text-xs text-amber-700 mt-1 mb-2">
                          You've used your 5 free generations for today. To continue using AI features, simply add your own free Gemini API Key.
                      </p>
                      <button 
                        onClick={() => toggleSettings(true)}
                        className="text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                      >
                          <Settings size={12} /> Configure API Key
                      </button>
                  </div>
              </div>
          )}

          <div className="space-y-4">
            <textarea
              className="w-full h-40 bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none transition-all text-sm md:text-base disabled:opacity-50 disabled:bg-slate-100"
              placeholder="e.g. Create a project management system where users can create projects, assign tasks, and track time logs. Include teams and roles."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading || isLimitReached}
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" /> {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim() || isLimitReached}
              className="w-full py-4 bg-primary-700 hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-700/20 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Generating Schema...
                </>
              ) : (
                <>
                  <Zap size={20} className={remaining > 0 ? "fill-yellow-400 text-yellow-400" : ""} /> Generate
                </>
              )}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Example Prompts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <PromptChip 
                    label="Blog Platform" 
                    onClick={() => setPrompt("A blog system with users, posts, comments, tags, and categories.")} 
                />
                <PromptChip 
                    label="LMS System" 
                    onClick={() => setPrompt("Learning Management System with courses, students, instructors, modules, and progress tracking.")} 
                />
                <PromptChip 
                    label="Hospital Management" 
                    onClick={() => setPrompt("Hospital system with patients, doctors, appointments, medical records, and departments.")} 
                />
                <PromptChip 
                    label="Ride Sharing" 
                    onClick={() => setPrompt("Uber-like app with riders, drivers, rides, payments, and ratings.")} 
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PromptChip = ({ label, onClick }: { label: string, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-primary-50 hover:border-primary-200 border border-slate-200 rounded-lg text-sm text-slate-600 transition-colors text-left font-medium"
    >
        <Play size={12} className="text-primary-500 shrink-0" /> {label}
    </button>
);

export default AIGenerator;