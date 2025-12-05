import React, { memo } from 'react';
import { Handle, Position, useStore, type NodeProps } from 'reactflow';
import { Table, TableColor } from '../types';
import { useSchemaStore } from '../store';
import { Trash2, Plus } from 'lucide-react';

const TableNode = ({ id, data }: NodeProps<Table>) => {
  const { updateTable, removeTable, addColumn, removeColumn, updateColumn } = useSchemaStore();
  
  // Get connection state from React Flow store
  const connectionNodeId = useStore((store) => store.connectionNodeId);
  const isConnecting = !!connectionNodeId;
  const isTarget = isConnecting && connectionNodeId !== id;

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTable(id, { name: e.target.value });
  };

  // Color variants based on the reference image style
  const colorStyles: Record<TableColor | string, { header: string, border: string, body: string, icon: string }> = {
    blue: { header: 'bg-blue-50', border: 'border-blue-100', body: 'bg-white', icon: 'bg-blue-400' },
    white: { header: 'bg-slate-50', border: 'border-slate-200', body: 'bg-white', icon: 'bg-slate-400' },
    yellow: { header: 'bg-yellow-50', border: 'border-yellow-100', body: 'bg-white', icon: 'bg-yellow-400' },
    red: { header: 'bg-red-50', border: 'border-red-100', body: 'bg-white', icon: 'bg-red-400' },
    green: { header: 'bg-green-50', border: 'border-green-100', body: 'bg-white', icon: 'bg-green-400' },
    purple: { header: 'bg-purple-50', border: 'border-purple-100', body: 'bg-white', icon: 'bg-purple-400' },
    pink: { header: 'bg-pink-50', border: 'border-pink-100', body: 'bg-white', icon: 'bg-pink-400' },
  };

  // Default to white/slate if no color set
  const styles = colorStyles[data.color || 'white'];

  return (
    <div className={`min-w-[240px] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden text-sm transition-all duration-200 border ${styles.border} ${styles.body} ${isTarget ? 'ring-2 ring-primary-500/50 shadow-lg' : ''}`}>
      
      {/* Header */}
      <div className={`p-3 border-b ${styles.border} ${styles.header} flex items-center justify-between handle drag-handle cursor-move group`}>
        <div className="flex items-center gap-2 flex-1">
            <div className={`w-2 h-2 rounded-full ${styles.icon}`}></div>
            <input
                className="bg-transparent text-slate-800 font-bold w-full outline-none placeholder-slate-400 text-sm"
                value={data.name}
                onChange={handleChangeName}
                placeholder="Table Name"
            />
        </div>
        
        {/* Actions - Always visible on mobile (opacity-100), hidden on desktop until hover (md:opacity-0) */}
        <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
             <button onClick={() => addColumn(id)} className="p-1 hover:bg-white rounded text-slate-400 hover:text-primary-600 transition-colors" title="Add Column">
                <Plus size={14} />
            </button>
            <button onClick={() => removeTable(id)} className="p-1 hover:bg-white rounded text-slate-400 hover:text-red-500 transition-colors" title="Delete Table">
                <Trash2 size={14} />
            </button>
        </div>
      </div>

      {/* Columns */}
      <div className="p-2 flex flex-col gap-1">
        {data.columns.map((col, index) => (
          <div 
            key={col.id} 
            className={`
                relative group flex items-center gap-2 p-1.5 rounded transition-all duration-200
                ${col.isPrimaryKey ? 'bg-yellow-50/50' : 'hover:bg-slate-50'}
            `}
          >
            {/* Target Handle (Left) - Larger touch area for mobile */}
            <Handle
              type="target"
              position={Position.Left}
              id={`target-${col.id}`}
              className={`
                !w-3 !h-3 !bg-slate-800 !border-2 !border-white !rounded-full 
                !-left-[6px] top-1/2 -translate-y-1/2
                transition-all duration-200 z-10
                ${isTarget ? '!opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'}
              `}
            />
            
            {/* Column Config */}
            <div className="flex items-center gap-1 min-w-[16px]">
                <button 
                    onClick={() => updateColumn(id, col.id, { isPrimaryKey: !col.isPrimaryKey })}
                    className={`transition-colors flex items-center justify-center ${col.isPrimaryKey ? 'text-yellow-600' : 'text-slate-300 hover:text-slate-400'}`}
                    title="Toggle Primary Key"
                >
                    <div className={`w-1.5 h-1.5 rounded-full ${col.isPrimaryKey ? 'bg-yellow-400' : 'bg-transparent'}`}></div>
                </button>
            </div>

            {/* Key Indicators Labels */}
            {col.isPrimaryKey && <span className="text-[9px] font-bold text-yellow-700 bg-yellow-100 px-1 rounded select-none">PK</span>}
            {col.isForeignKey && <span className="text-[9px] font-bold text-green-700 bg-green-100 px-1 rounded select-none">FK</span>}

            <input
                className={`bg-transparent w-full outline-none text-xs font-medium transition-colors ${col.isPrimaryKey ? 'text-slate-900 font-bold' : 'text-slate-600'}`}
                value={col.name}
                onChange={(e) => updateColumn(id, col.id, { name: e.target.value })}
                placeholder="col_name"
            />

            <select
                className="bg-transparent text-slate-400 text-[10px] uppercase font-mono outline-none cursor-pointer hover:text-primary-600 text-right w-24"
                value={col.type}
                onChange={(e) => updateColumn(id, col.id, { type: e.target.value as any })}
            >
                <optgroup label="Numeric">
                    <option value="INT">INT</option>
                    <option value="BIGINT">BIGINT</option>
                    <option value="SMALLINT">SMALLINT</option>
                    <option value="TINYINT">TINYINT</option>
                    <option value="SERIAL">SERIAL</option>
                    <option value="DECIMAL">DECIMAL</option>
                    <option value="NUMERIC">NUMERIC</option>
                    <option value="FLOAT">FLOAT</option>
                    <option value="DOUBLE">DOUBLE</option>
                    <option value="REAL">REAL</option>
                </optgroup>
                <optgroup label="String">
                    <option value="VARCHAR">VARCHAR</option>
                    <option value="CHAR">CHAR</option>
                    <option value="TEXT">TEXT</option>
                    <option value="MEDIUMTEXT">MEDIUMTEXT</option>
                    <option value="LONGTEXT">LONGTEXT</option>
                </optgroup>
                <optgroup label="Date/Time">
                    <option value="TIMESTAMP">TIMESTAMP</option>
                    <option value="DATETIME">DATETIME</option>
                    <option value="DATE">DATE</option>
                    <option value="TIME">TIME</option>
                    <option value="YEAR">YEAR</option>
                </optgroup>
                <optgroup label="Boolean">
                    <option value="BOOLEAN">BOOLEAN</option>
                </optgroup>
                <optgroup label="Binary">
                    <option value="BLOB">BLOB</option>
                    <option value="BYTEA">BYTEA</option>
                    <option value="BINARY">BINARY</option>
                </optgroup>
                <optgroup label="Advanced">
                    <option value="UUID">UUID</option>
                    <option value="JSON">JSON</option>
                    <option value="JSONB">JSONB</option>
                    <option value="XML">XML</option>
                    <option value="ENUM">ENUM</option>
                    <option value="INET">INET</option>
                    <option value="GEOMETRY">GEOMETRY</option>
                </optgroup>
            </select>

            <button 
                onClick={() => removeColumn(id, col.id)}
                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-slate-300 hover:text-red-500 p-0.5 rounded transition-all"
                title="Remove Column"
            >
                <Trash2 size={12} />
            </button>

            {/* Source Handle (Right) - Larger touch area for mobile */}
            <Handle
              type="source"
              position={Position.Right}
              id={`source-${col.id}`}
              className={`
                !w-3 !h-3 !bg-slate-800 !border-2 !border-white !rounded-full 
                !-right-[6px] top-1/2 -translate-y-1/2
                transition-all duration-200 z-10
                ${isConnecting ? '!opacity-0' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'}
              `}
            />
          </div>
        ))}
      </div>
      
      {data.columns.length === 0 && (
          <div className="p-4 text-center text-slate-400 italic text-xs">
              No columns
          </div>
      )}
    </div>
  );
};

export default memo(TableNode);