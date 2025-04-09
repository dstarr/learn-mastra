import { UUID } from "crypto";

// Types and schemas
export interface TodoItem {
    id: UUID;
    text: string;
    completed: boolean;
    createdAt: Date;
}
