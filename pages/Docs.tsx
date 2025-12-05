import React, { useState } from 'react';
import { 
  Book, FileText, Share2, Code, Layout, Cpu, 
  Users, Database, ArrowRight,
  Menu, X, CheckCircle2, AlertCircle, Command, MousePointer2, Settings, Download, Keyboard, Terminal
} from 'lucide-react';

// ----------------------------------------------------------------------
// Helper Components
// ----------------------------------------------------------------------

const SectionHeader = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
    <div className="flex items-center gap-3 pb-6 border-b border-slate-200 mb-8">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-primary-600">
            {icon}
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
    </div>
);

const ListItem = ({ children }: { children?: React.ReactNode }) => (
    <li className="flex items-start gap-3 text-slate-600">
        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
        <span className="leading-relaxed">{children}</span>
    </li>
);

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
    onClick?: () => void;
}

const FeatureCard = ({ icon, title, desc, onClick }: FeatureCardProps) => (
    <button 
        onClick={onClick}
        className="text-left p-6 rounded-xl bg-white border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all group h-full flex flex-col"
    >
        <div className="mb-4 p-3 bg-slate-50 w-fit rounded-lg group-hover:scale-110 transition-transform duration-300 border border-slate-100">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">{title}</h3>
        <p className="text-sm text-slate-500 flex-1 leading-relaxed">{desc}</p>
        {onClick && (
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Read More <ArrowRight size={12} />
            </div>
        )}
    </button>
);

// ----------------------------------------------------------------------
// Content Sections
// ----------------------------------------------------------------------

const IntroContent = ({ onChangeSection }: { onChangeSection: (id: string) => void }) => (
    <div className="space-y-12 max-w-4xl animate-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-6">
            <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
                SchemaForge <span className="text-primary-600">Docs</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">
                The comprehensive guide to designing, generating, and exporting database schemas with AI-assisted workflows.
            </p>
            <div className="flex gap-4 pt-2">
                <button onClick={() => onChangeSection('editor')} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm">
                    Start Learning <ArrowRight size={16} />
                </button>
                <button onClick={() => onChangeSection('shortcuts')} className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors">
                    View Shortcuts
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard 
                icon={<Database className="text-blue-500" />}
                title="Visual Schema Editor"
                desc="Drag, drop, and connect tables on an infinite canvas. Intuitive controls for columns, types, and primary keys."
                onClick={() => onChangeSection('editor')}
            />
            <FeatureCard 
                icon={<Cpu className="text-purple-500" />}
                title="AI Generator"
                desc="Turn natural language into normalized database schemas using the Gemini 2.5 Flash model."
                onClick={() => onChangeSection('ai')}
            />
            <FeatureCard 
                icon={<Code className="text-green-500" />}
                title="SQL Export/Import"
                desc="Production-ready SQL for PostgreSQL, MySQL, SQLite, and SQL Server. Import existing DDL scripts."
                onClick={() => onChangeSection('sql')}
            />
            <FeatureCard 
                icon={<Users className="text-orange-500" />}
                title="Real-time Collaboration"
                desc="Sync your projects to the cloud and collaborate with team members with live presence."
                onClick={() => onChangeSection('collab')}
            />
        </div>
    </div>
);

const InterfaceContent = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <SectionHeader title="Interface Overview" icon={<Layout className="text-primary-600" />} />
        
        <p className="text-lg text-slate-600 leading-relaxed">
            The SchemaForge workspace is designed to maximize screen estate for your diagrams while keeping essential tools within reach.
        </p>

        <div className="grid gap-8">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                    <span className="ml-2 text-sm font-mono text-slate-500">1. Sidebar Navigation</span>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <Settings size={16} className="text-slate-400" /> Project Controls
                        </h4>
                        <p className="text-sm text-slate-500">
                            Located at the top left. Use these to Save, Load, or Import SQL. If you are signed in, these sync to the cloud.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <Terminal size={16} className="text-slate-400" /> Dialect & Generation
                        </h4>
                        <p className="text-sm text-slate-500">
                            The dialect selector (PostgreSQL, MySQL, etc.) changes the syntax used when you click "Generate SQL".
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                     <span className="text-sm font-mono text-slate-500">2. The Canvas</span>
                </div>
                <div className="p-6">
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <li className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <span className="block font-bold text-slate-800 mb-1">Pan</span>
                            <span className="text-sm text-slate-500">Space + Drag</span>
                        </li>
                        <li className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <span className="block font-bold text-slate-800 mb-1">Zoom</span>
                            <span className="text-sm text-slate-500">Mouse Wheel</span>
                        </li>
                        <li className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <span className="block font-bold text-slate-800 mb-1">Select</span>
                            <span className="text-sm text-slate-500">Shift + Click</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

