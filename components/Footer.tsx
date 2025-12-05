import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Github, Facebook, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
             <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center shadow-md shadow-primary-700/20">
                <Database className="text-white" size={18} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">SchemaForge</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-8 text-sm font-medium">
            <Link to="/ai" className="text-slate-600 hover:text-primary-700 transition-colors">Features</Link>
            <Link to="/editor" className="text-slate-600 hover:text-primary-700 transition-colors">Editor</Link>
            <Link to="/docs" className="text-slate-600 hover:text-primary-700 transition-colors">Documentation</Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            <a href="https://github.com/edmarcres18/schema_forge.git" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors" title="GitHub">
              <Github size={20} strokeWidth={1.5} />
            </a>
            <a href="https://www.facebook.com/chuweywebdev" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors" title="Facebook">
              <Facebook size={20} strokeWidth={1.5} />
            </a>
            <a href="https://t.me/schema_forge_bot" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors" title="Telegram">
              <Send size={20} strokeWidth={1.5} className="-rotate-45 translate-x-0.5 translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-200 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          
          {/* Copyright */}
          <div className="order-2 lg:order-1">
            © 2025 SchemaForge. All rights reserved.
          </div>
          
          {/* Decorative Dots */}
          <div className="order-1 lg:order-2 flex gap-1.5 justify-center">
            <div className="w-1 h-1 rounded-full bg-primary-300"></div>
            <div className="w-1 h-1 rounded-full bg-primary-400"></div>
            <div className="w-1 h-1 rounded-full bg-primary-500"></div>
            <div className="w-1 h-1 rounded-full bg-primary-600"></div>
            <div className="w-1 h-1 rounded-full bg-primary-700"></div>
          </div>

          {/* Warning Note */}
          <div className="order-3 lg:order-3 text-center lg:text-right max-w-md leading-relaxed">
            Note: Schemas are saved in your browser. Make sure to export your work before clearing browser data.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;