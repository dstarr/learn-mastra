import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.development file
dotenv.config();

// Define the required environment variables as an enum
enum RequiredEnvVars {
    MONGODB_CS = 'MONGODB_CS',
    MONGODB_DATABASE = 'MONGODB_DATABASE',
    MONGODB_COLLECTION = 'MONGODB_COLLECTION',

    GITHUB_TOKEN = 'GITHUB_TOKEN',
    
    OPENAI_API_KEY = 'OPENAI_API_KEY',
    OPENAI_MODEL = 'OPENAI_MODEL',
    
    POSTGRES_HOST = 'POSTGRES_HOST',
    POSTGRES_PORT = 'POSTGRES_PORT',
    POSTGRES_USER = 'POSTGRES_USER',
    POSTGRES_PASSWORD = 'POSTGRES_PASSWORD',
    POSTGRES_DB = 'POSTGRES_DB',
}

// Validate required environment variables
const missingVars: string[] = [];

// Use Object.values to iterate through enum values
Object.values(RequiredEnvVars).forEach(varName => {
    if (!process.env[varName]) {
        missingVars.push(varName);
    }
});

// Throw error if any required variables are missing
if (missingVars.length > 0) {
    throw new Error(
        `Missing required environment variables in .env.development file: ${missingVars.join(', ')}`
    );
}

// Create and export the config object with all validated environment variables
// Define the type for the config object
interface Config {
    Mongo: {
        connectionString: string;
        databaseName: string;
        collectionName: string;
    };
    GitHub: {
        token: string;
    };
    OpenAI: {
        apiKey: string;
        model: string;
    };
    Postgres: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
    };
}

const config: Config = {

    Mongo: {
        connectionString: process.env.MONGODB_CS as string,
        databaseName: process.env.MONGODB_DATABASE as string,
        collectionName: process.env.MONGODB_COLLECTION as string,
    },
    GitHub: {
        token: process.env.GITHUB_TOKEN as string,
    },
    OpenAI: {
        apiKey: process.env.OPENAI_API_KEY as string,
        model: process.env.OPENAI_MODEL as string,
    },
    Postgres: {
        host: process.env.POSTGRES_HOST as string,
        port: parseInt(process.env.POSTGRES_PORT as string, 10),
        user: process.env.POSTGRES_USER as string,
        password: process.env.POSTGRES_PASSWORD as string,
        database: process.env.POSTGRES_DB as string,
    }
};

export default config;
