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
      "content": this.findDatesAndConvertToTimeElapsed(_content.replace(/(\r\n|\n|\r)/gm," ")),
      "expression": this.printValues(_expression)
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


  findDatesAndConvertToTimeElapsed(text){
    // Regular expression to match dates in format of 'mm/dd/yyyy' or 'mm-dd-yyyy'
    const dateRegex = /(\d{1,2}[-/]\d{1,2}[-/]\d{4})/g;
    let matches;
    let currentDate = new Date();

    while (( matches = dateRegex.exec(text) ) !== null) {
      let date = new Date(matches[0]);
      let timeElapsed = (currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      text = text.replace(matches[0], Math.floor(timeElapsed));
      text += " days ago.";
    }

    console.log(text);
    return text;
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