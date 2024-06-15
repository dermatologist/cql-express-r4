import { BaseChain } from "medpromptjs";


class LLMService extends BaseChain {

  checkAssertion() {
    return true;
  }

  checkMention() {
    return true;
  }

  checkNegation() {
    return true;
  }


}

export default LLMService;