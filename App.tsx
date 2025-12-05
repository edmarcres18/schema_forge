import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Editor from './pages/Editor';
import AIGenerator from './pages/AIGenerator';
import Docs from './pages/Docs';
import Templates from './pages/Templates';

const Layout = () => {
  const location = useLocation();
  // Hide footer on editor page to maximize workspace
  const isEditor = location.pathname === '/editor';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-500/20 flex flex-col">
      <Navbar />
      <main className="flex-1 relative flex flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/ai" element={<AIGenerator />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/templates" element={<Templates />} />
        </Routes>
      </main>
      {!isEditor && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;