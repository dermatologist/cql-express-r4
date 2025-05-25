import "reflect-metadata";
import { container } from "tsyringe";
import { Ollama } from "@langchain/community/llms/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";

import { z } from "zod";
import { DynamicTool, DynamicStructuredTool } from "@langchain/core/tools";

const bootstrap = async () => {

  const ollama = new Ollama({
    baseUrl: "http://localhost:11434",
    model: "phi3",
  });

  // const prompt = await pull<ChatPromptTemplate>(
  //     "hwchase17/structured-chat-agent"
  // );

  const prompt = ChatPromptTemplate.fromTemplate(
    `
        Knowing:
        A year has 365 days and a month has 30 days.
        If it is less than a given period, then it is within the period.

        Given the following content:
        {content}

        Is the following expression true or false:
        {expression}

        Answer should begin with true or false. Then give a reason why.`
  );
  const tools = [
    new DynamicTool({
      name: "FOO",
      description:
        "call this to get the value of foo. input should be an empty string.",
      func: async () => "baz",
    }),
    new DynamicStructuredTool({
      name: "random-number-generator",
      description: "generates a random number between two input numbers",
      schema: z.object({
        low: z.number().describe("The lower bound of the generated number"),
        high: z.number().describe("The upper bound of the generated number"),
      }),
      func: async ({ low, high }) =>
        (Math.random() * (high - low) + low).toString(), // Outputs still must be strings
    }),
  ];

  container.register("main-llm", {
    useValue: ollama,
  });
  container.register("tools", {
    useValue: tools,
  });
  container.register("prompt", {
    useValue: prompt,
  });

  return container;
};

export default bootstrap;
