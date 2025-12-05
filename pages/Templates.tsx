import React from 'react';
import { Copy, Database, ArrowRight, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSchemaStore } from '../store';
import { Table, Relationship } from '../types';

const Templates = () => {
  const { loadSchema } = useSchemaStore();
  const navigate = useNavigate();

  const handleUseTemplate = (tables: Table[]) => {
    // 1. Generate Edges based on Foreign Keys
    const edges = generateEdgesFromTables(tables);
    
    // 2. Load into store (auto-layout is triggered by default in loadSchema)
    loadSchema(tables, edges, true);
    
    navigate('/editor');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Schema Templates</h1>
            <p className="text-slate-500 text-lg">Jumpstart your next project with battle-tested database patterns. Fully normalized and ready to export.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <TemplateCard 
                title="E-Commerce Starter" 
                desc="Complete online store schema. Includes Users, Products, Categories, Orders, Order Items, Reviews, and Payments."
                tables={7}
                color="blue"
                onClick={() => handleUseTemplate(ecommerceTemplate)}
            />
            <TemplateCard 
                title="SaaS Subscription" 
                desc="Multi-tenant foundation. Organizations, Members with Roles, Subscription Plans, Invoices, and API Keys."
                tables={6}
                color="purple"
                onClick={() => handleUseTemplate(saasTemplate)}
            />
            <TemplateCard 
                title="Modern Blog / CMS" 
                desc="Content management system. Users, Posts, Categories, Tags (Many-to-Many), Comments, and SEO fields."
                tables={6}
                color="pink"
                onClick={() => handleUseTemplate(blogTemplate)}
            />
            <TemplateCard 
                title="Project Management" 
                desc="Trello/Jira style data model. Workspaces, Projects, Boards, Lists, Tasks, and Assignments."
                tables={8}
                color="green"
                onClick={() => handleUseTemplate(pmTemplate)}
            />
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Helper Logic
// ----------------------------------------------------------------------

const generateEdgesFromTables = (tables: Table[]): Relationship[] => {
    const relationships: Relationship[] = [];

    tables.forEach(sourceTable => {
        sourceTable.columns.forEach(sourceCol => {
            if (sourceCol.isForeignKey && sourceCol.references) {
                const targetTable = tables.find(t => t.name === sourceCol.references!.table);
                if (targetTable) {
                    // Try to find target column, default to PK if not found
                    let targetCol = targetTable.columns.find(c => c.name === sourceCol.references!.column);
                    if (!targetCol) targetCol = targetTable.columns.find(c => c.isPrimaryKey);

                    if (targetCol) {
                         relationships.push({
                            id: `e-${sourceTable.id}-${targetTable.id}-${sourceCol.id}`,
                            source: sourceTable.id,
                            target: targetTable.id,
                            sourceHandle: `source-${sourceCol.id}`,
                            targetHandle: `target-${targetCol.id}`,
                            label: ''
                        });
                    }
                }
            }
        });
    });
    return relationships;
};

const TemplateCard = ({ title, desc, tables, color, onClick }: any) => {
    const colorClasses: any = {
        blue: "border-blue-100 hover:border-blue-300 bg-blue-50/50 hover:shadow-blue-100",
        purple: "border-purple-100 hover:border-purple-300 bg-purple-50/50 hover:shadow-purple-100",
        pink: "border-pink-100 hover:border-pink-300 bg-pink-50/50 hover:shadow-pink-100",
        green: "border-green-100 hover:border-green-300 bg-green-50/50 hover:shadow-green-100",
    };
    
    const iconColors: any = {
        blue: "text-blue-600 bg-blue-100",
        purple: "text-purple-600 bg-purple-100",
        pink: "text-pink-600 bg-pink-100",
        green: "text-green-600 bg-green-100",
    }

    return (
        <button 
            className={`w-full text-left rounded-xl border p-6 transition-all duration-300 group cursor-pointer hover:shadow-lg hover:-translate-y-1 bg-white flex flex-col h-full ${colorClasses[color]}`} 
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${iconColors[color]}`}>
                    <Layout size={24} />
                </div>
                <span className="text-xs font-mono font-semibold text-slate-500 bg-white px-2 py-1 rounded border border-slate-100 whitespace-nowrap">
                    {tables} Tables
                </span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed flex-1">{desc}</p>
            
            <div className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg group-hover:bg-primary-50 group-hover:text-primary-700 group-hover:border-primary-100 transition-colors mt-auto">
                <Copy size={16} /> Use Template
            </div>
        </button>
    );
};

// ----------------------------------------------------------------------
// Template Definitions
// ----------------------------------------------------------------------

const ecommerceTemplate: Table[] = [
    { 
        id: 't1', name: 'users', position: { x: 0, y: 0 }, color: 'blue',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'email', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c3', name: 'password_hash', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c4', name: 'full_name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: true },
            { id: 'c5', name: 'created_at', type: 'TIMESTAMP', isPrimaryKey: false, isForeignKey: false, isNullable: false },
        ] 
    },
    { 
        id: 't2', name: 'products', position: { x: 0, y: 0 }, color: 'green',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'category_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'categories', column: 'id' } },
            { id: 'c3', name: 'name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c4', name: 'slug', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c5', name: 'price', type: 'DECIMAL', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c6', name: 'stock_qty', type: 'INT', isPrimaryKey: false, isForeignKey: false, isNullable: false },
        ] 
    },
    { 
        id: 't3', name: 'categories', position: { x: 0, y: 0 }, color: 'pink',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'parent_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: true, references: { table: 'categories', column: 'id' } },
            { id: 'c3', name: 'name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
        ] 
    },
    { 
        id: 't4', name: 'orders', position: { x: 0, y: 0 }, color: 'yellow',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'user_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'users', column: 'id' } },
            { id: 'c3', name: 'status', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c4', name: 'total', type: 'DECIMAL', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c5', name: 'created_at', type: 'TIMESTAMP', isPrimaryKey: false, isForeignKey: false, isNullable: false },
        ] 
    },
    { 
        id: 't5', name: 'order_items', position: { x: 0, y: 0 }, color: 'yellow',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'order_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'orders', column: 'id' } },
            { id: 'c3', name: 'product_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'products', column: 'id' } },
            { id: 'c4', name: 'quantity', type: 'INT', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c5', name: 'unit_price', type: 'DECIMAL', isPrimaryKey: false, isForeignKey: false, isNullable: false },
        ] 
    },
    { 
        id: 't6', name: 'reviews', position: { x: 0, y: 0 }, color: 'purple',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'user_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'users', column: 'id' } },
            { id: 'c3', name: 'product_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'products', column: 'id' } },
            { id: 'c4', name: 'rating', type: 'INT', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c5', name: 'comment', type: 'TEXT', isPrimaryKey: false, isForeignKey: false, isNullable: true },
        ] 
    },
    { 
        id: 't7', name: 'payments', position: { x: 0, y: 0 }, color: 'white',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'order_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'orders', column: 'id' } },
            { id: 'c3', name: 'amount', type: 'DECIMAL', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c4', name: 'provider', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c5', name: 'status', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
        ] 
    },
];

const saasTemplate: Table[] = [
    { 
        id: 't1', name: 'users', position: { x: 0, y: 0 }, color: 'blue',
        columns: [
            { id: 'c1', name: 'id', type: 'UUID', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'email', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c3', name: 'full_name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: true },
        ] 
    },
    { 
        id: 't2', name: 'organizations', position: { x: 0, y: 0 }, color: 'purple',
        columns: [
            { id: 'c1', name: 'id', type: 'UUID', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c3', name: 'slug', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c4', name: 'owner_id', type: 'UUID', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'users', column: 'id' } },
        ] 
    },
    { 
        id: 't3', name: 'org_members', position: { x: 0, y: 0 }, color: 'purple',
        columns: [
            { id: 'c1', name: 'id', type: 'UUID', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'org_id', type: 'UUID', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'organizations', column: 'id' } },
            { id: 'c3', name: 'user_id', type: 'UUID', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'users', column: 'id' } },
            { id: 'c4', name: 'role', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
        ] 
    },
    { 
        id: 't4', name: 'plans', position: { x: 0, y: 0 }, color: 'green',
        columns: [
            { id: 'c1', name: 'id', type: 'VARCHAR', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c3', name: 'price', type: 'INT', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c4', name: 'limits', type: 'JSONB', isPrimaryKey: false, isForeignKey: false, isNullable: true },
        ] 
    },
    { 
        id: 't5', name: 'subscriptions', position: { x: 0, y: 0 }, color: 'yellow',
        columns: [
            { id: 'c1', name: 'id', type: 'UUID', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'org_id', type: 'UUID', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'organizations', column: 'id' } },
            { id: 'c3', name: 'plan_id', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'plans', column: 'id' } },
            { id: 'c4', name: 'status', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c5', name: 'current_period_end', type: 'TIMESTAMP', isPrimaryKey: false, isForeignKey: false, isNullable: false },
        ] 
    },
    { 
        id: 't6', name: 'invoices', position: { x: 0, y: 0 }, color: 'white',
        columns: [
            { id: 'c1', name: 'id', type: 'VARCHAR', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'org_id', type: 'UUID', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'organizations', column: 'id' } },
            { id: 'c3', name: 'amount', type: 'INT', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c4', name: 'date', type: 'DATE', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c5', name: 'pdf_url', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: true },
        ] 
    },
];

const blogTemplate: Table[] = [
    { 
        id: 't1', name: 'users', position: { x: 0, y: 0 }, color: 'blue',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'username', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c3', name: 'email', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c4', name: 'bio', type: 'TEXT', isPrimaryKey: false, isForeignKey: false, isNullable: true },
        ] 
    },
    { 
        id: 't2', name: 'posts', position: { x: 0, y: 0 }, color: 'pink',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'author_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'users', column: 'id' } },
            { id: 'c3', name: 'title', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c4', name: 'slug', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c5', name: 'content', type: 'LONGTEXT', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c6', name: 'published', type: 'BOOLEAN', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c7', name: 'published_at', type: 'DATETIME', isPrimaryKey: false, isForeignKey: false, isNullable: true },
        ] 
    },
    { 
        id: 't3', name: 'categories', position: { x: 0, y: 0 }, color: 'purple',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c3', name: 'slug', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
        ] 
    },
    { 
        id: 't4', name: 'post_categories', position: { x: 0, y: 0 }, color: 'purple',
        columns: [
            { id: 'c1', name: 'post_id', type: 'INT', isPrimaryKey: true, isForeignKey: true, isNullable: false, references: { table: 'posts', column: 'id' } },
            { id: 'c2', name: 'category_id', type: 'INT', isPrimaryKey: true, isForeignKey: true, isNullable: false, references: { table: 'categories', column: 'id' } },
        ] 
    },
    { 
        id: 't5', name: 'comments', position: { x: 0, y: 0 }, color: 'yellow',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'post_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'posts', column: 'id' } },
            { id: 'c3', name: 'user_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: true, references: { table: 'users', column: 'id' } },
            { id: 'c4', name: 'body', type: 'TEXT', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c5', name: 'created_at', type: 'TIMESTAMP', isPrimaryKey: false, isForeignKey: false, isNullable: false },
        ] 
    },
    { 
        id: 't6', name: 'tags', position: { x: 0, y: 0 }, color: 'white',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
        ] 
    },
];

const pmTemplate: Table[] = [
    { 
        id: 't1', name: 'users', position: { x: 0, y: 0 }, color: 'blue',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c3', name: 'email', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
        ] 
    },
    { 
        id: 't2', name: 'workspaces', position: { x: 0, y: 0 }, color: 'purple',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c3', name: 'owner_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'users', column: 'id' } },
        ] 
    },
    { 
        id: 't3', name: 'workspace_members', position: { x: 0, y: 0 }, color: 'purple',
        columns: [
            { id: 'c1', name: 'workspace_id', type: 'INT', isPrimaryKey: true, isForeignKey: true, isNullable: false, references: { table: 'workspaces', column: 'id' } },
            { id: 'c2', name: 'user_id', type: 'INT', isPrimaryKey: true, isForeignKey: true, isNullable: false, references: { table: 'users', column: 'id' } },
            { id: 'c3', name: 'role', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
        ] 
    },
    { 
        id: 't4', name: 'projects', position: { x: 0, y: 0 }, color: 'green',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'workspace_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'workspaces', column: 'id' } },
            { id: 'c3', name: 'name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c4', name: 'description', type: 'TEXT', isPrimaryKey: false, isForeignKey: false, isNullable: true },
        ] 
    },
    { 
        id: 't5', name: 'boards', position: { x: 0, y: 0 }, color: 'white',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'project_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'projects', column: 'id' } },
            { id: 'c3', name: 'name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
        ] 
    },
    { 
        id: 't6', name: 'lists', position: { x: 0, y: 0 }, color: 'white',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'board_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'boards', column: 'id' } },
            { id: 'c3', name: 'name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c4', name: 'position', type: 'FLOAT', isPrimaryKey: false, isForeignKey: false, isNullable: false },
        ] 
    },
    { 
        id: 't7', name: 'tasks', position: { x: 0, y: 0 }, color: 'yellow',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'list_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'lists', column: 'id' } },
            { id: 'c3', name: 'title', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
            { id: 'c4', name: 'assignee_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: true, references: { table: 'users', column: 'id' } },
            { id: 'c5', name: 'due_date', type: 'DATETIME', isPrimaryKey: false, isForeignKey: false, isNullable: true },
            { id: 'c6', name: 'priority', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false },
        ] 
    },
    { 
        id: 't8', name: 'comments', position: { x: 0, y: 0 }, color: 'white',
        columns: [
            { id: 'c1', name: 'id', type: 'INT', isPrimaryKey: true, isForeignKey: false, isNullable: false },
            { id: 'c2', name: 'task_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'tasks', column: 'id' } },
            { id: 'c3', name: 'user_id', type: 'INT', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'users', column: 'id' } },
            { id: 'c4', name: 'content', type: 'TEXT', isPrimaryKey: false, isForeignKey: false, isNullable: false },
        ] 
    },
];

export default Templates;