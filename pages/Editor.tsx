import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  ConnectionMode,
  ReactFlowProvider,
  Panel
} from 'reactflow';
import { useSearchParams } from 'react-router-dom';

import { useSchemaStore } from '../store';
import TableNode from '../components/TableNode';
import { Database, Download, Plus, Settings, Code, Copy, Check, X, Save, FolderOpen, Trash2, ArrowRightLeft, Upload, FileText, Loader2, LayoutDashboard, MousePointer2, ChevronRight, AlertCircle, AlertTriangle, Lightbulb, RefreshCw, ChevronDown, ChevronUp, Pencil, Sparkles, Palette, Clock, MoreHorizontal, GripVertical, Search } from 'lucide-react';
import { DatabaseDialect, Table, Cursor, TableColor } from '../types';
import { parseSqlToSchema } from '../services/ai';
import { isSupabaseConfigured } from '../lib/supabase';

const nodeTypes = {
  tableNode: TableNode,
};

const Editor = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get('id');
  const encodedData = searchParams.get('data');

  const { loadProjectById, importProjectState, currentProjectId } = useSchemaStore();
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  // Lift modal state to Editor level
  const [showSql, setShowSql] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [showLoad, setShowLoad] = useState(false);
  const [showImport, setShowImport] = useState(false);

  // Close sidebar on initial load for mobile, open for desktop
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 768) {
            setSidebarOpen(true);
        } else {
            setSidebarOpen(false);
        }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
      // 1. Load by ID (Supabase)
      if (projectId && projectId !== currentProjectId) {
          const load = async () => {
              setIsLoadingProject(true);
              const success = await loadProjectById(projectId);
              if (!success) {
                  console.error("Project not found");
              }
              setIsLoadingProject(false);
          };
          load();
      } 
      // 2. Load by Data (Client-side snapshot)
      else if (encodedData) {
           setIsLoadingProject(true);
           const success = importProjectState(encodedData);
           if (!success) {
               console.error("Failed to load shared data");
           }
           setIsLoadingProject(false);
      }
  }, [projectId, encodedData]);

  useEffect(() => {
      // Check if we need to show setup (New Project flow)
      // Only show if: no projectId AND no encodedData AND no nodes
      const { nodes } = useSchemaStore.getState();
      
      if (!projectId && !encodedData && nodes.length === 0) {
        setShowSetup(true);
      } else {
        setShowSetup(false);
      }
  }, [projectId, encodedData]);

  const handleSetupComplete = () => {
      setShowSetup(false);
      // Open sidebar on complete for better UX
      if (window.innerWidth >= 768) {
          setSidebarOpen(true);
      }
  }

  return (
    <ReactFlowProvider>
      {/* Use dvh for mobile browser compatibility */}
      <div className="h-[calc(100dvh-80px)] w-full flex bg-slate-50 text-slate-900 relative overflow-hidden">
        <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            onOpenSql={() => setShowSql(true)}
            onOpenSave={() => setShowSave(true)}
            onOpenLoad={() => setShowLoad(true)}
            onOpenImport={() => setShowImport(true)}
        />
        
        {/* Mobile Toggle Button - Floating Action Button Style */}
        {!isSidebarOpen && (
            <button 
                className="md:hidden fixed bottom-6 left-6 z-30 w-14 h-14 bg-primary-700 hover:bg-primary-800 text-white rounded-full shadow-lg shadow-primary-900/30 flex items-center justify-center transition-transform active:scale-95"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open Menu"
            >
                <MoreHorizontal size={28} />
            </button>
        )}

        <div className="flex-1 relative w-full h-full">
            {isLoadingProject ? (
                 <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <Loader2 size={48} className="text-primary-600 animate-spin mb-4" />
                    <h3 className="text-xl font-bold text-slate-800">Loading Project...</h3>
                    <p className="text-slate-500 text-sm mt-2">
                        {projectId ? 'Retrieving shared schema from the cloud' : 'Parsing shared snapshot'}
                    </p>
                 </div>
            ) : (
                <Canvas />
            )}
        </div>

        {/* Modals rendered here to ensure they are centered in the viewport */}
        {showSql && <SqlModal onClose={() => setShowSql(false)} />}
        {showSave && <SaveProjectModal onClose={() => setShowSave(false)} />}
        {showLoad && <LoadProjectModal onClose={() => setShowLoad(false)} />}
        {showImport && <ImportModal onClose={() => setShowImport(false)} />}
        
        {/* Onboarding Modal */}
        {showSetup && <ProjectSetupModal onComplete={handleSetupComplete} />}
      </div>
    </ReactFlowProvider>
  );
};

