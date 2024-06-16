import { BaseChain } from "medpromptjs";


class LlmService extends BaseChain {

  async checkAssertion(expression, context): Promise<boolean> {
    console.log("\nChecking assertion with expression: ", expression);
    console.log("\n and context: ", context);
    return true;
  }

  async checkMention(expression, context): Promise<boolean> {
    return true;
  }

  async checkNegation(expression, context): Promise<boolean> {
    return true;
  }


}

export default LlmService;