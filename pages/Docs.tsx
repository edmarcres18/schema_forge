import React, { useState } from 'react';
import { 
  Book, FileText, Share2, Code, Layout, Cpu, 
  Users, Database, ArrowRight,
  Menu, X, CheckCircle2, AlertCircle, Command, MousePointer2, Settings, Download, Keyboard, Terminal,
  Sparkles, Upload, RefreshCw, Palette, Trash2, LayoutDashboard, Home, User
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
            The SchemaForge editor is designed with a focus on maximizing canvas space for schema design while keeping essential tools and controls within quick reach. The interface adapts responsively to different screen sizes.
        </p>

        <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-2 text-sm font-mono text-slate-500">Top Navigation Bar</span>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-slate-600 text-sm">
                        Located at the top of the application, containing the SchemaForge logo, navigation links, and user authentication controls.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                                <Home size={14} className="text-slate-400" /> Pages
                            </h4>
                            <ul className="text-xs text-slate-600 space-y-1 ml-4 list-disc">
                                <li><strong>Editor:</strong> Visual schema design workspace</li>
                                <li><strong>AI Generator:</strong> AI-powered schema generation</li>
                                <li><strong>Templates:</strong> Pre-built schema templates</li>
                                <li><strong>Docs:</strong> Complete documentation</li>
                            </ul>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                                <User size={14} className="text-slate-400" /> Account
                            </h4>
                            <ul className="text-xs text-slate-600 space-y-1 ml-4 list-disc">
                                <li>Sign Up / Sign In buttons</li>
                                <li>User profile menu when logged in</li>
                                <li>Settings and preferences access</li>
                                <li>Sign out option</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                    <span className="text-sm font-mono text-slate-500">Left Sidebar - Project & Dialect Controls</span>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-slate-600 text-sm">
                        The left sidebar contains project management tools and database dialect selection. On mobile, this sidebar can be toggled with the menu button.
                    </p>
                    <div className="space-y-3">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <h5 className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-sm">
                                <Download size={14} /> Project Controls
                            </h5>
                            <ul className="text-xs text-blue-800 space-y-1 ml-4 list-disc">
                                <li><strong>Save:</strong> Save the current project locally or to cloud (if logged in)</li>
                                <li><strong>Load:</strong> Open a previously saved project</li>
                                <li><strong>Import SQL:</strong> Parse and visualize existing SQL DDL scripts</li>
                                <li><strong>Generate SQL:</strong> Export the current schema as DDL</li>
                                <li><strong>New Project:</strong> Start a fresh schema design</li>
                            </ul>
                        </div>

                        <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                            <h5 className="font-bold text-purple-900 mb-2 flex items-center gap-2 text-sm">
                                <Database size={14} /> Dialect Selector
                            </h5>
                            <p className="text-xs text-purple-800 mb-2">
                                Choose your target database. This affects:
                            </p>
                            <ul className="text-xs text-purple-800 space-y-1 ml-4 list-disc">
                                <li>Data type syntax in exported SQL</li>
                                <li>Default constraint behaviors</li>
                                <li>AI generation recommendations</li>
                            </ul>
                            <p className="text-xs text-purple-700 mt-2"><strong>Options:</strong> PostgreSQL, MySQL, SQLite, SQL Server</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                    <span className="text-sm font-mono text-slate-500">Main Canvas Area</span>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-slate-600 text-sm">
                        The central canvas is where you design your schema. It uses React Flow for interactive node and edge management.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h5 className="font-bold text-slate-900 text-sm mb-3">Canvas Features</h5>
                            <ul className="space-y-2 text-xs text-slate-600">
                                <li className="flex gap-2">
                                    <span className="font-bold">→</span>
                                    <span><strong>Infinite canvas:</strong> Unlimited space to design</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">→</span>
                                    <span><strong>Pan & Zoom:</strong> Navigate easily with keyboard and mouse</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">→</span>
                                    <span><strong>Nodes:</strong> Draggable table nodes with live editing</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">→</span>
                                    <span><strong>Edges:</strong> Visual connections representing relationships</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">→</span>
                                    <span><strong>Mini Map:</strong> Quick navigation overview</span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h5 className="font-bold text-slate-900 text-sm mb-3">Canvas Controls</h5>
                            <ul className="space-y-2 text-xs text-slate-600">
                                <li className="flex gap-2">
                                    <span className="font-bold">+</span>
                                    <span><strong>Add Table:</strong> Right-click or use the + button</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">→</span>
                                    <span><strong>Connect:</strong> Drag from column handles to create relationships</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">→</span>
                                    <span><strong>Edit:</strong> Click table headers or columns to edit properties</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">→</span>
                                    <span><strong>Select:</strong> Single or multi-select with Shift</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="font-bold">→</span>
                                    <span><strong>Delete:</strong> Select and press Delete or Backspace</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                    <span className="text-sm font-mono text-slate-500">Right Panels & Modals</span>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-slate-600 text-sm">
                        Context-sensitive panels appear on demand for detailed editing and configuration.
                    </p>
                    <div className="grid gap-4">
                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                            <h5 className="font-bold text-orange-900 text-sm mb-2 flex items-center gap-2">
                                <Settings size={14} /> Settings Modal
                            </h5>
                            <p className="text-xs text-orange-800">Configure API keys (for AI), manage cloud sync, view usage statistics, and adjust application preferences.</p>
                        </div>

                        <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                            <h5 className="font-bold text-green-900 text-sm mb-2 flex items-center gap-2">
                                <Code size={14} /> SQL Export Modal
                            </h5>
                            <p className="text-xs text-green-800">Preview generated DDL, select dialect, choose specific tables, copy to clipboard, or download as .sql file.</p>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <h5 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                                <Upload size={14} /> Import SQL Modal
                            </h5>
                            <p className="text-xs text-blue-800">Paste or upload SQL DDL, parse the schema, and import tables and relationships onto the canvas.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 p-6 rounded-xl">
                <h4 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
                    <Palette size={18} className="text-slate-600" /> Color Coding & Visual Indicators
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <div className="w-6 h-6 rounded mb-2 bg-blue-500"></div>
                        <span className="text-slate-600">Blue - Primary Key</span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <div className="w-6 h-6 rounded mb-2 bg-orange-500"></div>
                        <span className="text-slate-600">Orange - Foreign Key</span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <div className="w-6 h-6 rounded mb-2 bg-red-500"></div>
                        <span className="text-slate-600">Red - Error/Alert</span>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <div className="w-6 h-6 rounded mb-2 bg-green-500"></div>
                        <span className="text-slate-600">Green - Valid</span>
                    </div>
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
                    <div className="flex flex-col gap-6">
                        <p className="text-slate-600 leading-relaxed">
                            Tables are the fundamental building blocks of your schema. Each table node consists of a header with the table name, color indicator, and action buttons, followed by a list of columns with their types and constraints.
                        </p>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <Settings size={16} className="text-slate-400" /> Table Header Controls
                                </h4>
                                <ul className="space-y-3">
                                    <ListItem><strong>Drag to Move:</strong> Click and drag the table header to reposition it on the canvas.</ListItem>
                                    <ListItem><strong>Add Column:</strong> Click the <span className="text-primary-600 font-bold">+</span> icon to add a new column to the table.</ListItem>
                                    <ListItem><strong>Delete Table:</strong> Click the <span className="text-red-500 font-bold">trash</span> icon to remove the entire table from your schema.</ListItem>
                                    <ListItem><strong>Edit Table Properties:</strong> Click the table name or settings icon to modify the table name, description, or color.</ListItem>
                                </ul>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <Database size={16} className="text-slate-400" /> Column Properties
                                </h4>
                                <ul className="space-y-3">
                                    <ListItem><strong>Data Types:</strong> Choose from standard SQL types (INT, VARCHAR, DATE, JSON, UUID, BOOLEAN, etc.) that are translated to the target database dialect.</ListItem>
                                    <ListItem><strong>Primary Key:</strong> Mark a column as the primary key (PK) for unique row identification. Only one per table is recommended.</ListItem>
                                    <ListItem><strong>Foreign Key:</strong> Automatically managed when you create relationships between tables.</ListItem>
                                    <ListItem><strong>Nullable:</strong> Toggle whether the column allows NULL values. By default, columns are required (NOT NULL).</ListItem>
                                    <ListItem><strong>Constraints:</strong> Support for UNIQUE, DEFAULT, and CHECK constraints through the editor interface.</ListItem>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Connecting Tables (Relationships)</h3>
                <div className="bg-primary-50/50 border border-primary-100 p-6 rounded-xl">
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-slate-900 mb-3">Creating Foreign Keys</h4>
                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                Relationships are created by connecting a foreign key column in one table to a primary key in another. 
                                The direction of the connection (left to right) indicates the data flow and dependency direction.
                            </p>
                            <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside marker:text-primary-600 font-medium">
                                <li>Ensure the source table has a column designated as a foreign key (or create one).</li>
                                <li>Locate the <strong>Foreign Key</strong> column in the source table.</li>
                                <li>Click the connection handle on the <strong>Right</strong> side of the foreign key column.</li>
                                <li>Drag the connection line to the target table.</li>
                                <li>Release on the connection handle on the <strong>Left</strong> side of the primary key column in the target table.</li>
                            </ol>
                        </div>

                        <div className="bg-white p-4 rounded-lg border border-primary-100 shadow-sm">
                            <div className="mb-4">
                                <p className="text-xs text-slate-600 mb-2 font-semibold">Example Relationship:</p>
                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-200 text-sm text-slate-600">
                                    <span className="font-mono text-primary-600 font-semibold">orders.user_id</span>
                                    <ArrowRight size={14} className="text-slate-400" />
                                    <span className="font-mono text-green-600 font-semibold">users.id</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-600">
                                <strong>Cardinality:</strong> One User can have Many Orders (1:N relationship). Each order references exactly one user.
                            </p>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <h5 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                <AlertCircle size={16} /> Relationship Best Practices
                            </h5>
                            <ul className="text-xs text-blue-800 space-y-1 ml-6 list-disc">
                                <li>Always ensure foreign key types match their referenced primary key types</li>
                                <li>Use UUID for distributed systems or INT/BIGINT for centralized databases</li>
                                <li>Consider CASCADE or RESTRICT delete policies based on your application needs</li>
                                <li>Index foreign keys for better query performance</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Supported Data Types</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-4">Basic Types</h4>
                        <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex justify-between p-2 bg-slate-50 rounded">
                                <span>Integers</span>
                                <span className="font-mono text-slate-500">INT, BIGINT, SMALLINT</span>
                            </div>
                            <div className="flex justify-between p-2 bg-slate-50 rounded">
                                <span>Decimals</span>
                                <span className="font-mono text-slate-500">DECIMAL, FLOAT, DOUBLE</span>
                            </div>
                            <div className="flex justify-between p-2 bg-slate-50 rounded">
                                <span>Strings</span>
                                <span className="font-mono text-slate-500">VARCHAR, TEXT, CHAR</span>
                            </div>
                            <div className="flex justify-between p-2 bg-slate-50 rounded">
                                <span>Date/Time</span>
                                <span className="font-mono text-slate-500">DATE, TIMESTAMP, TIME</span>
                            </div>
                            <div className="flex justify-between p-2 bg-slate-50 rounded">
                                <span>Boolean</span>
                                <span className="font-mono text-slate-500">BOOLEAN</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-4">Advanced Types</h4>
                        <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex justify-between p-2 bg-slate-50 rounded">
                                <span>JSON/Binary</span>
                                <span className="font-mono text-slate-500">JSON, JSONB, BYTEA</span>
                            </div>
                            <div className="flex justify-between p-2 bg-slate-50 rounded">
                                <span>Identifiers</span>
                                <span className="font-mono text-slate-500">UUID, SERIAL</span>
                            </div>
                            <div className="flex justify-between p-2 bg-slate-50 rounded">
                                <span>Network</span>
                                <span className="font-mono text-slate-500">INET, CIDR, MACADDR</span>
                            </div>
                            <div className="flex justify-between p-2 bg-slate-50 rounded">
                                <span>Special</span>
                                <span className="font-mono text-slate-500">ENUM, XML, GEOMETRY</span>
                            </div>
                            <div className="flex justify-between p-2 bg-slate-50 rounded">
                                <span>Binary</span>
                                <span className="font-mono text-slate-500">BLOB, BINARY, BIT</span>
                            </div>
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
                Gemini 2.5 Flash AI Model
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">
                SchemaForge leverages Google's Gemini 2.5 Flash model to understand natural language descriptions of your data models. 
                Describe your schema requirements in plain English, and the AI automatically generates a normalized, properly structured database schema.
            </p>
        </div>

        <div className="space-y-6">
            <div>
                <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-purple-500" /> How to Use the AI Generator
                </h4>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <ol className="space-y-4">
                        <li className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600">1</div>
                            <div>
                                <h5 className="font-bold text-slate-900 mb-1">Navigate to AI Generator</h5>
                                <p className="text-sm text-slate-600">Click the "AI Generator" option in the navigation menu or use <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs">Ctrl + G</kbd> shortcut.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600">2</div>
                            <div>
                                <h5 className="font-bold text-slate-900 mb-1">Describe Your Schema</h5>
                                <p className="text-sm text-slate-600">Enter a detailed description of what you want to build. Be specific about entities, relationships, and requirements.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600">3</div>
                            <div>
                                <h5 className="font-bold text-slate-900 mb-1">AI Generates Schema</h5>
                                <p className="text-sm text-slate-600">The AI analyzes your input and creates a complete database schema with tables, columns, and relationships.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600">4</div>
                            <div>
                                <h5 className="font-bold text-slate-900 mb-1">Review and Refine</h5>
                                <p className="text-sm text-slate-600">Examine the generated schema. You can manually edit any tables, columns, or relationships before exporting.</p>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-100 p-6 rounded-xl">
                    <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                        <CheckCircle2 size={16} /> Best Practices
                    </h4>
                    <ul className="space-y-3 text-sm text-green-800">
                        <li className="flex gap-2">
                            <span className="font-bold">•</span>
                            <span><strong>List all major entities:</strong> Users, Products, Orders, Payments, Reviews, etc.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">•</span>
                            <span><strong>Specify attributes:</strong> "Products have SKU, price, description, and inventory count"</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">•</span>
                            <span><strong>Describe relationships:</strong> "Users can have many addresses" or "Orders contain multiple items"</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">•</span>
                            <span><strong>Mention constraints:</strong> "Emails must be unique", "Phone numbers are optional"</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">•</span>
                            <span><strong>Specify scale:</strong> "Expected 1M+ users", "High-frequency order updates"</span>
                        </li>
                    </ul>
                </div>
                
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl">
                    <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                        <AlertCircle size={16} /> Limitations & Tips
                    </h4>
                    <ul className="space-y-3 text-sm text-amber-800">
                        <li className="flex gap-2">
                            <span className="font-bold">•</span>
                            <span><strong>Starting point only:</strong> The AI provides a solid foundation, not a production-ready schema.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">•</span>
                            <span><strong>Complex relationships:</strong> Polymorphic or many-to-many relationships may need manual tuning.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">•</span>
                            <span><strong>Verify before deploy:</strong> Always review data types and constraints before exporting to production.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">•</span>
                            <span><strong>Size limits:</strong> Schemas with 50+ tables may be truncated or simplified.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">•</span>
                            <span><strong>API key required:</strong> Requires either your own Gemini API key or guest quota available.</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
                <h5 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Database size={16} /> Example: E-Commerce Schema
                </h5>
                <div className="bg-white p-4 rounded-lg border border-blue-100 text-sm text-slate-600 space-y-2">
                    <p className="text-slate-700"><strong>Prompt:</strong> "Create an e-commerce database with users who can have multiple addresses, products with categories and inventory, orders with order items, and payments with multiple refunds."</p>
                    <p className="text-slate-700 pt-3"><strong>Expected Output:</strong> Tables for users, addresses, categories, products, inventory, orders, order_items, payments, and refunds with appropriate relationships and constraints.</p>
                </div>
            </div>
        </div>
    </div>
);

