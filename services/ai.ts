import { GoogleGenAI, Type } from "@google/genai";
import { Table, Column, Relationship, SchemaIssue } from '../types';
import { useSchemaStore } from '../store';

// Uses the environment variable provided during build/deployment for Guest usage
const SYSTEM_API_KEY = process.env.API_KEY || ""; 

// Helper to determine which key to use and enforce limits
const getClient = async () => {
  const store = useSchemaStore.getState();
  const userKey = store.apiKey;
  
  // 1. If user has their own key, use it.
  if (userKey) {
      return new GoogleGenAI({ apiKey: userKey });
  }

  // 2. If no user key, check if System Key is configured and Guest Limit is respected
  if (SYSTEM_API_KEY) {
      const allowed = await store.checkGuestUsage();
      if (allowed) {
          return new GoogleGenAI({ apiKey: SYSTEM_API_KEY });
      } else {
          throw new Error("LIMIT_REACHED");
      }
  }

  // 3. No keys available at all (System not configured by dev, and user hasn't added one)
  throw new Error("API_KEY_MISSING");
};

// Hook to increment usage after successful call
const trackUsage = async () => {
    const store = useSchemaStore.getState();
    // Only increment if we are using the System key (no user key)
    if (!store.apiKey && SYSTEM_API_KEY) {
        await store.incrementGuestUsage();
    }
};

// Reusable schema definition for Table objects
const tableSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        columns: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              type: { type: Type.STRING },
              isPrimaryKey: { type: Type.BOOLEAN },
              isForeignKey: { type: Type.BOOLEAN },
              isNullable: { type: Type.BOOLEAN },
              references: {
                  type: Type.OBJECT,
                  properties: {
                      table: { type: Type.STRING },
                      column: { type: Type.STRING }
                  },
                  nullable: true
              }
            },
            propertyOrdering: ["id", "name", "type", "isPrimaryKey", "isForeignKey", "isNullable", "references"]
          }
        }
      },
      propertyOrdering: ["id", "name", "columns"]
    }
  };

export const generateSchemaFromPrompt = async (prompt: string): Promise<Table[]> => {
  const ai = await getClient();
  
  const systemPrompt = `
    You are a senior database architect. 
    Generate a database schema based on the user's description.
    Output purely JSON data.
    The output should be an array of Table objects.
    Each Table object must have:
    - name: string
    - description: string
    - columns: array of Column objects
    
    Column object must have:
    - name: string
    - type: one of ['INT', 'BIGINT', 'SMALLINT', 'TINYINT', 'DECIMAL', 'NUMERIC', 'FLOAT', 'DOUBLE', 'REAL', 'VARCHAR', 'CHAR', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT', 'BOOLEAN', 'DATE', 'DATETIME', 'TIMESTAMP', 'TIME', 'YEAR', 'BLOB', 'BINARY', 'BYTEA', 'UUID', 'JSON', 'JSONB', 'XML', 'ENUM', 'INET']
    - isPrimaryKey: boolean
    - isForeignKey: boolean
    - isNullable: boolean
    
    Ensure logical relationships are implied by naming conventions (e.g. user_id).
    Do not worry about visual position, just focus on the schema structure.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: tableSchema
      }
    });

    const text = response.text;
    if (!text) return [];
    
    await trackUsage(); // Count usage

    const tables = JSON.parse(text) as Table[];
    return processTables(tables);

  } catch (error) {
    // Pass specific errors up to the UI
    if ((error as Error).message === 'API_KEY_MISSING' || (error as Error).message === 'LIMIT_REACHED') throw error;
    console.error("AI Schema Gen Error:", error);
    throw error;
  }
};

export const parseSqlToSchema = async (sqlContent: string): Promise<{ tables: Table[], relationships: Relationship[] }> => {
    const ai = await getClient();

    const systemPrompt = `
        You are a SQL Parsing Engine. 
        Your task is to analyze the provided SQL (DDL) script and convert it into a JSON structure representing the schema.
        
        Analyze CREATE TABLE and ALTER TABLE statements to extract table names and columns.
        Map SQL types to these generic types: ['INT', 'BIGINT', 'SMALLINT', 'TINYINT', 'DECIMAL', 'NUMERIC', 'FLOAT', 'DOUBLE', 'REAL', 'VARCHAR', 'CHAR', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT', 'BOOLEAN', 'DATE', 'DATETIME', 'TIMESTAMP', 'TIME', 'YEAR', 'BLOB', 'BINARY', 'BYTEA', 'UUID', 'JSON', 'JSONB', 'XML', 'ENUM', 'INET'].
        
        Identify Primary Keys (PK) and Foreign Keys (FK).
        
        If a column is a Foreign Key, YOU MUST populate the "references" object with the target "table" name and target "column" name.
        
        Return ONLY the JSON array of tables. Focus on accurate table structures and relationships. 
        Ignore any visual layout or coordinates; these will be calculated automatically.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Parse this SQL into JSON:\n\n${sqlContent}`,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: tableSchema
            }
        });

        const text = response.text;
        if (!text) return { tables: [], relationships: [] };

        await trackUsage(); // Count usage

        const rawTables = JSON.parse(text) as Table[];
        const tables = processTables(rawTables);
        const relationships = generateRelationships(tables);

        return { tables, relationships };
    } catch (error) {
        if ((error as Error).message === 'API_KEY_MISSING' || (error as Error).message === 'LIMIT_REACHED') throw error;
        console.error("AI SQL Parse Error:", error);
        throw error;
    }
};

export const analyzeSchema = async (tables: Table[], relationships: Relationship[]): Promise<any[]> => {
    const ai = await getClient();
    
    const schemaStr = JSON.stringify(tables.map(t => ({ 
        id: t.id,
        name: t.name, 
        columns: t.columns.map(c => ({ name: c.name, type: c.type, pk: c.isPrimaryKey, fk: c.isForeignKey, nullable: c.isNullable })) 
    })));

    const systemPrompt = `
        You are a Database Expert. Analyze the provided database schema JSON for:
        1. Normalization violations (1NF, 2NF, 3NF).
        2. Missing primary keys.
        3. Poor naming conventions (e.g. uppercase table names, spacing).
        4. Redundant columns.
        5. Missing relationships or foreign keys where implied by naming (e.g. user_id but no FK).
        6. Inappropriate data types (e.g. VARCHAR for dates, using INT for money).

        Return a JSON array of issues. 
        Each issue must have:
        - type: "error" (critical), "warning" (potential issue), or "info" (suggestion).
        - title: Short summary of the issue.
        - description: Detailed explanation and how to fix it.
        - tableName: The name of the table related to the issue (optional).
        - tableId: The id of the table related to the issue (optional).
    `;

    const issuesSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                type: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                tableName: { type: Type.STRING, nullable: true },
                tableId: { type: Type.STRING, nullable: true }
            },
            required: ["type", "title", "description"]
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze this schema for best practices and errors:\n${schemaStr}`,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: issuesSchema
            }
        });

        const text = response.text;
        if (!text) return [];

        await trackUsage(); // Count usage
        return JSON.parse(text);
    } catch (e) {
        if ((e as Error).message === 'API_KEY_MISSING' || (e as Error).message === 'LIMIT_REACHED') return [];
        console.error("AI Analysis Error", e);
        return [];
    }
}

