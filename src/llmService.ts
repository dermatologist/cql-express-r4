import { BaseChain } from "medpromptjs";


class LlmService extends BaseChain {
  string_expression: string = "";

  async checkAssertion(expression, context): Promise<boolean> {
    const _expression = JSON.parse(expression);
    const _context = JSON.parse(context);
    let _content = ""
    // console.log("\nChecking assertion with expression: ", this.printValues(_expression));
    _context.forEach(element => {
          _content += atob(element.content[0].attachment.data.value);
    });
    // console.log("\n and context: ", _content);
    const _input = {
      "content": _content.replace(/(\r\n|\n|\r)/gm," "),
      "expression": this.printValues(_expression) + ". Today is " + new Date()
    }
    console.log("\n", _input);
    const response = await this.chain(_input);
    console.log("\nResponse: ", response);
    if(response.toLocaleLowerCase().includes("true")) {
      return true;
    }else {
      return false;
    }
  }

  printValues(obj) {
    for (var key in obj) {
        if (typeof obj[key] === "object") {
            this.printValues(obj[key]);
        } else {

              this.string_expression += obj[key] + " ";

        }
    }
    const _eliminate = ["true", "false", "null", "undefined", "String",
      "Number", "Object", "Array", "Boolean", "value", "Type", "Specifier", "Named"]
    _eliminate.forEach(element => {
      this.string_expression = this.string_expression.replace(element, '');
    });
    this.string_expression = this.string_expression.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
    return this.camelToString(this.string_expression);
  }


  camelToString(camelCase) {
    return camelCase.replace(/([A-Z])/g, ' $1')
        .replace(/^./, function(str){ return str.toUpperCase(); });
  }

  async checkMention(expression, context): Promise<boolean> {
    return true;
  }

  async checkNegation(expression, context): Promise<boolean> {
    return true;
  }


}

export default LlmService;