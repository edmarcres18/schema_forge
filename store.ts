import { create } from 'zustand';
import { 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges,
  MarkerType,
  type Connection, 
  type Edge, 
  type EdgeChange, 
  type Node, 
  type NodeChange, 
} from 'reactflow';
import { Table, Column, DatabaseDialect, Relationship, UserProfile, Cursor, TableColor, SchemaIssue } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { getLayoutedElements } from './utils/layout';
import { analyzeSchema, fixSchemaIssue } from './services/ai';

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);
const colors = ['#EF4444', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
const getTableColor = (): TableColor => {
    const tableColors: TableColor[] = ['blue', 'white', 'yellow', 'red', 'green', 'purple', 'pink'];
    return tableColors[Math.floor(Math.random() * tableColors.length)];
}

// Browser Fingerprinting to prevent cache-clearing bypass
const generateFingerprint = async (): Promise<string> => {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return 'unknown-device';
        
        // 1. Canvas Fingerprinting
        const txt = 'SchemaForge-Browser-Fingerprint-v1';
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125,1,62,20);
        ctx.fillStyle = "#069";
        ctx.fillText(txt, 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText(txt, 4, 17);
        const canvasData = canvas.toDataURL();

        // 2. Basic Navigator Data
        const navData = [
            navigator.userAgent,
            navigator.language,
            new Date().getTimezoneOffset(),
            window.screen.width + 'x' + window.screen.height,
            (navigator as any).hardwareConcurrency,
            (navigator as any).deviceMemory
        ].join('||');

        // 3. Simple Hash
        const data = canvasData + '||' + navData;
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16);
    } catch (e) {
        console.error("Fingerprint failed", e);
        return 'fallback-' + generateId();
    }
};

interface SchemaState {
  nodes: Node<Table>[];
  edges: Edge[];
  dialect: DatabaseDialect;
  savedProjects: string[]; // LocalStorage keys or Metadata
  
  currentProjectId: string | null;
  currentProjectName: string;

  // App Settings
  apiKey: string;
  isSettingsOpen: boolean;

  // Guest AI Usage
  guestUsage: number;
  maxGuestUsage: number;
  checkGuestUsage: () => Promise<boolean>;
  incrementGuestUsage: () => Promise<void>;

  // Auth
  user: UserProfile | null;
  session: any | null;
  isLoadingAuth: boolean;

  // Collaboration
  cursors: Record<string, Cursor>;
  channel: any | null;

  // Issues
  issues: SchemaIssue[];
  isAnalyzing: boolean;
  isFixing: boolean;
  
  // Saving State
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;

  // Actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addTable: (table: Partial<Table>) => void;
  updateTable: (id: string, data: Partial<Table>) => void;
  removeTable: (id: string) => void;
  addColumn: (tableId: string) => void;
  updateColumn: (tableId: string, columnId: string, data: Partial<Column>) => void;
  removeColumn: (tableId: string, columnId: string) => void;
  updateEdge: (id: string, data: Partial<Edge>) => void;
  setDialect: (dialect: DatabaseDialect) => void;
  setProjectName: (name: string) => void;
  setApiKey: (key: string) => void;
  toggleSettings: (isOpen: boolean) => void;
  loadSchema: (tables: Table[], relationships?: Relationship[], shouldLayout?: boolean) => void;
  autoLayout: () => void;
  
  // Persistence
  saveProject: (name: string) => Promise<string | null>;
  loadProject: (name: string) => Promise<void>;
  loadProjectById: (id: string) => Promise<boolean>;
  deleteProject: (name: string) => Promise<void>;
  
  // Sharing (Client-side Fallback)
  exportProjectState: () => string;
  importProjectState: (base64Data: string) => boolean;
  
  // Auth & Realtime
  setUser: (user: UserProfile | null, session: any | null) => void;
  initializeRealtime: () => void;
  broadcastCursor: (x: number, y: number) => void;

  // AI Analysis
  analyzeSchema: () => Promise<void>;
  fixIssue: (issueId: string) => Promise<void>;
}