const EditorContent = () => (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
        <SectionHeader title="Schema Editor Guide" icon={<Database className="text-primary-600" />} />
        
        <div className="space-y-8">
            <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Anatomy of a Table Node</h3>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-8">
                         <div className="flex-1 space-y-4">
                            <p className="text-slate-600">
                                Tables are the fundamental units. Each table node consists of a header (Table Name) and a list of columns.
                            </p>
                            <ul className="space-y-3">
                                <ListItem><strong>Header:</strong> Drag the header to move the table.</ListItem>
                                <ListItem><strong>Add Column:</strong> Click the <span className="text-primary-600 font-bold">+</span> icon in the header.</ListItem>
                                <ListItem><strong>Delete Table:</strong> Click the <span className="text-red-500 font-bold">trash</span> icon.</ListItem>
                            </ul>
                         </div>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Connecting Tables (Relationships)</h3>
                <div className="bg-primary-50/50 border border-primary-100 p-6 rounded-xl">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h4 className="font-bold text-slate-900 mb-3">Creating Foreign Keys</h4>
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                To create a relationship, you simply draw a line between two columns. 
                                The direction of the connection implies the relationship flow.
                            </p>
                            <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside marker:text-primary-600 font-medium">
                                <li>Locate the <strong>Foreign Key</strong> column (Source).</li>
                                <li>Click the handle on the <strong>Right</strong> side.</li>
                                <li>Drag to the <strong>Primary Key</strong> column (Target).</li>
                                <li>Release on the <strong>Left</strong> handle.</li>
                            </ol>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-primary-100 text-center shadow-sm">
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-200 text-sm text-slate-600">
                                <span className="font-mono text-primary-600 font-semibold">orders.user_id</span>
                                <ArrowRight size={14} className="text-slate-400" />
                                <span className="font-mono text-green-600 font-semibold">users.id</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-3">
                                Connects Orders to Users (Many-to-One)
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
);

const AIContent = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <SectionHeader title="AI Generator" icon={<Cpu className="text-purple-600" />} />
        
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 p-8 rounded-2xl relative overflow-hidden">
            <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <Cpu size={24} className="text-purple-600" />
                Gemini 2.5 Flash Integration
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">
                SchemaForge isn't just a drawing tool. It understands natural language. 
                Describe your data model in plain English, and our AI engine constructs a normalized, visual schema instantly.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-green-600 mb-3 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Best Practices
                </h4>
                <ul className="space-y-3 text-sm text-slate-600">
                    <li>• List all major entities (Users, Products, etc.).</li>
                    <li>• Mention specific attributes if they matter (e.g., "products have a price and sku").</li>
                    <li>• Describe relationships explicitly (e.g., "users can have multiple addresses").</li>
                    <li>• Mention specific constraints like "unique emails".</li>
                </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-yellow-600 mb-3 flex items-center gap-2">
                    <AlertCircle size={16} /> Limitations
                </h4>
                <ul className="space-y-3 text-sm text-slate-600">
                    <li>• The AI provides a starting point, not a final product.</li>
                    <li>• Complex polymorphic relationships may need manual tuning.</li>
                    <li>• Always verify data types before exporting to production.</li>
                    <li>• Extremely large schemas (50+ tables) may be truncated.</li>
                </ul>
            </div>
        </div>
    </div>
);

