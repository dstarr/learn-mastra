import { MCPConfiguration } from "@mastra/mcp";
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
 
const mcp = new MCPConfiguration({
  servers: {
    // The following is a docker command to run the GitHub MCP server
    github: {
        command: "docker",
        args: [
          "run",
          "-i",
          "--rm",
          "-e",
          "GITHUB_PERSONAL_ACCESS_TOKEN",
          "ghcr.io/github/github-mcp-server"
        ],
        env: {
          GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN || "",
        }
      }
  },
});
 
// Create an agent with access to all tools
export const githubAgent = new Agent({
  name: "Github Agent Agent",
  instructions: "You have access to all GitHub tools allowing operations on repositories in GitHub.",
  model: openai(process.env.OPENAI_MODEL || "gpt-4o-mini"),
  tools: await mcp.getTools(),
});