export const useSchemaStore = create<SchemaState>((set, get) => ({
  nodes: [],
  edges: [],
  dialect: 'PostgreSQL',
  savedProjects: (() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('schemaforge_projects') || '[]');
    } catch {
      return [];
    }
  })(),
  
  currentProjectId: null,
  currentProjectName: 'Untitled Project',

  // Initialize API key from local storage
  apiKey: typeof window !== 'undefined' ? localStorage.getItem('schemaforge_api_key') || '' : '',
  isSettingsOpen: false,

  // Guest Limits
  guestUsage: 0,
  maxGuestUsage: 5,

  user: null,
  session: null,
  isLoadingAuth: true,
  cursors: {},
  channel: null,
  
  issues: [],
  isAnalyzing: false,
  isFixing: false,
  
  isSaving: false,
  lastSaved: null,
  hasUnsavedChanges: false,

  setUser: (user, session) => set({ user, session, isLoadingAuth: false }),

  setApiKey: (key: string) => {
      localStorage.setItem('schemaforge_api_key', key);
      set({ apiKey: key });
  },

  toggleSettings: (isOpen: boolean) => set({ isSettingsOpen: isOpen }),

  // ------------------------------------------------------------------
  // Guest Mode Logic
  // ------------------------------------------------------------------
  
  checkGuestUsage: async () => {
      // If user has their own key, they are always allowed (usage=0 in context of guest limit)
      if (get().apiKey) return true;
      if (!isSupabaseConfigured()) return true; // Fallback if no backend

      const fingerprint = await generateFingerprint();
      const today = new Date().toISOString().split('T')[0];

      try {
          const { data, error } = await supabase
              .from('daily_usage')
              .select('count')
              .eq('fingerprint', fingerprint)
              .eq('date', today)
              .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
             console.error("Error checking usage:", error);
             return false;
          }

          const used = data?.count || 0;
          set({ guestUsage: used });
          
          return used < get().maxGuestUsage;
      } catch (e) {
          console.error("Failed usage check", e);
          return false;
      }
  },

  incrementGuestUsage: async () => {
      // Don't increment if user is using their own key
      if (get().apiKey) return;
      if (!isSupabaseConfigured()) return;

      const fingerprint = await generateFingerprint();
      const today = new Date().toISOString().split('T')[0];
      const { guestUsage } = get();

      try {
          // Upsert: Try to update, insert if not exists
          const newCount = guestUsage + 1;
          const { error } = await supabase
              .from('daily_usage')
              .upsert({ 
                  fingerprint, 
                  date: today, 
                  count: newCount 
              }, { onConflict: 'fingerprint,date' });

          if (!error) {
              set({ guestUsage: newCount });
          }
      } catch (e) {
          console.error("Failed to increment usage", e);
      }
  },

  // ------------------------------------------------------------------
  // Editor Actions
  // ------------------------------------------------------------------

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
      hasUnsavedChanges: true
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
      hasUnsavedChanges: true
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge({ ...connection, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#64748b', strokeWidth: 2 } }, get().edges),
      hasUnsavedChanges: true
    });
  },

  addTable: (tableData) => {
    const { nodes } = get();
    // Ensure valid, non-empty name
    let baseName = (tableData.name || 'new_table').trim();
    if (!baseName) baseName = 'new_table';

    // Ensure uniqueness
    let name = baseName;
    let count = 1;
    const isNameTaken = (n: string) => nodes.some(node => node.data.name.toLowerCase() === n.toLowerCase());

    while (isNameTaken(name)) {
      name = `${baseName}_${count}`;
      count++;
    }

    const id = generateId();
    const newTable: Table = {
      id,
      name,
      columns: tableData.columns || [
        { id: generateId(), name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false }
      ],
      position: tableData.position || { x: 100 + Math.random() * 50, y: 100 + Math.random() * 50 },
      color: tableData.color || getTableColor(),
    };

    const newNode: Node<Table> = {
      id,
      type: 'tableNode',
      position: newTable.position,
      data: newTable,
    };

    set({ nodes: [...nodes, newNode], hasUnsavedChanges: true });
  },

  updateTable: (id, data) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
      hasUnsavedChanges: true
    });
  },

  removeTable: (id) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      hasUnsavedChanges: true
    });
  },

  addColumn: (tableId) => {
    const newCol: Column = {
      id: generateId(),
      name: 'new_column',
      type: 'VARCHAR',
      isPrimaryKey: false,
      isForeignKey: false,
      isNullable: true,
    };

    set({
      nodes: get().nodes.map((node) => {
        if (node.id === tableId) {
          return {
            ...node,
            data: {
              ...node.data,
              columns: [...node.data.columns, newCol],
            },
          };
        }
        return node;
      }),
      hasUnsavedChanges: true
    });
  },

  updateColumn: (tableId, columnId, colData) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === tableId) {
          const newColumns = node.data.columns.map((col) =>
            col.id === columnId ? { ...col, ...colData } : col
          );
          return {
            ...node,
            data: { ...node.data, columns: newColumns },
          };
        }
        return node;
      }),
      hasUnsavedChanges: true
    });
  },

  removeColumn: (tableId, columnId) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === tableId) {
          return {
            ...node,
            data: {
              ...node.data,
              columns: node.data.columns.filter((c) => c.id !== columnId),
            },
          };
        }
        return node;
      }),
      hasUnsavedChanges: true
    });
  },

  updateEdge: (id, data) => {
    set({
        edges: get().edges.map((edge) => {
            if (edge.id === id) {
                return { ...edge, ...data };
            }
            return edge;
        }),
        hasUnsavedChanges: true
    });
  },

  setDialect: (dialect) => set({ dialect, hasUnsavedChanges: true }),
  setProjectName: (name) => set({ currentProjectName: name, hasUnsavedChanges: true }),
  
  loadSchema: (tables, relationships = [], shouldLayout = true) => {
    let newNodes: Node<Table>[] = tables.map(t => ({
        id: t.id,
        type: 'tableNode',
        position: t.position,
        data: { ...t, color: t.color || getTableColor() }
    }));
    
    let newEdges: Edge[] = relationships.map(r => ({
        id: r.id,
        source: r.source,
        target: r.target,
        sourceHandle: r.sourceHandle,
        targetHandle: r.targetHandle,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#64748b', strokeWidth: 2 },
        animated: true,
    }));

    if (shouldLayout) {
        const layout = getLayoutedElements(newNodes, newEdges);
        newNodes = layout.nodes;
        newEdges = layout.edges;
    }

    set({ nodes: newNodes, edges: newEdges, issues: [], currentProjectId: null, hasUnsavedChanges: true }); 
  },

  autoLayout: () => {
      const { nodes, edges } = get();
      const layout = getLayoutedElements(nodes, edges);
      set({ nodes: [...layout.nodes], edges: [...layout.edges], hasUnsavedChanges: true });
  },

  // ------------------------------------------------------------------
  // Persistence (LocalStorage + Supabase)
  // ------------------------------------------------------------------
  
  saveProject: async (name: string) => {
    const { nodes, edges, dialect, user, currentProjectId } = get();
    set({ isSaving: true });
    
    // Prepare data
    const projectData = { 
        nodes, 
        edges, 
        dialect, 
        lastModified: Date.now(),
        // Persist the ID if we have one
        id: currentProjectId 
    };
    
    set({ currentProjectName: name });
    
    // 1. Local Save
    try {
        localStorage.setItem(`schemaforge_data_${name}`, JSON.stringify(projectData));
        
        const list = get().savedProjects;
        if (!list.includes(name)) {
            const newList = [...list, name];
            localStorage.setItem('schemaforge_projects', JSON.stringify(newList));
            set({ savedProjects: newList });
        }
    } catch (e) {
        console.error("Local save failed", e);
    }

    // 2. Supabase Save (Auth or Anonymous)
    if (isSupabaseConfigured()) {
        try {
            const payload: any = { 
                name, 
                content: projectData, 
                updated_at: new Date().toISOString()
            };
            
            if (user) payload.user_id = user.id;

            if (currentProjectId) {
                // Update Existing
                const { error } = await supabase
                    .from('projects')
                    .update(payload)
                    .eq('id', currentProjectId);
                
                if (error) {
                    console.error("Cloud update failed", error);
                    set({ isSaving: false, lastSaved: new Date(), hasUnsavedChanges: false });
                    return currentProjectId; 
                }
                
                set({ isSaving: false, lastSaved: new Date(), hasUnsavedChanges: false });
                return currentProjectId;
            } else {
                // Insert New
                const { data, error } = await supabase
                    .from('projects')
                    .insert(payload)
                    .select('id')
                    .single();
                
                if (error) throw error;
                
                if (data) {
                    set({ currentProjectId: data.id });
                    // Update local storage with the new ID so subsequent local saves include it
                    const updatedData = { ...projectData, id: data.id };
                    localStorage.setItem(`schemaforge_data_${name}`, JSON.stringify(updatedData));
                    set({ isSaving: false, lastSaved: new Date(), hasUnsavedChanges: false });
                    return data.id;
                }
            }
        } catch (e) {
            console.error("Failed to save to cloud", e);
        }
    }

    set({ isSaving: false, lastSaved: new Date(), hasUnsavedChanges: false });
    return currentProjectId;
  },

  loadProject: async (name: string) => {
    // 1. Try Local First
    const dataStr = localStorage.getItem(`schemaforge_data_${name}`);
    if (dataStr) {
        const data = JSON.parse(dataStr);
        set({ 
            nodes: data.nodes || [], 
            edges: data.edges || [], 
            dialect: data.dialect || 'PostgreSQL',
            issues: [],
            currentProjectName: name,
            currentProjectId: data.id || null,
            hasUnsavedChanges: false,
            lastSaved: new Date(data.lastModified || Date.now())
        });

        if (data.id && isSupabaseConfigured()) {
             setTimeout(() => get().initializeRealtime(), 0);
        }
        return;
    }

    // 2. Try Supabase (if authenticated)
    const { user } = get();
    if (user && isSupabaseConfigured()) {
        try {
            const { data } = await supabase
                .from('projects')
                .select('id, content')
                .eq('name', name)
                .eq('user_id', user.id)
                .single();
            
            if (data && data.content) {
                 set({ 
                    nodes: data.content.nodes || [], 
                    edges: data.content.edges || [], 
                    dialect: data.content.dialect || 'PostgreSQL',
                    issues: [],
                    currentProjectId: data.id,
                    currentProjectName: name,
                    hasUnsavedChanges: false,
                    lastSaved: new Date()
                });
                get().initializeRealtime();
            }
        } catch (e) {
            console.error("Failed to load from cloud", e);
        }
    }
  },

  loadProjectById: async (id: string) => {
      if (!isSupabaseConfigured()) return false;
      try {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

          if (data && data.content) {
              const { name, content } = data;
              set({
                  nodes: content.nodes || [],
                  edges: content.edges || [],
                  dialect: content.dialect || 'PostgreSQL',
                  currentProjectId: data.id,
                  currentProjectName: name || 'Shared Project',
                  issues: [],
                  hasUnsavedChanges: false,
                  lastSaved: new Date(data.updated_at)
              });
              
              // Cache locally so it's listed in Load menu
              const list = get().savedProjects;
              const safeName = name || `Shared-${id.substr(0,8)}`;
              
              if (!list.includes(safeName)) {
                  const newList = [...list, safeName];
                  localStorage.setItem('schemaforge_projects', JSON.stringify(newList));
                  set({ savedProjects: newList });
              }
              
              const localData = { ...content, id: data.id, lastModified: Date.now() };
              localStorage.setItem(`schemaforge_data_${safeName}`, JSON.stringify(localData));

              get().initializeRealtime();
              
              return true;
          }
      } catch (e) {
          console.error("Error loading project by ID", e);
      }
      return false;
  },

  deleteProject: async (name: string) => {
      localStorage.removeItem(`schemaforge_data_${name}`);
      const list = get().savedProjects;
      const newList = list.filter((n) => n !== name);
      localStorage.setItem('schemaforge_projects', JSON.stringify(newList));
      set({ savedProjects: newList });
      
      if (get().currentProjectName === name) {
          set({ currentProjectName: 'Untitled Project', currentProjectId: null });
      }

      const { user } = get();
      if (user && isSupabaseConfigured()) {
          try {
             await supabase
                .from('projects')
                .delete()
                .eq('name', name)
                .eq('user_id', user.id);
          } catch(e) {
              console.error("Failed to delete from cloud", e);
          }
      }
  },

  // ------------------------------------------------------------------
  // Client-Side Sharing (Snapshot)
  // ------------------------------------------------------------------

  exportProjectState: () => {
    const { nodes, edges, dialect, currentProjectName } = get();
    const projectData = {
        nodes,
        edges,
        dialect,
        name: currentProjectName,
        lastModified: Date.now()
    };
    try {
        const jsonStr = JSON.stringify(projectData);
        const encoded = btoa(encodeURIComponent(jsonStr));
        
        // Safety check for URL length limit
        if (encoded.length > 30000) {
            console.warn("Project is too large for URL sharing.");
            return "";
        }
        return encoded;
    } catch (e) {
        console.error("Failed to encode project", e);
        return "";
    }
  },

  importProjectState: (base64Data: string) => {
    try {
        const jsonStr = decodeURIComponent(atob(base64Data));
        const data = JSON.parse(jsonStr);
        set({
            nodes: data.nodes || [],
            edges: data.edges || [],
            dialect: data.dialect || 'PostgreSQL',
            currentProjectName: data.name || 'Imported Project',
            currentProjectId: null, // Snapshot, not a synced project
            hasUnsavedChanges: false,
            lastSaved: new Date(data.lastModified || Date.now())
        });
        
        // Run autolayout if nodes are piled up
        if (data.nodes && data.nodes.length > 0 && data.nodes[0].position.x === 0 && data.nodes[0].position.y === 0) {
             get().autoLayout();
        }
        return true;
    } catch (e) {
        console.error("Failed to decode project", e);
        return false;
    }
  },

  // ------------------------------------------------------------------
  // Realtime (Cursors)
  // ------------------------------------------------------------------

  initializeRealtime: () => {
    if (!isSupabaseConfigured()) return;
    
    if (get().channel) {
        supabase.removeChannel(get().channel);
    }
    
    const roomId = get().currentProjectId ? `room_${get().currentProjectId}` : 'room_global';

    const channel = supabase.channel(roomId, {
        config: {
          presence: {
            key: generateId(),
          },
        },
    });

    channel
      .on('broadcast', { event: 'cursor-pos' }, (payload) => {
        const { userId, x, y, color, userName } = payload.payload;
        set((state) => ({
            cursors: {
                ...state.cursors,
                [userId]: { x, y, userId, color, userName }
            }
        }));
      })
      .subscribe((status) => {
        // console.log("Connected to Realtime", status);
      });

    set({ channel });
  },

  broadcastCursor: (x: number, y: number) => {
      const { channel, user } = get();
      if (!channel) return;
      
      const userId = user?.id || 'anon-' + (get().currentProjectId || 'guest'); 
      const userName = user?.email.split('@')[0] || 'Guest';

      channel.send({
          type: 'broadcast',
          event: 'cursor-pos',
          payload: { 
              userId: userId, 
              x, 
              y, 
              color: getRandomColor(),
              userName: userName
          }
      });
  },

  analyzeSchema: async () => {
      const { nodes, edges } = get();
      set({ isAnalyzing: true });
      
      try {
          const tables = nodes.map(n => n.data);
          const relationships: Relationship[] = edges.map(e => ({
              id: e.id,
              source: e.source,
              target: e.target,
              sourceHandle: e.sourceHandle || undefined,
              targetHandle: e.targetHandle || undefined
          }));

          const rawIssues = await analyzeSchema(tables, relationships);

          const issues: SchemaIssue[] = rawIssues.map((issue: any) => {
              // Try to resolve exact table ID if not provided by AI, fallback to name matching
              let tableId = issue.tableId;
              if (!tableId && issue.tableName) {
                  const relatedTable = tables.find(t => t.name.toLowerCase() === (issue.tableName || '').toLowerCase());
                  if (relatedTable) tableId = relatedTable.id;
              }

              return {
                  id: generateId(),
                  type: (issue.type || 'info').toLowerCase() as any,
                  title: issue.title,
                  description: issue.description,
                  tableId: tableId,
                  tableName: issue.tableName
              };
          });

          set({ issues });
      } catch (e) {
          console.error("Store Analysis Error:", e);
      } finally {
          set({ isAnalyzing: false });
      }
  },

  fixIssue: async (issueId: string) => {
    set({ isFixing: true });
    try {
      const { nodes, issues } = get();
      const issue = issues.find(i => i.id === issueId);
      if(!issue) throw new Error("Issue not found");

      const currentTables = nodes.map(n => n.data);
      const { tables: newTables, relationships: newRelationships } = await fixSchemaIssue(currentTables, issue);
      
      // Merge logic: preserve positions of existing tables
      const mergedNodes = newTables.map(t => {
          const existingNode = nodes.find(n => n.id === t.id);
          return {
              id: t.id,
              type: 'tableNode',
              // Use existing position if available, otherwise random/default
              position: existingNode ? existingNode.position : { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
              data: { ...t, color: existingNode?.data.color || getTableColor() }
          };
      });
      
      // Regenerate edges based on the new schema structure
      const newEdges: Edge[] = newRelationships.map(r => ({
           id: r.id,
           source: r.source,
           target: r.target,
           sourceHandle: r.sourceHandle,
           targetHandle: r.targetHandle,
           type: 'smoothstep',
           markerEnd: { type: MarkerType.ArrowClosed },
           style: { stroke: '#64748b', strokeWidth: 2 },
           animated: true,
      }));

      set({
          nodes: mergedNodes,
          edges: newEdges,
          // Remove the resolved issue
          issues: issues.filter(i => i.id !== issueId),
          isFixing: false,
          hasUnsavedChanges: true
      });

    } catch (e) {
        console.error("Fix failed", e);
        set({ isFixing: false });
    }
}
}));