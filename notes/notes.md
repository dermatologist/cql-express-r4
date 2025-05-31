# Notes

## Resources

* https://www.antvaset.com/cql-to-elm-converter
* https://github.com/cqframework/clinical_quality_language/blob/master/Src/java/cql-to-elm/OVERVIEW.md

## Todo
* Create a springboot project with the above
* Create a docker-compose for the entire stack

## CQL Library on FHIR server
A CQL (Clinical Quality Language) library on an FHIR server is a way to store and manage the logic for clinical quality measures, decision support rules, and other computable knowledge artifacts. The CQL library is a FHIR Library resource, which can contain the CQL source code as an attachment. FHIR servers, like the HAPI FHIR server, are designed to support the evaluation of CQL libraries and their interaction with FHIR data.

## FHIR Measure
Use this tool to evaluate CQL-based clinical quality measures against test patient data. The tool outputs a FHIR MeasureReport resource with the calculated measure score.