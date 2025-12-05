import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactFlow, { 
  Background, 
  Handle, 
  Position, 
  MarkerType, 
  ConnectionMode,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge
} from 'reactflow';
import { ArrowRight, Sparkles, Share2, Star, GitFork, Languages, Check } from 'lucide-react';

// ----------------------------------------------------------------------------
// Landing Page Specific Components
// ----------------------------------------------------------------------------

// Simplified Table Node for the Demo (Read-only, Visual)
const LandingTableNode = ({ data }: { data: any }) => {
  const colorStyles: any = {
    blue: { header: 'bg-blue-50', border: 'border-blue-100', body: 'bg-white', icon: 'bg-blue-400', key: 'text-blue-600 bg-blue-100' },
    white: { header: 'bg-slate-50', border: 'border-slate-200', body: 'bg-white', icon: 'bg-slate-400', key: 'text-slate-600 bg-slate-100' },
    yellow: { header: 'bg-yellow-50', border: 'border-yellow-100', body: 'bg-white', icon: 'bg-yellow-400', key: 'text-yellow-600 bg-yellow-100' },
    red: { header: 'bg-red-50', border: 'border-red-100', body: 'bg-white', icon: 'bg-red-400', key: 'text-red-600 bg-red-100' },
    green: { header: 'bg-green-50', border: 'border-green-100', body: 'bg-white', icon: 'bg-green-400', key: 'text-green-600 bg-green-100' },
    pink: { header: 'bg-pink-50', border: 'border-pink-100', body: 'bg-white', icon: 'bg-pink-400', key: 'text-pink-600 bg-pink-100' },
  };

  const styles = colorStyles[data.color] || colorStyles.white;

  return (
    <div className={`min-w-[220px] rounded-xl shadow-lg shadow-slate-200/50 overflow-hidden text-sm border ${styles.border} ${styles.body}`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b ${styles.border} ${styles.header} flex items-center justify-between cursor-grab active:cursor-grabbing`}>
        <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${styles.icon}`}></div>
            <span className="font-bold text-slate-800 text-sm tracking-tight">{data.name}</span>
        </div>
        <div className="flex gap-1">
             <div className="w-1 h-1 rounded-full bg-slate-300"></div>
             <div className="w-1 h-1 rounded-full bg-slate-300"></div>
             <div className="w-1 h-1 rounded-full bg-slate-300"></div>
        </div>
      </div>

      {/* Columns */}
      <div className="p-2 flex flex-col gap-1">
        {data.columns.map((col: any) => (
          <div key={col.name} className={`relative flex items-center justify-between p-1.5 rounded-md ${col.isPk ? 'bg-yellow-50/60' : ''}`}>
            
            <div className="flex items-center gap-2">
                {/* Handles for connections */}
                <Handle 
                    type="target" 
                    position={Position.Left} 
                    id={`target-${col.name}`}
                    className="!w-2 !h-2 !bg-slate-300 !border-2 !border-white opacity-0" 
                />

                {col.isPk ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0"></div>
                ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 shrink-0"></div>
                )}
                
                <span className={`text-xs font-medium ${col.isPk ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                    {col.name}
                </span>

                {col.isPk && <span className="text-[9px] font-bold text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded ml-1">PK</span>}
                {col.isFk && <span className="text-[9px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded ml-1">FK</span>}
            </div>

            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">{col.type}</span>

            <Handle 
                type="source" 
                position={Position.Right} 
                id={`source-${col.name}`}
                className="!w-2 !h-2 !bg-slate-300 !border-2 !border-white opacity-0" 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Showcase & Stats Components
// ----------------------------------------------------------------------------

const MockTable = ({ top, left, name, rows, color }: any) => {
    const colors: any = {
        blue: "border-blue-200 bg-blue-50/80 shadow-blue-100",
        green: "border-green-200 bg-green-50/80 shadow-green-100",
        purple: "border-purple-200 bg-purple-50/80 shadow-purple-100",
        red: "border-red-200 bg-red-50/80 shadow-red-100",
        yellow: "border-amber-200 bg-amber-50/80 shadow-amber-100",
    }
    const headerColors: any = {
        blue: "bg-blue-100 text-blue-800",
        green: "bg-green-100 text-green-800",
        purple: "bg-purple-100 text-purple-800",
        red: "bg-red-100 text-red-800",
        yellow: "bg-amber-100 text-amber-800",
    }
    
    return (
        <div className={`absolute w-48 md:w-56 border rounded-lg shadow-sm overflow-hidden ${colors[color]} backdrop-blur-sm transition-transform hover:scale-105 duration-300`} style={{ top, left }}>
            <div className={`px-3 py-2 text-[10px] md:text-xs font-bold border-b border-white/50 flex justify-between items-center ${headerColors[color]}`}>
                <span>{name}</span>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-black/10"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-black/10"></div>
                </div>
            </div>
            <div className="p-2 space-y-1.5 bg-white/50">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                        <div className="h-1.5 bg-slate-400/20 rounded w-16"></div>
                        <div className="h-1.5 bg-slate-400/20 rounded w-8"></div>
                    </div>
                ))}
            </div>
        </div>
    )
};

const Stats = () => {
    const [stats, setStats] = useState({ stars: 0, forks: 0, languages: 25 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch repo details
                const repoRes = await fetch('https://api.github.com/repos/edmarcres18/schema_forge');
                if (repoRes.ok) {
                    const repoData = await repoRes.json();
                    
                    // Note: We are setting languages to 25 as per specific request, 
                    // even if we could fetch it from the API.
                    setStats({
                        stars: repoData.stargazers_count || 0,
                        forks: repoData.forks_count || 0,
                        languages: 25
                    });
                }
            } catch (error) {
                console.error("Error fetching GitHub stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num;
    };

    return (
      <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-16 md:gap-24 py-12 md:py-16 mt-8 md:mt-12 border-t border-slate-200/60">
        <div className="text-center group cursor-default">
          <div className="text-4xl md:text-5xl font-extrabold text-slate-900 group-hover:text-primary-600 transition-colors">
            {loading ? '...' : formatNumber(stats.stars)}
          </div>
          <div className="text-sm font-semibold text-slate-500 mt-2 flex items-center justify-center gap-2">
            <Star size={16} className="text-yellow-400 fill-yellow-400" /> GitHub stars
          </div>
        </div>
        <div className="text-center group cursor-default">
          <div className="text-4xl md:text-5xl font-extrabold text-slate-900 group-hover:text-primary-600 transition-colors">
            {loading ? '...' : formatNumber(stats.forks)}
          </div>
          <div className="text-sm font-semibold text-slate-500 mt-2 flex items-center justify-center gap-2">
            <GitFork size={16} className="text-slate-400" /> GitHub forks
          </div>
        </div>
        <div className="text-center group cursor-default">
          <div className="text-4xl md:text-5xl font-extrabold text-slate-900 group-hover:text-primary-600 transition-colors">
            {loading ? '...' : stats.languages}
          </div>
          <div className="text-sm font-semibold text-slate-500 mt-2 flex items-center justify-center gap-2">
            <Languages size={16} className="text-slate-400" /> Languages
          </div>
        </div>
      </div>
    );
};

const EditorShowcase = () => (
    <section className="py-24 px-6 relative bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Build diagrams with a few clicks, <br className="hidden lg:block"/> 
                see the full picture, export SQL scripts.
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Customize your editor, visualize complex relationships, and manage your database schema with an interface designed for developers.
            </p>
        </div>
        
        {/* The Browser Window Mockup */}
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden ring-1 ring-slate-900/5 relative">
            {/* Window Header */}
            <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center gap-4">
                <div className="flex gap-1.5 ml-1">
                    <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/20"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500/20"></div>
                </div>
                <div className="flex gap-2 text-slate-400">
                    <div className="p-1 hover:bg-slate-200 rounded transition-colors"><div className="w-4 h-4 border-2 border-current rounded-sm"></div></div>
                    <div className="p-1 hover:bg-slate-200 rounded transition-colors"><div className="w-4 h-4 border-2 border-current rounded-sm"></div></div>
                </div>
                <div className="flex-1 text-center mr-20 md:mr-0">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-600 font-medium shadow-sm max-w-[300px] w-full justify-center">
                        <span className="text-slate-400">Diagrams /</span> Bank schema
                        <span className="ml-auto text-[10px] bg-slate-100 px-1.5 rounded text-slate-500 hidden sm:inline-block">Last saved 8/7/2024</span>
                    </div>
                </div>
            </div>
            
            {/* Window Content (The Mock UI) */}
            <div className="h-[500px] md:h-[650px] bg-slate-50 relative flex overflow-hidden">
                {/* Mock Sidebar */}
                <div className="hidden md:block w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                    <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-100 rounded-md"></div>
                        <div className="h-4 w-24 bg-slate-100 rounded"></div>
                    </div>
                    <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                        <div className="space-y-2">
                             <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tables</div>
                             {[
                                 {n: 'accounts', c: 'blue'}, {n: 'customers', c: 'green'}, 
                                 {n: 'transactions', c: 'purple'}, {n: 'transfers', c: 'slate'}, 
                                 {n: 'cards', c: 'amber'}, {n: 'loans', c: 'red'}, {n: 'investments', c: 'pink'}
                             ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                                    <div className={`w-2 h-2 rounded-full bg-${item.c}-400`}></div>
                                    <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900">{item.n}</span>
                                </div>
                             ))}
                        </div>
                    </div>
                     <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                        <div className="h-24 bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex flex-col justify-center items-center text-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">AI</div>
                            <div className="h-2 bg-blue-200/50 rounded w-20"></div>
                        </div>
                    </div>
                </div>

                {/* Mock Canvas Area */}
                <div className="flex-1 relative bg-[#F8FAFC] overflow-hidden cursor-grab active:cursor-grabbing">
                    {/* Background Pattern */}
                    <div className="absolute inset-0" style={{ 
                        backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', 
                        backgroundSize: '24px 24px',
                        opacity: 0.5 
                    }}></div>
                    
                    {/* Mock Nodes - Positioned to look like a complex schema */}
                    <div className="absolute inset-0 origin-top-left scale-[0.6] sm:scale-[0.7] md:scale-100">
                        <MockTable top={80} left={80} name="accounts" rows={5} color="blue" />
                        <MockTable top={120} left={400} name="transactions" rows={4} color="green" />
                        <MockTable top={380} left={100} name="transfers" rows={5} color="purple" />
                        <MockTable top={350} left={550} name="investments" rows={4} color="red" />
                        <MockTable top={100} left={700} name="cards" rows={3} color="yellow" />
                        <MockTable top={300} left={850} name="loans" rows={6} color="blue" />
                        
                        {/* Mock SVG Connections */}
                        <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible">
                            {/* Accounts -> Transactions */}
                            <path d="M 272 150 C 336 150, 336 180, 400 180" stroke="#94a3b8" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                            {/* Accounts -> Transfers */}
                            <path d="M 176 270 L 176 380" stroke="#94a3b8" strokeWidth="2" fill="none" />
                            {/* Transactions -> Investments */}
                            <path d="M 592 240 C 650 240, 650 350, 650 350" stroke="#94a3b8" strokeWidth="2" fill="none" />
                            {/* Cards -> Loans (Long curved) */}
                            <path d="M 800 200 C 800 250, 900 250, 900 300" stroke="#94a3b8" strokeWidth="2" fill="none" />
                        </svg>

                        {/* Floating Tooltips/Badges to simulate interactivity */}
                        <div className="absolute top-[120px] left-[900px] bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-xs animate-bounce hidden lg:block">
                            <div className="font-bold text-slate-800 mb-1">id</div>
                            <div className="flex gap-1 flex-wrap max-w-[120px]">
                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px]">Primary</span>
                                <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[9px]">Unique</span>
                                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px]">Not null</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <Stats />
    </section>
);

const DatabaseLogo = ({ name, color, className }: { name: string, color: string, className?: string }) => (
    <div className={`flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer ${className}`}>
        {/* Text based logo representation for performance and clean look */}
        <span className="text-xl md:text-2xl font-bold tracking-tight text-slate-700 hover:text-slate-900 transition-colors">{name}</span>
    </div>
)

const SupportedDatabases = () => (
    <div className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-16">Design for your database</h3>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 lg:gap-8 items-center justify-items-center">
                <DatabaseLogo name="MySQL" color="text-[#00758F]" />
                <DatabaseLogo name="PostgreSQL" color="text-[#336791]" />
                <DatabaseLogo name="SQLite" color="text-[#003B57]" />
                <DatabaseLogo name="MariaDB" color="text-[#C0765A]" />
                <DatabaseLogo name="SQL Server" color="text-[#CC2927]" />
                <DatabaseLogo name="Oracle" color="text-[#F80000]" />
             </div>
        </div>
    </div>
)

const FeaturesGrid = () => {
  const features = [
    {
      title: "Export SQL",
      desc: "Export the DDL script to run on your database. Copy directly to clipboard or download."
    },
    {
      title: "Reverse Engineer",
      desc: "Already have a schema? Import a DDL script to automatically generate a visual diagram."
    },
    {
      title: "AI Generation",
      desc: "Describe your data model in plain English and let Gemini build the schema structure for you."
    },
    {
      title: "Keyboard Shortcuts",
      desc: "Speed up development with keyboard shortcuts. Save, generate, and navigate faster."
    },
    {
      title: "Templates",
      desc: "Start off with pre-built templates. Get a quick start or get inspiration for your design."
    },
    {
      title: "Real-time Collaboration",
      desc: "See team members' cursors in real-time and sync your projects to the cloud."
    },
    {
      title: "Robust Editor",
      desc: "Undo, redo, auto-layout, and intuitive relationship mapping with drag-and-drop handles."
    },
    {
      title: "Relational Databases",
      desc: "We support major relational databases including PostgreSQL, MySQL, SQLite, and SQL Server."
    },
    {
      title: "Secure Storage",
      desc: "Save your projects locally in the browser or sync them to the cloud with Supabase auth."
    }
  ];

  return (
    <section className="py-24 px-6 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-primary-600 font-bold tracking-wide uppercase text-sm mb-3">More than just an editor</h3>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">What SchemaForge has to offer</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-lg border border-slate-200 bg-white border-l-4 border-l-primary-600 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary-700 transition-colors">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ----------------------------------------------------------------------------
// Initial Data for the Demo Graph (Shifted to Right for Layout)
// ----------------------------------------------------------------------------

const initialNodes: Node[] = [
  {
    id: 'users',
    type: 'landingTable',
    position: { x: 750, y: 80 }, // Moved to right side
    data: {
      name: 'users',
      color: 'blue',
      columns: [
        { name: 'id', type: 'INT', isPk: true },
        { name: 'username', type: 'VARCHAR' },
        { name: 'email', type: 'VARCHAR' },
        { name: 'role', type: 'VARCHAR' },
      ]
    },
  },
  {
    id: 'posts',
    type: 'landingTable',
    position: { x: 1080, y: 200 }, // Moved to right side
    data: {
      name: 'posts',
      color: 'white',
      columns: [
        { name: 'id', type: 'INT', isPk: true },
        { name: 'user_id', type: 'INT', isFk: true },
        { name: 'cat_id', type: 'INT', isFk: true },
        { name: 'title', type: 'VARCHAR' },
        { name: 'content', type: 'TEXT' },
      ]
    },
  },
  {
    id: 'comments',
    type: 'landingTable',
    position: { x: 720, y: 380 }, // Moved to right side
    data: {
      name: 'comments',
      color: 'yellow',
      columns: [
        { name: 'id', type: 'INT', isPk: true },
        { name: 'post_id', type: 'INT', isFk: true },
        { name: 'user_id', type: 'INT', isFk: true },
        { name: 'body', type: 'TEXT' },
      ]
    },
  },
  {
    id: 'categories',
    type: 'landingTable',
    position: { x: 1050, y: 450 }, // Moved to right side
    data: {
      name: 'categories',
      color: 'pink',
      columns: [
        { name: 'id', type: 'INT', isPk: true },
        { name: 'name', type: 'VARCHAR' },
        { name: 'slug', type: 'VARCHAR' },
      ]
    },
  },
];

const initialEdges: Edge[] = [
  // Posts -> Users
  {
    id: 'e1',
    source: 'posts',
    target: 'users',
    sourceHandle: 'source-user_id',
    targetHandle: 'target-id',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#64748b', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
  },
  // Comments -> Posts
  {
    id: 'e2',
    source: 'comments',
    target: 'posts',
    sourceHandle: 'source-post_id',
    targetHandle: 'target-id',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#64748b', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
  },
  // Comments -> Users
  {
    id: 'e3',
    source: 'comments',
    target: 'users',
    sourceHandle: 'source-user_id',
    targetHandle: 'target-id',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#64748b', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
  },
  // Posts -> Categories
  {
    id: 'e4',
    source: 'posts',
    target: 'categories',
    sourceHandle: 'source-cat_id',
    targetHandle: 'target-id',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#64748b', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
  }
];

// ----------------------------------------------------------------------------
// Main Landing Component
// ----------------------------------------------------------------------------

const Landing = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(() => ({ landingTable: LandingTableNode }), []);

  return (
    <div className="min-h-screen text-slate-900 overflow-x-hidden relative">
      {/* Background Pattern - Dotted */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-slate-50" 
           style={{ 
             backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)', 
             backgroundSize: '24px 24px'
           }}
      ></div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 md:px-12 max-w-[1400px] mx-auto min-h-[90vh] flex items-center">
        
        {/* Graph Background Layer - Interactive but visually positioned to the right */}
        <div className="absolute inset-0 z-0">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                connectionMode={ConnectionMode.Loose}
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={false}
                zoomOnScroll={false}
                panOnScroll={false} // Disable graph panning so page scrolling works
                panOnDrag={false}   // Disable graph dragging so dragging background scrolls page
                zoomOnDoubleClick={false}
                proOptions={{ hideAttribution: true }}
                fitView={false} // Disable fitView to allow manual positioning on the right
                defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
                className="bg-transparent"
            >
                 <Background color="#94a3b8" gap={20} size={1} className="opacity-0" />
            </ReactFlow>
        </div>

        {/* Content Layer */}
        <div className="flex flex-col lg:flex-row items-center relative z-10 w-full pointer-events-none">
            
            {/* Left Content - Cleaner Layout without Card Background on Desktop */}
            <div className="w-full lg:w-1/2 text-left space-y-8 pr-0 lg:pr-12">
                {/* Backdrop blur ONLY on mobile to ensure text readability over potential node overlap */}
                <div className="pointer-events-auto p-6 md:p-0 rounded-2xl md:rounded-none bg-white/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none shadow-xl md:shadow-none border border-white/50 md:border-none">
                    
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wide mb-8">
                        <Sparkles size={14} className="text-primary-600 fill-primary-600/20" />
                        <span>AI-Powered Schema Optimization</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
                        Design, Generate, <br />
                        and <span className="relative inline-block text-primary-700">
                            Deploy
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary-300 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                            </svg>
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 leading-relaxed max-w-lg mb-8 font-medium">
                        Free and open source, simple, and intuitive database design editor, data-modeler, and SQL generator. No sign up required.
                    </p>

                    <div className="flex flex-wrap gap-3 mb-10">
                        {['No sign up', 'Free of charge', 'Quick and easy'].map(badge => (
                            <span key={badge} className="px-3 py-1.5 rounded-full border border-slate-200 bg-white/60 backdrop-blur-sm text-slate-700 text-xs font-semibold shadow-sm flex items-center gap-1.5">
                                <Check size={12} className="text-primary-600" strokeWidth={3} /> {badge}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Link to="/docs" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-sm pointer-events-auto">
                            Learn more <ArrowRight size={18} />
                        </Link>
                        <Link to="/editor" className="w-full sm:w-auto px-8 py-4 bg-primary-700 hover:bg-primary-800 text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary-900/20 hover:shadow-primary-900/30 hover:-translate-y-0.5 pointer-events-auto">
                            Try it for yourself <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right side spacer is implicit; Nodes are positioned to fill this space visually */}
            <div className="hidden lg:block w-1/2 h-full min-h-[600px]"></div>
        </div>
      </section>

      {/* Editor Showcase Section */}
      <EditorShowcase />

      {/* Supported Databases Section */}
      <SupportedDatabases />

      {/* Features Grid Section */}
      <FeaturesGrid />

      {/* Inspiration Credit */}
      <div className="py-12 bg-white border-t border-slate-100 text-center">
        <p className="text-slate-500 text-sm flex items-center justify-center gap-1">
          Inspired by 
          <a 
            href="https://www.drawdb.app/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary-600 font-semibold hover:text-primary-700 hover:underline decoration-primary-300 underline-offset-4 transition-all"
          >
            Draw DB
          </a>
          . Open source and free forever.
        </p>
      </div>
    </div>
  );
};

export default Landing;