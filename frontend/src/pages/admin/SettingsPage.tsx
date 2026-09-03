import React, { useState, useEffect } from 'react';
import { Moon, Sun, Monitor, CheckCircle2, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ThemeMode = 'default' | 'light' | 'dark';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('bitefood_theme') as ThemeMode) || 'default';
  });

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;

    // Reset
    root.classList.remove('dark');
    root.removeAttribute('data-theme');

    if (mode === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else if (mode === 'light') {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      // System Default
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
      }
    }

    localStorage.setItem('bitefood_theme', mode);
    setTheme(mode);
  };

  useEffect(() => {
    applyTheme(theme);
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-24 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-30 border-b border-gray-100 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-700 hover:bg-gray-100 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-black text-zinc-900">App Preferences & Settings</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-soft space-y-3">
          <div className="space-y-0.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-400">
              Appearance & Theme
            </h2>
            <p className="text-xs text-zinc-500">
              Select your interface mode (changes apply instantly).
            </p>
          </div>

          <div className="space-y-2 pt-1">
            {/* 1. Default (System) */}
            <div
              onClick={() => applyTheme('default')}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                theme === 'default'
                  ? 'border-brand-500 bg-brand-50 text-brand-600 font-bold'
                  : 'border-gray-200 text-zinc-700 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Monitor className="w-4 h-4" />
                <div>
                  <span className="text-xs block">Default (System)</span>
                  <span className="text-[10px] text-zinc-400 block font-normal">
                    Follows device OS appearance
                  </span>
                </div>
              </div>
              {theme === 'default' && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
            </div>

            {/* 2. Light Mode */}
            <div
              onClick={() => applyTheme('light')}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                theme === 'light'
                  ? 'border-brand-500 bg-brand-50 text-brand-600 font-bold'
                  : 'border-gray-200 text-zinc-700 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="w-4 h-4" />
                <div>
                  <span className="text-xs block">Light Mode</span>
                  <span className="text-[10px] text-zinc-400 block font-normal">
                    Clean bright daytime UI
                  </span>
                </div>
              </div>
              {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
            </div>

            {/* 3. Dark Mode */}
            <div
              onClick={() => applyTheme('dark')}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                theme === 'dark'
                  ? 'border-brand-500 bg-brand-50 text-brand-600 font-bold'
                  : 'border-gray-200 text-zinc-700 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-4 h-4" />
                <div>
                  <span className="text-xs block">Dark Mode</span>
                  <span className="text-[10px] text-zinc-400 block font-normal">
                    Pitch dark background with high contrast
                  </span>
                </div>
              </div>
              {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-soft flex items-center gap-3 text-xs text-zinc-500">
          <Shield className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>Preference instantly saved in your local session.</span>
        </div>
      </div>
    </div>
  );
};