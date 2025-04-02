import { z } from "zod";

export const inputSchema = z.object({
  location: z.string().describe("City name"),
});

export const outputSchema = z.object({
  temperature: z.number(),
  feelsLike: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  windGust: z.number(),
});