const ProjectSetupModal = ({ onComplete }: { onComplete: () => void }) => {
    const { setDialect } = useSchemaStore();
    const [dialect, setLocalDialect] = useState<DatabaseDialect>('PostgreSQL');

    const handleSubmit = () => {
        setDialect(dialect);
        onComplete();
    };

    const dialects: { id: DatabaseDialect, color: string }[] = [
        { id: 'PostgreSQL', color: 'bg-blue-600' },
        { id: 'MySQL', color: 'bg-sky-600' },
        { id: 'SQLite', color: 'bg-slate-600' },
        { id: 'SQL Server', color: 'bg-red-600' },
    ];

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Start New Project</h2>
                            <p className="text-slate-500 text-sm">Select your database dialect to begin</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Database Dialect</label>
                            <div className="grid grid-cols-2 gap-3">
                                {dialects.map((d) => (
                                    <button
                                        key={d.id}
                                        onClick={() => setLocalDialect(d.id)}
                                        className={`
                                            p-3 rounded-xl border flex items-center gap-3 transition-all
                                            ${dialect === d.id 
                                                ? 'border-primary-600 bg-primary-50 text-primary-900 ring-1 ring-primary-600' 
                                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'}
                                        `}
                                    >
                                        <div className={`w-2.5 h-2.5 rounded-full ${d.color}`}></div>
                                        <span className="font-medium text-sm">{d.id}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={handleSubmit}
                            className="w-full py-3.5 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-primary-700/20 flex items-center justify-center gap-2 mt-4"
                        >
                            Create Project <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
                <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">You can change these settings later in the editor.</p>
                </div>
            </div>
        </div>
    );
};

const Canvas = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, autoLayout, cursors, initializeRealtime, broadcastCursor, user, currentProjectId, saveProject, currentProjectName, isSaving, lastSaved, hasUnsavedChanges } = useSchemaStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Init Realtime when user logs in OR if we are on a shared project (anonymous)
    if (isSupabaseConfigured()) {
        initializeRealtime();
    }
  }, [user, currentProjectId]);

  // Auto-Save Implementation
  useEffect(() => {
      // 1. Debounce save on significant changes (nodes, edges)
      // Save 4 seconds after the last change if there are unsaved changes
      const debounceTimer = setTimeout(() => {
          if (hasUnsavedChanges && currentProjectName) {
              saveProject(currentProjectName);
          }
      }, 4000);

      // 2. Interval save (Backup every 2 minutes regardless of debounce state, if dirty)
      const intervalTimer = setInterval(() => {
           if (hasUnsavedChanges && currentProjectName) {
              saveProject(currentProjectName);
          }
      }, 2 * 60 * 1000);

      return () => {
          clearTimeout(debounceTimer);
          clearInterval(intervalTimer);
      };
  }, [nodes, edges, hasUnsavedChanges, currentProjectName, saveProject]);

  const onMouseMove = useCallback((event: React.MouseEvent) => {
     if (reactFlowWrapper.current) {
         const bounds = reactFlowWrapper.current.getBoundingClientRect();
         const x = event.clientX - bounds.left;
         const y = event.clientY - bounds.top;
         broadcastCursor(x, y);
     }
  }, [broadcastCursor]);

  return (
    <div className="w-full h-full relative touch-none bg-slate-50" ref={reactFlowWrapper} onMouseMove={onMouseMove}>
        <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-slate-50"
        proOptions={{ hideAttribution: true }}
        minZoom={0.1}
        maxZoom={4}
        panOnScroll={false} // Disable standard scroll pan to allow page scrolling interactions elsewhere if needed, but 'touch-none' on wrapper usually handles this.
        zoomOnPinch={true} // Explicitly enable pinch zoom for mobile
        panOnDrag={true} 
        >
        <Background color="#94a3b8" gap={20} size={1} />
        <Controls className="!bg-white !border-slate-200 [&>button]:!fill-slate-600 !m-4 shadow-sm" />
        <MiniMap 
            nodeColor="#cbd5e1" 
            maskColor="rgba(248, 250, 252, 0.8)"
            className="!bg-white border border-slate-200 !mb-16 md:!mb-4 shadow-sm rounded-lg"
        />
        <Panel position="top-right" className="flex gap-2 m-4">
             {/* Save Status Indicator */}
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur border border-slate-200 px-3 py-2 rounded-lg shadow-sm text-xs font-medium text-slate-500">
                {isSaving ? (
                    <>
                        <Loader2 size={12} className="animate-spin text-primary-600" />
                        <span className="text-primary-600">Saving...</span>
                    </>
                ) : lastSaved ? (
                     <>
                        <Check size={12} className="text-green-600" />
                        <span>Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                     </>
                ) : (
                    <>
                        <Clock size={12} />
                        <span>Not saved</span>
                    </>
                )}
            </div>
            
            <button 
                onClick={autoLayout} 
                className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg shadow-sm transition-colors text-sm font-medium"
            >
                <LayoutDashboard size={16} /> <span className="hidden sm:inline">Auto Layout</span>
            </button>
        </Panel>
        
        {/* Render Remote Cursors */}
        {(Object.values(cursors) as Cursor[]).map(cursor => (
             cursor.userId !== (user?.id || `anon-${currentProjectId || 'guest'}`) && ( 
                <div 
                    key={cursor.userId} 
                    className="absolute pointer-events-none z-50 flex flex-col items-start"
                    style={{ left: cursor.x, top: cursor.y, transition: 'all 0.1s linear' }}
                >
                    <MousePointer2 
                        size={20} 
                        fill={cursor.color} 
                        color={cursor.color} 
                        className="transform rotate-[-15deg] drop-shadow-sm"
                    />
                    <span 
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white mt-1 whitespace-nowrap shadow-sm"
                        style={{ backgroundColor: cursor.color }}
                    >
                        {cursor.userName}
                    </span>
                </div>
            )
        ))}
        </ReactFlow>
    </div>
  );
};

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenSql: () => void;
    onOpenSave: () => void;
    onOpenLoad: () => void;
    onOpenImport: () => void;
}

