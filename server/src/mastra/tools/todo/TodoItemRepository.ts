import { MongoClient } from 'mongodb';
import { ITodoItem } from './ITodoItem';
import { randomUUID } from 'crypto';

export default class TodoItemRepository {

    private client: MongoClient;
    private dbName: string;
    private collectionName: string;
    private connectionString: string;

    constructor() {

        this.connectionString = process.env.AZURE_COSMOS_DB_CS as string
        this.dbName = process.env.AZURE_COSMOS_DB_DATABASE as string;
        this.collectionName = process.env.AZURE_COSMOS_DB_COLLECTION as string;

        this.client = new MongoClient(this.connectionString, {});
    }

    async connect() {

        // Connect to the MongoDB server if not already connected
        const connected = await this.client.db(this.dbName).command({ ping: 1 });
        if (!connected) {
            await this.client.connect();
        }
    }

    async disconnect() {
        await this.client.close();
    }

    private async getCollection() {

        // create the collection if it doesn't exist
        const collections = await this.client.db(this.dbName).listCollections(
            {
                name: this.collectionName
            }).toArray();

        if (collections.length === 0)
            await this.client.db(this.dbName).createCollection(this.collectionName);

        // Get the collection from the database
        return this.client.db(this.dbName).collection<ITodoItem>(this.collectionName);
    }

    async create(text: string): Promise<ITodoItem> {

        const todoItem: ITodoItem = {
            id: randomUUID().toString(),
            text: text,
            completed: false,
            createdAt: new Date()
        };

        const collection = await this.getCollection();
        const result = await collection.insertOne(todoItem);

        if (!result.acknowledged) {
            throw new Error('Failed to create todo item');
        }

        console.log('✅ Todo item created:', result);

        return todoItem;
    }

    async getAll(): Promise<ITodoItem[]> {
        return await (await this.getCollection()).find().toArray();
    }

    async getById(id: string): Promise<ITodoItem | null> {
        return await (await this.getCollection()).findOne({ id: id });
    }

    async update(id: string, ITodoItem: Partial<ITodoItem>): Promise<boolean> {
        const result = await (await this.getCollection()).updateOne(
            { id: id },
            { $set: ITodoItem }
        );
        return result.modifiedCount > 0;
    }

    async delete(id: string): Promise<boolean> {
        const result = await (await this.getCollection()).deleteOne({ id: id });
        return result.deletedCount > 0;
    }
}

export { TodoItemRepository };