export const fixSchemaIssue = async (tables: Table[], issue: SchemaIssue): Promise<{ tables: Table[], relationships: Relationship[] }> => {
    const ai = await getClient();

    // Simplify tables for prompt but keep IDs to ensure we can merge back correctly
    const schemaContext = JSON.stringify(tables.map(t => ({
        id: t.id,
        name: t.name,
        columns: t.columns.map(c => ({
            id: c.id,
            name: c.name,
            type: c.type,
            isPrimaryKey: c.isPrimaryKey,
            isForeignKey: c.isForeignKey,
            isNullable: c.isNullable,
            references: c.references
        }))
    })));

    const systemPrompt = `
        You are a Database Expert.
        The user has a database schema and an issue to fix.
        
        Issue Title: ${issue.title}
        Issue Description: ${issue.description}
        Affected Table ID: ${issue.tableId || 'N/A'}
        Affected Table Name: ${issue.tableId ? tables.find(t => t.id === issue.tableId)?.name : 'N/A'}

        Task:
        1. Modify the schema to resolve the issue. 
        2. Return the COMPLETE schema as a JSON array of Table objects.
        3. CRITICAL: Preserve the 'id' fields for ALL existing tables and columns. Do not generate new IDs for existing items.
        4. If adding new tables or columns, you can omit the id or generate a new string ID.
        5. Ensure 'references' are correctly set for Foreign Keys.

        Output JSON only.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Current Schema:\n${schemaContext}`,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: tableSchema
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");

        await trackUsage(); // Count usage

        const fixedTablesRaw = JSON.parse(text) as Table[];
        // processTables ensures any new items get IDs, while preserving existing ones
        const fixedTables = processTables(fixedTablesRaw); 
        const relationships = generateRelationships(fixedTables);

        return { tables: fixedTables, relationships };

    } catch (error) {
        if ((error as Error).message === 'API_KEY_MISSING' || (error as Error).message === 'LIMIT_REACHED') throw error;
        console.error("AI Fix Error:", error);
        throw error;
    }
}

// Helper to ensure unique IDs and valid data
const processTables = (tables: Table[]): Table[] => {
    return tables.map((t, idx) => ({
        ...t,
        id: t.id || `table-${idx}-${Date.now()}`,
        // Default position, will be overridden by layout engine or merged with existing
        position: { x: 0, y: 0 },
        columns: t.columns.map((c, cIdx) => ({
            ...c,
            id: c.id || `col-${idx}-${cIdx}-${Date.now()}`
        }))
    }));
}

// Helper to generate relationship edges from table references
const generateRelationships = (tables: Table[]): Relationship[] => {
    const relationships: Relationship[] = [];

    tables.forEach(sourceTable => {
        sourceTable.columns.forEach(sourceCol => {
            if (sourceCol.references && sourceCol.references.table) {
                const targetTable = tables.find(t => t.name.toLowerCase() === sourceCol.references!.table.toLowerCase());
                
                if (targetTable) {
                    // Try to find specific column, otherwise fallback to PK
                    let targetCol = targetTable.columns.find(c => c.name.toLowerCase() === sourceCol.references!.column.toLowerCase());
                    if (!targetCol) {
                        targetCol = targetTable.columns.find(c => c.isPrimaryKey);
                    }

                    if (targetCol) {
                        relationships.push({
                            id: `e-${sourceTable.id}-${targetTable.id}-${Math.random().toString(36).substr(2, 5)}`,
                            source: sourceTable.id, // Child (FK)
                            target: targetTable.id, // Parent (PK)
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
}