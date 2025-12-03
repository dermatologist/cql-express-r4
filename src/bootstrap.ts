import "reflect-metadata";
import { container } from "tsyringe";
import { Ollama } from "@langchain/community/llms/ollama";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { DynamicTool, DynamicStructuredTool } from "@langchain/core/tools";

const bootstrap = async () => {
  // Define any llm here

  const ollama = new Ollama({
    baseUrl: "http://localhost:11434",
    model: "phi3:mini",
  });

  const google = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    maxOutputTokens: 512,
    apiKey: process.env.GOOGLE_API_KEY,
  });

  const tools = [];

  container.register("main-llm", {
    useValue: google,
  });

  container.register("chat_model", {
    useValue: true,
  });

  container.register("tools", {
    useValue: tools,
  });

  container.register("baseChain_prompt", {
    useValue: "",
  });

  // The LitL pipeline is in medpromptjs package https://github.com/dermatologist/medpromptjs/blob/develop/src/llm_loop.ts
  // The default prompts can be altered here by registering a value for 'litl_mapquery_template', 'litl_mapdoc_template' and 'litl_reduce_chain_template'.

  return container;
};

export default bootstrap;
