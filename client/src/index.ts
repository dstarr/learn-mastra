import { MastraClient } from "@mastra/client-js";

const client = new MastraClient({
  baseUrl: "http://localhost:4111", // Default Mastra development server port
});

const agent = client.getAgent("todoAgent");

// Generate responses

const main = async () => {
  const response = await agent.generate({
    messages: [
      {
        role: "user",
        content: "list tasks",
      },
    ],
  });

  console.log(response.text);
};

main();