const SQLContent = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <SectionHeader title="SQL Export & Import" icon={<Code className="text-green-600" />} />

        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Exporting</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        Generate standardized DDL scripts for your database. You can customize constraint behaviors and select specific tables to export.
                    </p>
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                            </div>
                            <span className="text-xs text-slate-500 font-mono ml-2">schema.sql</span>
                        </div>
                        <div className="p-4 overflow-x-auto bg-slate-900">
                            <pre className="text-xs font-mono text-blue-300">
                                {`CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR NOT NULL,
  created_at TIMESTAMP
);`}
                            </pre>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Importing</h3>
                    <p className="text-slate-600 mb-4">
                        Migrate legacy projects into SchemaForge. Upload a .sql file, and the system parses `CREATE TABLE` statements to reconstruct the visual graph.
                    </p>
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
                         <div className="bg-white p-2 rounded h-fit shadow-sm border border-blue-100">
                             <Layout size={18} className="text-blue-500" />
                         </div>
                         <div>
                             <h5 className="font-bold text-blue-800 text-sm">Auto-Layout Engine</h5>
                             <p className="text-xs text-blue-700/80 mt-1">
                                 Imported tables are automatically organized on the canvas to prevent overlapping nodes.
                             </p>
                         </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-bold text-slate-900">Supported Dialects</h4>
                <div className="space-y-2">
                    {['PostgreSQL', 'MySQL', 'SQLite', 'SQL Server'].map(db => (
                        <div key={db} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
                            <Database size={16} className="text-slate-400" />
                            <span className="text-slate-700 text-sm font-medium">{db}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const CollabContent = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <SectionHeader title="Collaboration & Cloud" icon={<Users className="text-orange-500" />} />

        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Real-time Presence</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                    Collaborate with your team as if you were in the same room. 
                    SchemaForge uses Supabase Realtime to broadcast cursor positions and selection states.
                </p>
                <ul className="space-y-4">
                    <ListItem><strong>Live Cursors:</strong> See exactly where your teammates are pointing.</ListItem>
                    <ListItem><strong>Instant Updates:</strong> (Coming Soon) Schema changes reflect instantly for all connected users.</ListItem>
                    <ListItem><strong>Secure:</strong> Data is synced over encrypted channels.</ListItem>
                </ul>
            </div>
            <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-30"></div>
                <div className="relative">
                    <div className="absolute -top-6 -left-8 flex flex-col items-center animate-pulse">
                         <MousePointer2 className="text-purple-500 rotate-12" fill="currentColor" size={24} />
                         <span className="bg-purple-500 text-white text-[10px] px-1.5 rounded mt-1 shadow-sm">Sarah</span>
                    </div>
                    <div className="absolute top-12 right-12 flex flex-col items-center">
                         <MousePointer2 className="text-orange-500 rotate-12" fill="currentColor" size={24} />
                         <span className="bg-orange-500 text-white text-[10px] px-1.5 rounded mt-1 shadow-sm">Mike</span>
                    </div>
                    <div className="w-32 h-20 bg-white border border-primary-500 rounded-lg shadow-lg flex items-center justify-center">
                        <span className="text-xs text-primary-600 font-bold">users</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ShortcutsContent = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <SectionHeader title="Keyboard Shortcuts" icon={<Keyboard className="text-pink-500" />} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-slate-900 font-bold mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Settings size={18} className="text-slate-400" /> General
                </h4>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm group">
                        <span className="text-slate-600 font-medium">Save Project</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Ctrl + S</kbd>
                    </div>
                    <div className="flex justify-between items-center text-sm group">
                        <span className="text-slate-600 font-medium">Export SQL</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Ctrl + E</kbd>
                    </div>
                    <div className="flex justify-between items-center text-sm group">
                        <span className="text-slate-600 font-medium">Generate AI</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Ctrl + G</kbd>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-slate-900 font-bold mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Layout size={18} className="text-slate-400" /> Canvas
                </h4>
                <div className="space-y-4">
                     <div className="flex justify-between items-center text-sm group">
                        <span className="text-slate-600 font-medium">Pan Canvas</span>
                        <div className="flex gap-1.5">
                             <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Space</kbd>
                             <span className="text-slate-400 text-xs self-center">+</span>
                             <span className="text-xs text-slate-500 py-1.5">Drag</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm group">
                        <span className="text-slate-600 font-medium">Delete Node</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Backspace</kbd>
                    </div>
                     <div className="flex justify-between items-center text-sm group">
                        <span className="text-slate-600 font-medium">Multi-select</span>
                        <div className="flex gap-1.5">
                             <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Shift</kbd>
                             <span className="text-slate-400 text-xs self-center">+</span>
                             <span className="text-xs text-slate-500 py-1.5">Click</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// ----------------------------------------------------------------------
// Main Docs Component
// ----------------------------------------------------------------------

const Docs = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'intro', label: 'Introduction', icon: Book },
    { id: 'interface', label: 'Interface Overview', icon: Layout },
    { id: 'editor', label: 'Schema Editor', icon: Database },
    { id: 'ai', label: 'AI Generator', icon: Cpu },
    { id: 'sql', label: 'SQL Export & Import', icon: Code },
    { id: 'collab', label: 'Collaboration & Cloud', icon: Users },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
  ];

  const handleSectionChange = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    document.getElementById('docs-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-slate-50 text-slate-900 relative">
      
      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden fixed bottom-6 right-6 z-50 p-4 bg-primary-600 text-white rounded-full shadow-lg shadow-primary-600/30 hover:bg-primary-500 transition-colors"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`
        fixed inset-y-0 left-0 pt-20 md:pt-0 w-72 bg-white border-r border-slate-200 
        flex flex-col shrink-0 z-40 transition-transform duration-300
        md:relative md:transform-none md:flex
        ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-100">
             <h3 className="font-bold text-slate-800 uppercase tracking-wider text-xs flex items-center gap-2">
                <Book size={14} className="text-primary-600"/> Documentation
            </h3>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all border ${
                  activeSection === section.id 
                    ? 'bg-primary-50 text-primary-700 border-primary-200 shadow-sm font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                }`}
              >
                <section.icon size={18} />
                {section.label}
              </button>
            ))}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
            <div className="bg-blue-50/50 rounded-lg border border-blue-100 p-3">
                <p className="text-xs text-blue-700 leading-relaxed">
                    <span className="font-bold block mb-1 text-blue-900">Version 1.0.0</span>
                    Gemini 2.5 Flash integrated.
                </p>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main id="docs-content" className="flex-1 overflow-y-auto scroll-smooth relative bg-slate-50">
        
        <div className="max-w-4xl mx-auto p-6 md:p-12 pb-32">
            {activeSection === 'intro' && <IntroContent onChangeSection={handleSectionChange} />}
            {activeSection === 'interface' && <InterfaceContent />}
            {activeSection === 'editor' && <EditorContent />}
            {activeSection === 'ai' && <AIContent />}
            {activeSection === 'sql' && <SQLContent />}
            {activeSection === 'collab' && <CollabContent />}
            {activeSection === 'shortcuts' && <ShortcutsContent />}
        </div>
      </main>
    </div>
  );
};

export default Docs;