const SQLContent = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <SectionHeader title="SQL Export & Import" icon={<Code className="text-green-600" />} />

        <div className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Exporting SQL</h3>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Generate production-ready DDL (Data Definition Language) scripts for your database. SchemaForge automatically translates your visual schema into the SQL dialect of your choice with proper syntax, data types, and constraints.
                        </p>
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                    </div>
                                    <span className="text-xs text-slate-500 font-mono ml-2">PostgreSQL Example</span>
                                </div>
                                <div className="p-4 overflow-x-auto bg-slate-900">
                                    <pre className="text-xs font-mono text-green-300 leading-relaxed">
{`CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES users(id),
  total DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending'
);`}
                                    </pre>
                                </div>
                            </div>

                            <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                                <h5 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                                    <CheckCircle2 size={16} /> Export Features
                                </h5>
                                <ul className="text-sm text-green-800 space-y-1 ml-6 list-disc">
                                    <li>Automatic data type conversion for selected database dialect</li>
                                    <li>Primary key, foreign key, and constraint generation</li>
                                    <li>Support for NOT NULL, UNIQUE, and DEFAULT constraints</li>
                                    <li>Copy to clipboard or download as .sql file</li>
                                    <li>Ready to run directly in your database client</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Importing SQL</h3>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Migrate legacy projects or existing databases into SchemaForge. Upload a SQL DDL script, and SchemaForge automatically parses CREATE TABLE statements to reconstruct the visual graph. This is perfect for reverse-engineering existing databases.
                        </p>
                        <div className="space-y-4">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h5 className="font-bold text-slate-900 mb-3">Import Process</h5>
                                <ol className="space-y-3 text-sm text-slate-600">
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600 text-xs">1</span>
                                        <span>Click the <strong>Import SQL</strong> button in the editor sidebar</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600 text-xs">2</span>
                                        <span>Paste or upload your SQL DDL script (.sql file)</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600 text-xs">3</span>
                                        <span>SchemaForge parses the script and extracts table definitions</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600 text-xs">4</span>
                                        <span>Tables are automatically laid out on the canvas without overlapping</span>
                                    </li>
                                </ol>
                            </div>

                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                                <h5 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                    <LayoutDashboard size={16} /> Auto-Layout Engine
                                </h5>
                                <p className="text-sm text-blue-800">
                                    Imported tables are automatically organized using a smart layout algorithm that prevents node overlapping and creates a readable diagram of your schema in seconds.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Database size={18} /> Supported Dialects
                        </h4>
                        <div className="space-y-2">
                            {['PostgreSQL', 'MySQL', 'SQLite', 'SQL Server'].map(db => (
                                <div key={db} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-200 shadow-sm hover:border-primary-300 transition-colors">
                                    <Database size={16} className="text-slate-400" />
                                    <div>
                                        <span className="text-slate-700 text-sm font-medium block">{db}</span>
                                        <span className="text-xs text-slate-500">
                                            {db === 'PostgreSQL' && 'Advanced, JSONB support'}
                                            {db === 'MySQL' && 'Wide compatibility'}
                                            {db === 'SQLite' && 'Lightweight, embedded'}
                                            {db === 'SQL Server' && 'Enterprise solutions'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
                        <h5 className="font-bold text-yellow-900 mb-2 flex items-center gap-2 text-sm">
                            <AlertCircle size={16} /> Import Tips
                        </h5>
                        <ul className="text-xs text-yellow-800 space-y-1 ml-4 list-disc">
                            <li>SQL comments are preserved where possible</li>
                            <li>Foreign key relationships are detected and visualized</li>
                            <li>Indexes and advanced constraints are noted</li>
                            <li>Conversion from source to target dialect happens during export</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const CollabContent = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <SectionHeader title="Collaboration & Cloud Sync" icon={<Users className="text-orange-500" />} />

        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Real-time Presence</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        Collaborate with your team in real-time as if you were in the same room. 
                        SchemaForge uses Supabase Realtime to broadcast cursor positions, user presence, and selection states across all connected clients.
                    </p>
                    <div className="space-y-3">
                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                            <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                                <Users size={16} /> Live Cursors
                            </h4>
                            <p className="text-sm text-orange-800">
                                See exactly where your teammates' cursors are pointing. Each user is assigned a unique color for easy identification.
                            </p>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                <RefreshCw size={16} /> Instant Updates
                            </h4>
                            <p className="text-sm text-blue-800">
                                Schema changes are broadcast to all connected users instantly. When someone adds a table or creates a relationship, everyone sees it in real-time.
                            </p>
                        </div>

                        <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                            <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                                <CheckCircle2 size={16} /> Secure & Encrypted
                            </h4>
                            <p className="text-sm text-green-800">
                                All data is synced over encrypted channels using industry-standard HTTPS. Your schema data is protected end-to-end.
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Cloud Synchronization</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        Save your projects to the cloud using Supabase backend. Your schemas are stored securely and accessible from any device.
                    </p>
                    <div className="space-y-3">
                        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                            <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-sm">
                                <Database size={14} /> Setup Cloud Sync
                            </h5>
                            <ol className="text-xs text-slate-600 space-y-1 ml-4 list-decimal">
                                <li>Sign up or log in to your account</li>
                                <li>Click "Save Project" in the editor sidebar</li>
                                <li>Your project is automatically synced to the cloud</li>
                                <li>Access it from any device by signing in</li>
                            </ol>
                        </div>

                        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                            <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-sm">
                                <Share2 size={14} /> Share Projects
                            </h5>
                            <p className="text-xs text-slate-600 mb-2">
                                Generate shareable links with query parameters that allow teammates to view your schema without saving it to their account.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                Share Mode: View-only by default. Edit permissions require account access.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-100 p-6 rounded-xl">
                <h4 className="text-lg font-bold text-slate-900 mb-4">Collaboration Workflow</h4>
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                        <div className="text-2xl font-bold text-orange-600 mb-2">1</div>
                        <h5 className="font-bold text-slate-900 text-sm mb-2">Create Project</h5>
                        <p className="text-xs text-slate-600">Start a new schema and save it to the cloud</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                        <div className="text-2xl font-bold text-orange-600 mb-2">2</div>
                        <h5 className="font-bold text-slate-900 text-sm mb-2">Generate Share Link</h5>
                        <p className="text-xs text-slate-600">Get a unique URL to invite teammates</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                        <div className="text-2xl font-bold text-orange-600 mb-2">3</div>
                        <h5 className="font-bold text-slate-900 text-sm mb-2">Collaborate Real-Time</h5>
                        <p className="text-xs text-slate-600">Teammates see cursors and schema updates live</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                        <div className="text-2xl font-bold text-orange-600 mb-2">4</div>
                        <h5 className="font-bold text-slate-900 text-sm mb-2">Export SQL</h5>
                        <p className="text-xs text-slate-600">Download finalized DDL for deployment</p>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                <h5 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <AlertCircle size={16} /> Prerequisites
                </h5>
                <ul className="text-sm text-purple-800 space-y-1 ml-4 list-disc">
                    <li><strong>Supabase Configuration:</strong> The app owner must configure Supabase for cloud sync to be available</li>
                    <li><strong>User Account:</strong> Sign in with email/password or OAuth to access cloud features</li>
                    <li><strong>Network Connection:</strong> Internet connection required for real-time sync</li>
                    <li><strong>Session Management:</strong> Your session is maintained securely on the cloud backend</li>
                </ul>
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
                    <Settings size={18} className="text-slate-400" /> Editor Controls
                </h4>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Save Project</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Ctrl + S</kbd>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Export SQL</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Ctrl + E</kbd>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Generate with AI</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Ctrl + G</kbd>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Undo</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Ctrl + Z</kbd>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Redo</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Ctrl + Y</kbd>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-slate-900 font-bold mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Layout size={18} className="text-slate-400" /> Canvas Navigation
                </h4>
                <div className="space-y-4">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Pan Canvas</span>
                        <div className="flex gap-1">
                             <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Space</kbd>
                             <span className="text-slate-400 text-xs self-center px-1">+</span>
                             <span className="text-xs text-slate-600">Drag</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Zoom In</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Scroll Up</kbd>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Zoom Out</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Scroll Down</kbd>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Fit to Screen</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Ctrl + 0</kbd>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Multi-select</span>
                        <div className="flex gap-1">
                             <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Shift</kbd>
                             <span className="text-slate-400 text-xs self-center px-1">+</span>
                             <span className="text-xs text-slate-600">Click</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-slate-900 font-bold mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Trash2 size={18} className="text-slate-400" /> Node Operations
                </h4>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Delete Selected</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Delete</kbd>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Select All</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Ctrl + A</kbd>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Copy</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Ctrl + C</kbd>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Paste</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Ctrl + V</kbd>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Edit Name/Properties</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">F2</kbd>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-slate-900 font-bold mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Database size={18} className="text-slate-400" /> Schema Operations
                </h4>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Add New Table</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">T</kbd>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Add Column to Selected</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">C</kbd>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Auto Layout</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Ctrl + L</kbd>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Import SQL</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Ctrl + I</kbd>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600 font-medium">Clear All</span>
                        <kbd className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono text-xs shadow-sm">Ctrl + Shift + C</kbd>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <h5 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Keyboard size={16} /> Keyboard Tips
            </h5>
            <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                <li>Most shortcuts work on Windows and Mac. On Mac, use Cmd instead of Ctrl</li>
                <li>Shortcuts are case-insensitive for single-letter operations (T for table, C for column)</li>
                <li>Use Shift + Right-click for context menus with more options</li>
                <li>Delete or Backspace work interchangeably for removing nodes</li>
            </ul>
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