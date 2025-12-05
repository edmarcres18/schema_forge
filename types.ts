export type DataType = 
  // Integers
  | 'INT' | 'INTEGER' | 'BIGINT' | 'SMALLINT' | 'TINYINT' | 'SERIAL' | 'BIGSERIAL'
  // Decimals/Floats
  | 'DECIMAL' | 'NUMERIC' | 'FLOAT' | 'DOUBLE' | 'REAL' | 'MONEY'
  // Strings
  | 'VARCHAR' | 'CHAR' | 'TEXT' | 'MEDIUMTEXT' | 'LONGTEXT'
  // Date/Time
  | 'DATE' | 'DATETIME' | 'TIMESTAMP' | 'TIME' | 'YEAR' | 'INTERVAL'
  // Boolean
  | 'BOOLEAN'
  // Binary
  | 'BLOB' | 'BINARY' | 'VARBINARY' | 'BYTEA'
  // Advanced
  | 'JSON' | 'JSONB' | 'UUID' | 'XML' | 'ENUM' | 'INET' | 'CIDR' | 'MACADDR' | 'BIT' | 'GEOMETRY';

export interface Column {
  id: string;
  name: string;
  type: DataType;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isNullable: boolean;
  references?: {
    table: string;
    column: string;
  };
}

export type TableColor = 'blue' | 'white' | 'yellow' | 'red' | 'green' | 'purple' | 'pink';

export interface Table {
  id: string;
  name: string;
  columns: Column[];
  position: { x: number; y: number };
  color?: TableColor;
  description?: string;
}

export interface Relationship {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

export interface Project {
  id: string;
  name: string;
  tables: Table[];
  relationships: Relationship[];
  lastModified: number;
  user_id?: string;
}

export interface UserProfile {
  id: string;
  email: string;
}

export interface Cursor {
  x: number;
  y: number;
  userId: string;
  color: string;
  userName: string;
}

export type DatabaseDialect = 'PostgreSQL' | 'MySQL' | 'SQLite' | 'SQL Server';

export interface SchemaIssue {
    id: string;
    type: 'error' | 'warning' | 'info';
    title: string;
    description: string;
    tableId?: string;
}