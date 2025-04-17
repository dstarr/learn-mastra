/**
 * ITodoItem interface
 */
export interface ITodoItem {  
    _id?: string; // Optional, for CosmosDB compatibility
    id: string;
    text: string;
    completed: boolean;
    createdAt: Date;
}
