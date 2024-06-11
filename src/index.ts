// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cql from "cql-execution";
import cqlfhir from "cql-exec-fhir";
import cqlvsac from "cql-exec-vsac";
import fs from "fs";
import path from "path";
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

/* Define a route for the root path ("/")
 using the HTTP GET method */
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/exec", (req: Request, res: Response) => {
    const umlsKey = process.env.UMLS_API_KEY || "";
    const fhirBundles = req.body.fhirBundles;
    const cqlJson = req.body.cqlJson;
    const fhirBaseUrl = req.body.fhirBaseUrl || "";
    const elmFile = JSON.parse(cqlJson);
    const libraries = {
      FHIRHelpers: JSON.parse(fs.readFileSync("FHIRHelpers.json", "utf8")),
    };
    const library = new cql.Library(elmFile, new cql.Repository(libraries));

    // Create the patient source
    let patientSource = cqlfhir.PatientSource.FHIRv401();
    patientSource.loadBundles(fhirBundles);
      // Extract the value sets from the ELM
  let valueSets = [];
  if (elmFile.library && elmFile.library.valueSets && elmFile.library.valueSets.def) {
    valueSets = elmFile.library.valueSets.def;
  }

  // Set up the code service, loading from the cache if it exists
  const codeService = new cqlvsac.CodeService(path.join(__dirname, 'vsac_cache'), true);
  // Ensure value sets, downloading any missing value sets
  codeService.ensureValueSetsWithAPIKey(valueSets, umlsKey, fhirBaseUrl)
    .then(() => {

      // Value sets are loaded, so execute!
      const executor = new cql.Executor(library, codeService);
      executor.exec(patientSource).then((results) => {
        res.send(results);
      }).catch((err) => {
        console.log(err);
      }
      );
    });
  res.send("Error");
});
/* Start the Express app and listen
 for incoming requests on the specified port */
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
