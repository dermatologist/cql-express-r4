import { LLMLoop } from "medpromptjs";



export default class LlmService extends LLMLoop {
  _mapQueryTemplate: string = `
    You are an assistant that can convert statements to a natural language query as in the example below.\n


    Statements: Visual foot exam in the last month. Visual foot exam showed active infection.
    query: Did the patient have a visual foot exam in the last month? Is there any evidence of active infection?
    Statements: {expression}
    query: `;

  _mapDocTemplate: string = `
    You will be given a document and few statements.\n
    Extract facts from the document that are relevant to the statements.\n
    Do not include any irrelevant information or context.\n


    Example:\n
    document: The patient is a 45-year-old male with a history of hypertension. He presented with chest pain and was diagnosed with myocardial infarction. He was treated with aspirin and beta-blockers.\n
    statements: diagnosis of myocardial infarction. currently on beta-blockers.\n
    facts: The patient was diagnosed with myocardial infarction and is currently on beta-blockers.\n
    document: {document} \n
    statements: {statements}\n
    facts: `;

  _reduceChainTemplate: string = `
    Say yes if the facts mentions all aspects of the query, else say no.\n

    Example:
    facts: Patient had a laproscopy 27 days back. The findings were normal. \n
    query: Did the patient have a laproscopy this month?\n
    answer: YES. The patient had a laproscopy 27 days back.\n
    facts: The patient is a diabetic and hypertensive. He is on metformin and amlodipine. \n
    query: Is the patient on heparin and metformin?\n
    answer: NO. The patient is on heparin but not on metformin.\n
    facts: A visual foot examination was performed 26 days ago to assess skin integrity, circulation, and structural abnormalities. The exam revealed normal skin condition, nail health, circulation, and absence of edema and deformities. However, there were signs of an active infection with erythema and swelling. \n
    query: Did the patient have a visual foot exam in the last month? Is there any evidence of active infection?\n
    answer: YES. The patient had a visual foot exam in the last month and there is evidence of active infection.\n
    facts: A visual foot examination was performed 126 days ago to assess skin integrity, circulation, and structural abnormalities. The exam revealed normal skin condition, nail health, circulation, and absence of edema and deformities. However, there were signs of an active infection with erythema and swelling. \n
    query: Did the patient have a visual foot exam in the last month? Is there any evidence of active infection?\n
    answer: NO. The patient did not have a visual foot exam in the last month but there is evidence of active infection.\n
    facts: {facts} \n
    query: {query}\n
    answer: `;
}

