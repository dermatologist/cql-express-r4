// src/index.ts
import express, { Express, Request, Response } from "express";
import http from "http";
import dotenv from "dotenv";
import cql from "cql-execution";
import cqlfhir from "cql-exec-fhir";
import cqlvsac from "cql-exec-vsac";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import LlmService from "./llmService";
import bootstrap from "./bootstrap";
/*
 * Load up and parse configuration details from
 * the `.env` file to the `process.env`
 * object of Node.js
 */
dotenv.config();

/*
 * Create an Express application and get the
 * value of the PORT environment variable
 * from the `process.env`
 */
const app: Express = express();
const port = process.env.PORT || 3000;

// create application/json parser
var jsonParser = bodyParser.json();

/* Define a route for the root path ("/")
 using the HTTP GET method */
app.get("/", (req: Request, res: Response) => {
  // res.send(
  //   "CQL Execution Service is running! Post to this URL with fhirBundles, cqlJson and fhirBaseUrl (for terminology) as params."
  // );
  // send an html page with a form to submit fhirBundles, cqlJson and fhirBaseUrl
  res.send(`
    <html>
      <head>
        <title>CQL Execution Service</title>
      </head>
      <body>
        <h1>CQL Execution Service</h1>
        <form action="/" method="post">
          <label for="fhirBundles">FHIR Bundles:</label><br>
          <textarea id="fhirBundles" name="fhirBundles" rows="4" cols="50"></textarea><br>
          <label for="cqlJson">CQL JSON:</label><br>
          <textarea id="cqlJson" name="cqlJson" rows="4" cols="50"></textarea><br>
          <label for="fhirBaseUrl">FHIR Base URL:</label><br>
          <input type="text" id="fhirBaseUrl" name="fhirBaseUrl"><br><br>
          <input type="submit" value="Submit">
        </form>
      </body>
    </html>
  `);
});

// handle form submission

app.use(express.urlencoded({ extended: true }));

app.post("/", jsonParser, async (req: Request, res: Response) => {
  const umlsKey = process.env.UMLS_API_KEY || "";
  let fhirBundles = req.body.fhirBundles;
  let cqlJson = req.body.cqlJson;
  let fhirBaseUrl = req.body.fhirBaseUrl || "";
  // if fhirBundles is a string, parse it as JSON
  try {
    fhirBundles = JSON.parse(fhirBundles);
    cqlJson = JSON.parse(cqlJson);
    fhirBaseUrl = JSON.parse(fhirBaseUrl);
  } catch (error) {
    // return res.status(400).send("Invalid FHIR Bundles JSON format.");
  }

  const elmFile = cqlJson;
  const libraries = {
    FHIRHelpers: JSON.parse(fs.readFileSync("src/FHIRHelpers.json", "utf8")),
  };
  const library = new cql.Library(elmFile, new cql.Repository(libraries));

  const llmService = await new LlmService(await bootstrap());
  // Create the patient source
  let patientSource = cqlfhir.PatientSource.FHIRv401();
  patientSource.loadBundles(fhirBundles);
  // Extract the value sets from the ELM
  let valueSets = [];
  if (
    elmFile.library &&
    elmFile.library.valueSets &&
    elmFile.library.valueSets.def
  ) {
    valueSets = elmFile.library.valueSets.def;
  }

  // Set up the code service, loading from the cache if it exists
  const codeService = new cqlvsac.CodeService(
    path.join(__dirname, "vsac_cache"),
    true
  );
  // Ensure value sets, downloading any missing value sets
  codeService
    .ensureValueSetsWithAPIKey(valueSets, umlsKey, fhirBaseUrl)
    .then(() => {
      // Value sets are loaded, so execute!
      const executor = new cql.Executor(
        library,
        codeService,
        undefined,
        undefined,
        llmService
      );
      executor
        .exec(patientSource)
        .then((results) => {
          res.send(results);
          // console.log(results);
        })
        .catch((err) => {
          res.send(err);
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
const server = http.createServer(app);
// Set the timeout to 5 minutes (300000 milliseconds)
server.timeout = 300000;
server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
