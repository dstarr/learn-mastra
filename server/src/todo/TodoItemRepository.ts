import { MongoClient } from 'mongodb';
import { ITodoItem } from './ITodoItem';

/**
 * TodoItemRepository class for managing todo items in a MongoDB database.
 * 
 * This class provides methods to connect to the database, create, retrieve, update, and delete todo items.
 * It uses the MongoDB Node.js driver to interact with the database.
 */
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

    
    /**
     * Establishes a connection to the database.
     * 
     * This method checks if the database client is already connected by sending a ping command.
     * If the client is not connected, it attempts to establish a new connection.
     * 
     * @throws {Error} Throws an error if the connection attempt fails.
     * @returns {Promise<void>} Resolves when the connection is successfully established.
     */
    async connect() {

        const connected = await this.client.db(this.dbName).command({ ping: 1 });
        if (!connected) {
            await this.client.connect();
        }
    }

    /**
     * Disconnects the database client if it is currently connected.
     * 
     * This method checks the connection status by sending a ping command
     * to the database. If the client is connected, it closes the connection.
     * 
     * @throws {Error} If there is an issue with the database connection or closing the client.
     */
    async disconnect() {
        const connected = await this.client.db(this.dbName).command({ ping: 1 });
        if (connected) {
            await this.client.close();
        }
    }

    /**
     * Retrieves the collection from the database. If the collection does not exist, it creates one.
     * 
     * @returns {Promise<Collection<ITodoItem>>} The MongoDB collection for ITodoItem.
     * @throws {Error} If there is an issue with the database connection or collection retrieval.
     */
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

    /**
     * Creates a new todo item in the database.
     * 
     * @param {ITodoItem} todoItem - The todo item to be created.
     * @returns {Promise<ITodoItem>} The created todo item.
     * @throws {Error} If the creation operation fails.
     */
    async create(todoItem: ITodoItem): Promise<ITodoItem> {

        const collection = await this.getCollection();
        const result = await collection.insertOne(todoItem);

        if (!result.acknowledged) {
            throw new Error('Failed to create todo item');
        }

        console.log('✅ Todo item created:', result);

        return todoItem;
    }

    /**
     * Retrieves all todo items from the database.
     * 
     * @returns {Promise<ITodoItem[]>} An array of todo items.
     * @throws {Error} If there is an issue with the database connection or retrieval.
     */
    async getAll(): Promise<ITodoItem[]> {
        return await (await this.getCollection()).find().toArray();
    }

    /**
     * Retrieves a Todo item by its unique identifier.
     *
     * @param id - The unique identifier of the Todo item to retrieve.
     * @returns A promise that resolves to the Todo item if found, or `null` if no item with the given ID exists.
     */
    async getById(id: string): Promise<ITodoItem | null> {
        return await (await this.getCollection()).findOne({ id: id });
    }

    /**
     * Updates a Todo item in the database.
     *
     * @param id - The unique identifier of the Todo item to update.
     * @param ITodoItem - The updated Todo item data.
     * @returns A promise that resolves to `true` if the update was successful, or `false` otherwise.
     */
    async update(id: string, ITodoItem: Partial<ITodoItem>): Promise<boolean> {
        const result = await (await this.getCollection()).updateOne(
            { id: id },
            { $set: ITodoItem }
        );
        return result.modifiedCount > 0;
    }

    /**
     * Deletes a Todo item from the database.
     *
     * @param id - The unique identifier of the Todo item to delete.
     * @returns A promise that resolves to `true` if the deletion was successful, or `false` otherwise.
     */
    async delete(id: string): Promise<boolean> {
        const result = await (await this.getCollection()).deleteOne({ id: id });
        return result.deletedCount > 0;
    }
}

export { TodoItemRepository };