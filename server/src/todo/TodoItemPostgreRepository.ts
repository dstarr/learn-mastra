import pkg, { QueryResult }  from 'pg';
import { ITodoItem } from './ITodoItem';

const Pool = pkg.Pool;

export interface PostgresConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

export type TodoItemPostgresOptions = {
    pool?: pkg.Pool;
    dbConfig?: PostgresConfig;
};

export default class TodoItemPostgreRepository {
    private pool;
    
    private readonly schema: string = 'todos';
    private readonly table: string = 'todo_items';

    constructor(options: TodoItemPostgresOptions = {}) {
        const { pool, dbConfig } = options;

        if (!pool && !dbConfig) {
            throw new Error('Either pool or dbConfig must be provided');
        }
        this.pool = pool ?? new Pool({
            host: dbConfig?.host,
            port: dbConfig?.port,
            user: dbConfig?.user,
            password: dbConfig?.password,
            database: dbConfig?.database,
        });
    }

    async disconnect(): Promise<void> {
        await this.pool.end();
    }

    async create(todo: ITodoItem): Promise<ITodoItem> {
        const query = `INSERT INTO ${this.schema}.${this.table} (id, text, completed, created_at)
                   VALUES ($1, $2, $3, $4) RETURNING id, text, completed, created_at as "createdAt"`;
        const params = [todo.id, todo.text, todo.completed, todo.createdAt];
        const result = await this.pool.query(query, params);
        const row = result.rows[0];
        return { ...row, createdAt: new Date(row.createdAt) } as ITodoItem;
    }

    async getAll(): Promise<ITodoItem[]> {
        const query = `SELECT id, text, completed, created_at as "createdAt" FROM ${this.schema}.${this.table}`;
        const result = await this.pool.query(query);
        return result.rows.map(row => ({ ...row, createdAt: new Date(row.createdAt) }));
    }

    async getById(id: string): Promise<ITodoItem | null> {
        const query = `SELECT id, text, completed, created_at as "createdAt" FROM ${this.schema}.${this.table} WHERE id = $1`;
        const result = await this.pool.query(query, [id]);
        if (result.rowCount === 0) return null;
        const row = result.rows[0];
        return { ...row, createdAt: new Date(row.createdAt) };
    }

    async update(id: string, data: Partial<ITodoItem>): Promise<boolean> {
        const fields: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if (data.text !== undefined) {
            fields.push(`text = $${idx++}`);
            values.push(data.text);
        }
        if (data.completed !== undefined) {
            fields.push(`completed = $${idx++}`);
            values.push(data.completed);
        }
        if (fields.length === 0) return false;

        const query = `UPDATE ${this.schema}.${this.table}
                   SET ${fields.join(', ')}
                   WHERE id = $${idx}`;
        values.push(id);

        const result: QueryResult<any> = await this.pool.query(query, values);
        if (result.rowCount == null) return false;

        return result.rowCount > 0;
    }

    async delete(id: string): Promise<boolean> {
        const query = `DELETE FROM ${this.schema}.${this.table} WHERE id = $1`;
        const result = await this.pool.query(query, [id]);
        if (result.rowCount == null) return false;
        return result.rowCount > 0;
    }
}