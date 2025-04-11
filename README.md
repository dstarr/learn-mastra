# AI-driven Todo list with Mastra.ai

A small utility application demonstrating core functionality of the Mastra.ai TypeScript framework working with OpenAI. 

This application enables CRUD operations on a todo list held in a MongoDB and surfaced through AI agents, tools, and workflows.

The only model provider supported at this time is OpenAI.

## Getting started with the server

1. Clone repo and cd into the `server` directory
2. Run `npm install`
3. Create a `.env` file in the `server` directory and add the following environmental variables.
   
    ```bash
    # Azure Cosmos DB settings - Cosmos deployed as MongoDB
    AZURE_COSMOS_DB_CS=YOUR_CONNECTION_STRING
    AZURE_COSMOS_DB_DATABASE=YOUR_DATABASE_NAME # 
    AZURE_COSMOS_DB_COLLECTION=YOUR_COLLECTION_NAME

    # Open AI settings
    OPENAI_API_KEY=YOUR_OPENAI_KEY
    OPENAI_MODEL=THE_OPENAI_MODEL_NAME
    ```

4. Run `npm run dev`

## The client

The client application is underdevelopment and you can just ignore it for now.