const Sidebar = ({ isOpen, onClose, onOpenSql, onOpenSave, onOpenLoad, onOpenImport }: SidebarProps) => {
  const { addTable, setDialect, dialect, nodes, edges, issues, analyzeSchema, isAnalyzing, removeTable, updateEdge, fixIssue, isFixing, checkGuestUsage, saveProject, currentProjectName } = useSchemaStore();

  const [activeTab, setActiveTab] = useState<'Tables' | 'Relationships'>('Tables');
  const [search, setSearch] = useState('');
  const [isIssuesOpen, setIsIssuesOpen] = useState(true);
  
  // Color Picker State
  const [showColorPicker, setShowColorPicker] = useState(false);
  const tableColors: TableColor[] = ['white', 'blue', 'green', 'yellow', 'red', 'purple', 'pink'];

  // Edit Edge State
  const [editingEdgeId, setEditingEdgeId] = useState<string | null>(null);
  const [editLabelValue, setEditLabelValue] = useState('');

  // Check limits on mount to ensure we can show warnings if needed (optional for sidebar)
  useEffect(() => {
    checkGuestUsage();
  }, []);

  const handleQuickSave = () => {
    if (currentProjectName && currentProjectName !== 'Untitled Project') {
        saveProject(currentProjectName);
    } else {
        onOpenSave();
    }
  };

  const startEdit = (id: string, currentLabel: string) => {
    setEditingEdgeId(id);
    setEditLabelValue(currentLabel || '');
  };

  const saveEdgeLabel = (id: string) => {
      updateEdge(id, { label: editLabelValue });
      setEditingEdgeId(null);
  };

  const cancelEdit = () => {
    setEditingEdgeId(null);
    setEditLabelValue('');
  };

  const filteredNodes = useMemo(() => {
      return nodes.filter(n => n.data.name.toLowerCase().includes(search.toLowerCase()));
  }, [nodes, search]);

  const filteredEdges = useMemo(() => {
      return edges.map(e => {
          const sourceNode = nodes.find(n => n.id === e.source);
          const targetNode = nodes.find(n => n.id === e.target);
          const sourceColId = e.sourceHandle?.replace('source-', '').replace('target-', '');
          const targetColId = e.targetHandle?.replace('source-', '').replace('target-', '');
          const sourceCol = sourceNode?.data.columns.find(c => c.id === sourceColId);
          const targetCol = targetNode?.data.columns.find(c => c.id === targetColId);
          
          const autoLabel = `${sourceNode?.data.name}.${sourceCol?.name} → ${targetNode?.data.name}.${targetCol?.name}`;

          return {
              id: e.id,
              autoLabel,
              label: e.label || autoLabel,
              raw: e
          };
      }).filter(item => String(item.label || '').toLowerCase().includes(search.toLowerCase()));
  }, [edges, nodes, search]);

  const getColorClass = (c: string) => {
      switch(c) {
          case 'blue': return 'bg-blue-400 border-blue-500';
          case 'green': return 'bg-green-400 border-green-500';
          case 'yellow': return 'bg-yellow-400 border-yellow-500';
          case 'red': return 'bg-red-400 border-red-500';
          case 'purple': return 'bg-purple-400 border-purple-500';
          case 'pink': return 'bg-pink-400 border-pink-500';
          default: return 'bg-white border-slate-300';
      }
  };

  return (
    <>
        {/* Mobile Overlay */}
        {isOpen && (
            <div 
                className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30" 
                onClick={onClose}
            />
        )}

        <div className={`
            fixed md:relative 
            top-[80px] bottom-0 md:top-0 md:bottom-auto md:h-full
            left-0 z-40
            w-80 border-r border-slate-200 bg-white flex flex-col shadow-2xl md:shadow-none
            transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            h-[calc(100dvh-80px)] md:h-auto
        `}>
        
        {/* Project Menu Header - Optimized for Mobile */}
        <div className="h-auto md:h-14 px-3 py-3 md:py-0 md:px-4 border-b border-slate-200 bg-slate-50/80 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0 shrink-0 relative">
             
             {/* Mobile Close Button */}
             <button 
                onClick={onClose}
                className="md:hidden absolute top-3 right-3 p-1.5 bg-slate-100 rounded-full text-slate-500 hover:text-slate-800"
             >
                <X size={16} />
             </button>

             {/* Tools Row */}
             <div className="flex items-center w-full md:w-auto pr-8 md:pr-0">
                 <div className="flex flex-1 md:flex-initial items-center gap-2 overflow-x-auto no-scrollbar snap-x mask-gradient py-1">
                     <button onClick={handleQuickSave} className="snap-start flex items-center gap-2 px-3 py-1.5 md:p-1.5 text-slate-600 hover:text-primary-700 bg-white border border-slate-200 md:border-transparent md:bg-transparent rounded-lg hover:bg-slate-100 transition-all shrink-0 shadow-sm md:shadow-none" title="Save Project">
                         <Save size={18} /> <span className="md:hidden text-xs font-semibold">Save</span>
                     </button>
                     <button onClick={onOpenLoad} className="snap-start flex items-center gap-2 px-3 py-1.5 md:p-1.5 text-slate-600 hover:text-primary-700 bg-white border border-slate-200 md:border-transparent md:bg-transparent rounded-lg hover:bg-slate-100 transition-all shrink-0 shadow-sm md:shadow-none" title="Load Project">
                         <FolderOpen size={18} /> <span className="md:hidden text-xs font-semibold">Load</span>
                     </button>
                     <button onClick={onOpenSql} className="snap-start flex items-center gap-2 px-3 py-1.5 md:p-1.5 text-slate-600 hover:text-primary-700 bg-white border border-slate-200 md:border-transparent md:bg-transparent rounded-lg hover:bg-slate-100 transition-all shrink-0 shadow-sm md:shadow-none" title="Export SQL">
                         <Code size={18} /> <span className="md:hidden text-xs font-semibold">Export</span>
                     </button>
                     <button onClick={onOpenImport} className="snap-start flex items-center gap-2 px-3 py-1.5 md:p-1.5 text-slate-600 hover:text-primary-700 bg-white border border-slate-200 md:border-transparent md:bg-transparent rounded-lg hover:bg-slate-100 transition-all shrink-0 shadow-sm md:shadow-none" title="Import SQL">
                         <Upload size={18} /> <span className="md:hidden text-xs font-semibold">Import</span>
                     </button>
                 </div>
                 
                 <div className="hidden md:block h-4 w-px bg-slate-300 mx-2 shrink-0"></div>
                 
                 <div className="hidden md:block">
                    <select 
                        value={dialect}
                        onChange={(e) => setDialect(e.target.value as DatabaseDialect)}
                        className="bg-transparent text-xs font-semibold text-slate-600 outline-none cursor-pointer hover:text-slate-900 shrink-0 max-w-[100px]"
                    >
                        <option value="PostgreSQL">PostgreSQL</option>
                        <option value="MySQL">MySQL</option>
                        <option value="SQLite">SQLite</option>
                        <option value="SQL Server">MSSQL</option>
                    </select>
                 </div>
             </div>

             {/* Mobile Dialect Select (Separate Row) */}
             <div className="md:hidden flex items-center justify-between mt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Database:</span>
                <select 
                    value={dialect}
                    onChange={(e) => setDialect(e.target.value as DatabaseDialect)}
                    className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-700 outline-none cursor-pointer shadow-sm"
                >
                    <option value="PostgreSQL">PostgreSQL</option>
                    <option value="MySQL">MySQL</option>
                    <option value="SQLite">SQLite</option>
                    <option value="SQL Server">SQL Server</option>
                </select>
             </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-100 shrink-0">
            <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 pl-9 pr-3 text-xs outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all placeholder:text-slate-400"
                    placeholder="Search tables..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar shrink-0">
            {[
                { id: 'Tables', label: 'Tables', count: nodes.length },
                { id: 'Relationships', label: 'Relationships', count: edges.length },
            ].map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                        flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors flex-1 justify-center
                        ${activeTab === tab.id ? 'border-primary-600 text-primary-700 bg-primary-50/50' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
                    `}
                >
                    {tab.label} <span className="bg-slate-200/60 px-1.5 py-0.5 rounded-full text-[10px] text-slate-600">{tab.count}</span>
                </button>
            ))}
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/30">
            {activeTab === 'Tables' && (
                <div className="p-2 space-y-1 pb-20 md:pb-2">
                    <div className="flex gap-2 mb-2">
                        <button 
                            onClick={() => addTable({ name: 'new_table' })}
                            className="flex-1 flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-lg p-2.5 md:p-2 text-xs font-medium text-slate-500 hover:border-primary-400 hover:text-primary-600 hover:bg-white transition-all bg-slate-50/50"
                        >
                            <Plus size={14} /> Add Table
                        </button>
                        <button
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className={`px-3 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-400 hover:bg-white transition-all bg-slate-50/50 ${showColorPicker ? 'bg-primary-50 border-primary-400 text-primary-600' : ''}`}
                            title="Pick Color"
                        >
                             <Palette size={14} />
                        </button>
                    </div>

                    {showColorPicker && (
                        <div className="grid grid-cols-7 gap-2 mb-3 p-3 bg-white border border-slate-100 rounded-lg shadow-sm animate-in slide-in-from-top-1">
                             {tableColors.map(c => (
                                 <button
                                    key={c}
                                    onClick={() => {
                                        addTable({ name: 'new_table', color: c });
                                        setShowColorPicker(false);
                                    }}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getColorClass(c)}`}
                                    title={c.charAt(0).toUpperCase() + c.slice(1)}
                                 />
                             ))}
                        </div>
                    )}

                    {filteredNodes.map(node => (
                        <div key={node.id} className="group flex items-center justify-between p-2.5 md:p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg cursor-pointer transition-all bg-white/50 mb-1 shadow-sm md:shadow-none">
                             <div className="flex items-center gap-3 md:gap-2 overflow-hidden">
                                 <GripVertical size={14} className="text-slate-300 hidden md:block" />
                                 <div className={`w-3 h-3 md:w-2 md:h-2 rounded-full bg-${node.data.color || 'slate'}-400 shrink-0`}></div>
                                 <span className="text-sm text-slate-700 truncate font-medium">{node.data.name}</span>
                             </div>
                             <div className="flex items-center gap-3 md:gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                 <button onClick={(e) => { e.stopPropagation(); removeTable(node.id); }} className="p-1.5 md:p-1 bg-slate-100 md:bg-transparent hover:bg-red-50 text-slate-400 hover:text-red-500 rounded">
                                     <Trash2 size={14} />
                                 </button>
                                 <ChevronRight size={16} className="text-slate-300" />
                             </div>
                        </div>
                    ))}
                    {filteredNodes.length === 0 && <p className="text-center text-xs text-slate-400 py-4 italic">No tables found</p>}
                </div>
            )}

            {activeTab === 'Relationships' && (
                <div className="p-2 space-y-1 pb-20 md:pb-2">
                    {filteredEdges.map(rel => (
                        <div key={rel.id} className="group flex items-center gap-2 p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all min-h-[42px] bg-white/50 mb-1">
                             <GripVertical size={12} className="text-slate-300 shrink-0 hidden md:block" />
                             
                             {editingEdgeId === rel.id ? (
                                <div className="flex-1 flex items-center gap-1">
                                    <input 
                                        autoFocus
                                        className="w-full text-xs bg-slate-50 border border-primary-300 rounded px-1.5 py-1 outline-none text-slate-700"
                                        value={editLabelValue}
                                        onChange={(e) => setEditLabelValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if(e.key === 'Enter') saveEdgeLabel(rel.id);
                                            if(e.key === 'Escape') cancelEdit();
                                        }}
                                        onBlur={() => saveEdgeLabel(rel.id)}
                                        placeholder="Enter label..."
                                    />
                                </div>
                             ) : (
                                <div className="flex-1 min-w-0 flex flex-col cursor-pointer" onClick={() => startEdit(rel.id, String(rel.raw.label || ''))}>
                                    <span className={`text-xs truncate font-medium ${rel.raw.label ? 'text-slate-800' : 'text-slate-600 font-mono'}`} title={String(rel.label)}>
                                        {rel.label}
                                    </span>
                                     {rel.raw.label && (
                                        <span className="text-[10px] text-slate-400 truncate font-mono">
                                            {rel.autoLabel}
                                        </span>
                                     )}
                                </div>
                             )}
                             
                             {!editingEdgeId && (
                                  <button 
                                     onClick={(e) => { 
                                         e.stopPropagation(); 
                                         startEdit(rel.id, String(rel.raw.label || '')); 
                                     }} 
                                     className="p-1 text-slate-400 hover:text-primary-600 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                     title="Edit Label"
                                 >
                                     <Pencil size={12} />
                                 </button>
                             )}
                        </div>
                    ))}
                     {filteredEdges.length === 0 && <p className="text-center text-xs text-slate-400 py-4 italic">No relationships found</p>}
                </div>
            )}
        </div>

        {/* Issue Detector Panel - Bottom */}
        <div className={`border-t border-slate-200 bg-white flex flex-col transition-all duration-300 shrink-0 ${isIssuesOpen ? 'h-56 md:h-64' : 'h-10'}`}>
            <button 
                onClick={() => setIsIssuesOpen(!isIssuesOpen)}
                className="flex items-center justify-between px-4 h-10 border-b border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors w-full"
            >
                <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className={issues.length > 0 ? "text-amber-500" : "text-slate-400"} />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Issues</span>
                    {issues.length > 0 && <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 rounded-full font-bold">{issues.length}</span>}
                </div>
                {isIssuesOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronUp size={14} className="text-slate-400" />}
            </button>

            {isIssuesOpen && (
                <div className="flex-1 overflow-y-auto p-0 relative">
                    {issues.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <Check className="text-green-500 mb-2" size={24} />
                            <p className="text-sm font-medium text-slate-700">No issues detected</p>
                            <p className="text-xs text-slate-400 mt-1 mb-3">Your schema looks good!</p>
                            <button 
                                onClick={analyzeSchema}
                                disabled={isAnalyzing}
                                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-primary-400 text-slate-600 text-xs rounded-md shadow-sm transition-all flex items-center gap-1.5"
                            >
                                {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} Re-scan
                            </button>
                        </div>
                    ) : (
                         <div className="flex flex-col h-full">
                             <div className="sticky top-0 bg-white/90 backdrop-blur-sm p-2 border-b border-slate-100 z-10 flex justify-between items-center shrink-0">
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Analysis Results</span>
                                 <button 
                                    onClick={analyzeSchema}
                                    disabled={isAnalyzing || isFixing}
                                    className="text-xs text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-primary-50 transition-colors"
                                 >
                                     {isAnalyzing ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />} Re-scan
                                 </button>
                             </div>
                             <div className="p-3 space-y-2.5 pb-20 md:pb-3">
                                 {issues.map(issue => (
                                     <div key={issue.id} className={`p-3 rounded-lg border flex flex-col gap-2 shadow-sm transition-all
                                         ${issue.type === 'error' ? 'bg-red-50 border-red-100' : ''}
                                         ${issue.type === 'warning' ? 'bg-amber-50 border-amber-100' : ''}
                                         ${issue.type === 'info' ? 'bg-blue-50 border-blue-100' : ''}
                                         hover:shadow-md
                                     `}>
                                         <div className="flex items-start gap-3">
                                            {issue.type === 'error' && <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />}
                                            {issue.type === 'warning' && <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />}
                                            {issue.type === 'info' && <Lightbulb size={16} className="text-blue-600 mt-0.5 shrink-0" />}
                                            
                                            <div className="flex-1">
                                                <h4 className={`text-xs font-bold leading-tight mb-1 ${
                                                    issue.type === 'error' ? 'text-red-800' : 
                                                    issue.type === 'warning' ? 'text-amber-800' : 'text-blue-800'
                                                }`}>
                                                    {issue.title}
                                                </h4>
                                                <p className={`text-[11px] leading-relaxed ${
                                                    issue.type === 'error' ? 'text-red-700/80' : 
                                                    issue.type === 'warning' ? 'text-amber-700/80' : 'text-blue-700/80'
                                                }`}>
                                                    {issue.description}
                                                </p>
                                            </div>
                                         </div>
                                         
                                         {/* Fix Button */}
                                         <div className="flex justify-end pt-1">
                                              <button
                                                  onClick={() => fixIssue(issue.id)}
                                                  disabled={isFixing || isAnalyzing}
                                                  className={`text-[10px] flex items-center gap-1.5 px-2 py-1 bg-white border font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                                                    ${issue.type === 'error' ? 'border-red-200 text-red-700 hover:bg-red-50' : 
                                                      issue.type === 'warning' ? 'border-amber-200 text-amber-700 hover:bg-amber-50' : 
                                                      'border-blue-200 text-blue-700 hover:bg-blue-50'}
                                                  `}
                                              >
                                                  {isFixing ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>}
                                                  Fix with AI
                                              </button>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                    )}
                    
                    {(isAnalyzing || isFixing) && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                            <Loader2 className="animate-spin text-primary-600 mb-2" size={24} />
                            <span className="text-xs font-medium text-slate-600">
                                {isFixing ? 'Applying Fix...' : 'Analyzing Schema...'}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
        </div>
    </>
  );
};

const ImportModal = ({ onClose }: { onClose: () => void }) => {
    const [step, setStep] = useState<'input' | 'preview'>('input');
    const [sqlContent, setSqlContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<{ tables: Table[], relationships: any[] } | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    
    const { loadSchema, toggleSettings } = useSchemaStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setSqlContent(event.target.result as string);
                setError(null);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const handleAnalyze = async () => {
        if (!sqlContent.trim()) return;
        setIsLoading(true);
        setError(null);

        try {
            const result = await parseSqlToSchema(sqlContent);
            if (result.tables.length === 0) {
                setError("Could not find any CREATE TABLE statements in your SQL.");
            } else {
                setParsedData(result);
                setStep('preview');
            }
        } catch (err: any) {
            if (err.message === 'API_KEY_MISSING') {
                toggleSettings(true);
                setError("API Key is required.");
            } else if (err.message === 'LIMIT_REACHED') {
                setError("Daily limit reached (5/5). Add a key in settings.");
            } else {
                setError("Failed to parse SQL. The AI model encountered an error or the syntax is invalid.");
            }
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalImport = () => {
        if (parsedData) {
            loadSchema(parsedData.tables, parsedData.relationships, true);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in zoom-in-95 duration-200 border border-slate-200">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                    <div className="overflow-hidden">
                        <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Upload size={20} className="text-primary-600 shrink-0" /> <span className="truncate">Import SQL Schema</span>
                        </h3>
                        <p className="text-xs md:text-sm text-slate-500 mt-1 truncate">
                            {step === 'input' ? 'Paste DDL script or upload .sql file.' : 'Review extracted schema.'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden p-4 md:p-6 bg-white">
                    {step === 'input' ? (
                        <div className="h-full flex flex-col gap-4">
                             {/* File Upload Header */}
                             <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    DDL Script
                                </label>
                                <div className="flex items-center gap-2 self-start sm:self-auto">
                                     {fileName && (
                                        <div className="flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-md text-xs font-medium border border-primary-100 animate-in fade-in max-w-[150px] sm:max-w-xs">
                                            <FileText size={12} className="shrink-0" />
                                            <span className="truncate">{fileName}</span>
                                            <button 
                                                onClick={() => {
                                                    setFileName(null);
                                                    setSqlContent('');
                                                }} 
                                                className="ml-1 hover:text-primary-900 transition-colors shrink-0"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    )}
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-3 py-1.5 bg-white border border-slate-200 hover:border-primary-400 hover:text-primary-600 rounded-md text-xs font-medium text-slate-600 flex items-center gap-2 transition-all whitespace-nowrap shadow-sm"
                                    >
                                        <Upload size={12} /> {fileName ? 'Replace' : 'Upload .sql'}
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileUpload} 
                                        className="hidden" 
                                        accept=".sql,.txt"
                                    />
                                </div>
                            </div>

                            {/* Code Editor Area */}
                            <div className="flex-1 relative group">
                                <div className="absolute inset-0 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all">
                                     <textarea
                                        className="w-full h-full bg-transparent p-4 text-xs md:text-sm font-mono text-slate-800 outline-none resize-none placeholder-slate-400 leading-relaxed"
                                        placeholder={`CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(255)
);`}
                                        value={sqlContent}
                                        onChange={(e) => setSqlContent(e.target.value)}
                                        spellCheck={false}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col gap-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4 flex items-start gap-3">
                                <Check className="text-green-600 mt-1 shrink-0" size={18} />
                                <div>
                                    <h4 className="text-green-800 font-semibold text-sm">Analysis Complete</h4>
                                    <p className="text-green-700/80 text-xs mt-1">
                                        Found <strong className="text-green-900">{parsedData?.tables.length}</strong> tables and <strong className="text-green-900">{parsedData?.relationships.length}</strong> relationships.
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-lg bg-slate-50 p-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {parsedData?.tables.map((table, idx) => (
                                        <div key={idx} className="p-3 bg-white rounded border border-slate-200 flex items-start gap-3 shadow-sm">
                                            <Database size={16} className="text-slate-400 mt-1 shrink-0" />
                                            <div className="overflow-hidden min-w-0">
                                                <div className="font-semibold text-slate-700 text-sm truncate" title={table.name}>{table.name}</div>
                                                <div className="text-xs text-slate-500 mt-1">{table.columns.length} columns</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                    {error ? (
                        <div className="flex items-center gap-2 text-red-600 text-sm w-full sm:w-auto bg-red-50 px-3 py-1.5 rounded border border-red-100">
                            <AlertCircle size={16} className="shrink-0" />
                            <span className="truncate max-w-[250px]" title={error}>{error}</span>
                        </div>
                    ) : (
                         <div className="text-xs text-slate-500 hidden sm:block">
                             {step === 'input' ? 'Paste valid SQL DDL statements.' : 'Review tables before importing.'}
                         </div>
                    )}

                    <div className="flex gap-3 w-full sm:w-auto justify-end">
                        <button 
                            onClick={onClose} 
                            className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        
                        {step === 'input' ? (
                            <button 
                                onClick={handleAnalyze} 
                                disabled={isLoading || !sqlContent.trim()}
                                className="px-6 py-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-700/20 w-full sm:w-auto"
                            >
                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
                                {isLoading ? 'Analyzing...' : 'Analyze SQL'}
                            </button>
                        ) : (
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button 
                                    onClick={() => setStep('input')}
                                    className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-lg transition-colors shadow-sm"
                                >
                                    Back
                                </button>
                                <button 
                                    onClick={handleFinalImport}
                                    className="flex-1 sm:flex-none px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                                >
                                    <Download size={16} /> Import
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SaveProjectModal = ({ onClose }: { onClose: () => void }) => {
    const { saveProject, user, currentProjectName } = useSchemaStore();
    // Default to currentProjectName to avoid re-typing
    const [name, setName] = useState(currentProjectName || '');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Project name cannot be empty');
            return;
        }
        setIsSaving(true);
        await saveProject(name);
        setIsSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-200 animate-in scale-95 duration-200">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Save Project</h3>
                <p className="text-xs text-slate-500 mb-6">
                    {user ? `Saving to cloud as ${user.email} and local storage.` : "Saving to local storage. Link will be generated for cloud sharing."}
                </p>
                <div className="mb-6 space-y-2">
                    <input 
                        autoFocus
                        className={`w-full bg-slate-50 border rounded-lg p-3 text-slate-900 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${error ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary-500'}`}
                        placeholder="Project Name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (error) setError('');
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    />
                    {error && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{error}</p>}
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
                    <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-lg transition-colors disabled:opacity-50 font-medium shadow-md">
                        {isSaving ? 'Saving...' : 'Save Project'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const LoadProjectModal = ({ onClose }: { onClose: () => void }) => {
    const { loadProject, deleteProject, savedProjects, user } = useSchemaStore();

    const handleLoad = (name: string) => {
        loadProject(name);
        onClose();
    };

    const handleDelete = (name: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if(confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteProject(name);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 flex flex-col max-h-[80vh] border border-slate-200 animate-in scale-95 duration-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Load Project</h3>
                
                {savedProjects.length === 0 ? (
                    <div className="text-center text-slate-400 py-8 italic">No saved projects found.</div>
                ) : (
                    <div className="flex-1 overflow-y-auto space-y-2 mb-6">
                        {savedProjects.map(name => (
                            <div key={name} onClick={() => handleLoad(name)} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-primary-400 hover:bg-white cursor-pointer group transition-all">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Database size={16} className="text-primary-600 shrink-0" />
                                    <span className="text-slate-700 font-medium truncate">{name}</span>
                                </div>
                                <button onClick={(e) => handleDelete(name, e)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100" title="Delete Project">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button onClick={onClose} className="px-4 py-2 text-slate-500 hover:text-slate-800 transition-colors font-medium">Close</button>
                </div>
            </div>
        </div>
    );
};

const SqlModal = ({ onClose }: { onClose: () => void }) => {
    const { nodes, edges, dialect } = useSchemaStore();
    const [copied, setCopied] = useState(false);
    const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set());
    const [onDeleteAction, setOnDeleteAction] = useState('NO ACTION');
    const [onUpdateAction, setOnUpdateAction] = useState('NO ACTION');
    const [activeTab, setActiveTab] = useState<'settings' | 'preview'>('preview');

    const actions = ['NO ACTION', 'CASCADE', 'SET NULL', 'RESTRICT'];

    useEffect(() => {
        setSelectedTables(new Set(nodes.map(n => n.id)));
    }, []);

    const toggleTable = (id: string) => {
        const newSet = new Set(selectedTables);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedTables(newSet);
    };

    const toggleAll = () => {
        if (selectedTables.size === nodes.length) {
            setSelectedTables(new Set());
        } else {
            setSelectedTables(new Set(nodes.map(n => n.id)));
        }
    };

    // Validation Logic
    const validationIssues = useMemo(() => {
        const issues: { type: 'error' | 'warning', message: string }[] = [];
        const tableNames = new Set<string>();
        
        // Only validate selected tables
        const selectedNodes = nodes.filter(n => selectedTables.has(n.id));

        selectedNodes.forEach(node => {
            const table = node.data;
            const tableName = table.name ? table.name.trim() : '';

            // 1. Table Name Checks
            if (!tableName) {
                issues.push({ type: 'error', message: `Table with ID ${node.id.substr(0,4)}... is unnamed.` });
            } else {
                if (tableNames.has(tableName.toLowerCase())) {
                    issues.push({ type: 'error', message: `Duplicate table name: "${tableName}".` });
                }
                tableNames.add(tableName.toLowerCase());
            }

            // 2. Column Checks
            if (!table.columns || table.columns.length === 0) {
                 issues.push({ type: 'warning', message: `Table "${tableName || 'Unnamed'}" has no columns.` });
            } else {
                // PK Check
                if (!table.columns.some(c => c.isPrimaryKey)) {
                    issues.push({ type: 'warning', message: `Table "${tableName}" has no Primary Key.` });
                }
                
                const colNames = new Set<string>();
                table.columns.forEach(c => {
                    const colName = c.name ? c.name.trim() : '';
                    if (!colName) {
                         issues.push({ type: 'error', message: `Table "${tableName}" contains an unnamed column.` });
                    } else {
                        if (colNames.has(colName.toLowerCase())) {
                            issues.push({ type: 'error', message: `Table "${tableName}" has duplicate column: "${colName}".` });
                        }
                        colNames.add(colName.toLowerCase());
                    }
                });
            }
        });
        return issues;
    }, [nodes, selectedTables]);

    const hasErrors = validationIssues.some(i => i.type === 'error');

    const generateSql = useMemo(() => {
        let sql = `-- Generated by SchemaForge (${dialect})\n-- Date: ${new Date().toLocaleString()}\n\n`;
        
        nodes.forEach(node => {
            if (!selectedTables.has(node.id)) return;
            const t = node.data as Table;
            sql += `CREATE TABLE ${t.name} (\n`;
            const cols = t.columns.map(c => {
                let def = `  ${c.name} ${c.type}`;
                if (c.isPrimaryKey) def += ' PRIMARY KEY';
                if (!c.isNullable && !c.isPrimaryKey) def += ' NOT NULL';
                return def;
            });
            sql += cols.join(',\n');
            sql += `\n);\n\n`;
        });

        const relationships: string[] = [];
        edges.forEach(edge => {
            if (!selectedTables.has(edge.source) || !selectedTables.has(edge.target)) return;
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode || !edge.sourceHandle || !edge.targetHandle) return;

            const sourceColId = edge.sourceHandle.replace('source-', '').replace('target-', '');
            const targetColId = edge.targetHandle.replace('source-', '').replace('target-', '');
            const sourceCol = sourceNode.data.columns.find((c: any) => c.id === sourceColId);
            const targetCol = targetNode.data.columns.find((c: any) => c.id === targetColId);

            if (!sourceCol || !targetCol) return;

            let parentTable = '', parentCol = '', childTable = '', childCol = '';
            let isResolved = false;

            if (sourceCol.isForeignKey && !targetCol.isForeignKey) {
                childTable = sourceNode.data.name; childCol = sourceCol.name; parentTable = targetNode.data.name; parentCol = targetCol.name; isResolved = true;
            } else if (targetCol.isForeignKey && !sourceCol.isForeignKey) {
                childTable = targetNode.data.name; childCol = targetCol.name; parentTable = sourceNode.data.name; parentCol = sourceCol.name; isResolved = true;
            }

            if (!isResolved) {
                if (sourceCol.isPrimaryKey && !targetCol.isPrimaryKey) {
                    parentTable = sourceNode.data.name; parentCol = sourceCol.name; childTable = targetNode.data.name; childCol = targetCol.name;
                } else if (targetCol.isPrimaryKey && !sourceCol.isPrimaryKey) {
                    parentTable = targetNode.data.name; parentCol = targetCol.name; childTable = sourceNode.data.name; childCol = sourceCol.name;
                } else {
                    parentTable = sourceNode.data.name; parentCol = sourceCol.name; childTable = targetNode.data.name; childCol = targetCol.name;
                }
            }

            const constraintName = `fk_${childTable}_${parentTable}_${childCol}`;
            let statement = `ALTER TABLE ${childTable} ADD CONSTRAINT ${constraintName} FOREIGN KEY (${childCol}) REFERENCES ${parentTable}(${parentCol})`;
            if (onDeleteAction !== 'NO ACTION') statement += ` ON DELETE ${onDeleteAction}`;
            if (onUpdateAction !== 'NO ACTION') statement += ` ON UPDATE ${onUpdateAction}`;
            statement += ';';
            if (!relationships.includes(statement)) relationships.push(statement);
        });
        
        if (relationships.length > 0) {
            sql += `-- Relationships\n`;
            sql += relationships.join('\n');
            sql += '\n';
        }
        return sql;
    }, [nodes, edges, dialect, selectedTables, onDeleteAction, onUpdateAction]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generateSql);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row h-[85vh] md:h-[80vh] overflow-hidden border border-slate-200">
                
                {/* Mobile Tabs */}
                <div className="md:hidden flex border-b border-slate-200">
                    <button 
                        onClick={() => setActiveTab('settings')}
                        className={`flex-1 py-3 text-sm font-medium ${activeTab === 'settings' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500'}`}
                    >
                        Settings
                    </button>
                    <button 
                        onClick={() => setActiveTab('preview')}
                        className={`flex-1 py-3 text-sm font-medium ${activeTab === 'preview' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500'}`}
                    >
                        Preview SQL
                    </button>
                </div>

                {/* Left: Settings & Selection */}
                <div className={`w-full md:w-72 bg-slate-50 border-r border-slate-200 flex flex-col ${activeTab === 'settings' ? 'flex' : 'hidden md:flex'}`}>
                    <div className="p-4 border-b border-slate-200 hidden md:block">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Settings size={18} className="text-primary-600" /> Export Options
                        </h3>
                    </div>
                    
                    <div className="p-4 border-b border-slate-200 space-y-4">
                         <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                                <ArrowRightLeft size={10} /> ON DELETE
                            </label>
                            <select 
                                value={onDeleteAction}
                                onChange={(e) => setOnDeleteAction(e.target.value)}
                                className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded p-2 outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer shadow-sm"
                            >
                                {actions.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                                <ArrowRightLeft size={10} /> ON UPDATE
                            </label>
                            <select 
                                value={onUpdateAction}
                                onChange={(e) => setOnUpdateAction(e.target.value)}
                                className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded p-2 outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer shadow-sm"
                            >
                                {actions.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="p-3 border-b border-slate-200 bg-white">
                        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
                            <input 
                                type="checkbox" 
                                checked={selectedTables.size === nodes.length && nodes.length > 0}
                                onChange={toggleAll}
                                className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="font-semibold">Select All Tables</span>
                        </label>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {nodes.map(node => (
                            <label key={node.id} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer select-none group p-1 hover:bg-white rounded">
                                <input 
                                    type="checkbox"
                                    checked={selectedTables.has(node.id)}
                                    onChange={() => toggleTable(node.id)}
                                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                />
                                <Database size={14} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
                                <span className="truncate">{node.data.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Right: Code Preview */}
                <div className={`flex-1 flex flex-col min-w-0 ${activeTab === 'preview' ? 'flex' : 'hidden md:flex'}`}>
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
                        <div className="flex items-center gap-2">
                            <Code size={18} className="text-green-600" />
                            <span className="font-mono text-sm text-slate-500 font-medium">{dialect} Output</span>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                     {/* Validation Warnings/Errors */}
                    {validationIssues.length > 0 && (
                        <div className={`p-4 border-b ${hasErrors ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'} max-h-40 overflow-y-auto`}>
                            <div className="flex items-center gap-2 mb-2">
                                {hasErrors ? <AlertCircle size={16} className="text-red-600" /> : <AlertTriangle size={16} className="text-amber-600" />}
                                <h4 className={`text-sm font-bold ${hasErrors ? 'text-red-800' : 'text-amber-800'}`}>
                                    {hasErrors ? 'Validation Errors' : 'Validation Warnings'}
                                </h4>
                            </div>
                            <ul className="space-y-1">
                                {validationIssues.map((issue, idx) => (
                                    <li key={idx} className={`text-xs flex items-start gap-2 ${issue.type === 'error' ? 'text-red-700' : 'text-amber-700'}`}>
                                        <span className="mt-0.5">•</span> {issue.message}
                                    </li>
                                ))}
                            </ul>
                            {hasErrors && <p className="text-xs text-red-600 mt-2 font-medium">Please fix errors to ensure valid SQL generation.</p>}
                        </div>
                    )}

                    <div className="flex-1 overflow-auto bg-[#0f172a] p-4 md:p-6 shadow-inner relative">
                        {hasErrors && (
                             <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center z-10">
                                 <div className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg border border-slate-700 shadow-xl text-sm font-medium">
                                     Resolve errors to preview code
                                 </div>
                             </div>
                        )}
                        <pre className={`font-mono text-xs md:text-sm text-blue-100 leading-relaxed whitespace-pre-wrap selection:bg-primary-500/30 ${hasErrors ? 'blur-sm opacity-50' : ''}`}>{generateSql}</pre>
                    </div>

                    <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                            Cancel
                        </button>
                        <button 
                            onClick={handleCopy}
                            disabled={hasErrors}
                            className={`px-6 py-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-all shadow-md shadow-primary-700/20 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />} 
                            {copied ? 'Copied' : 'Copy SQL'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;