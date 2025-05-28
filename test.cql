// NOTE:  This is a simplified example, designed only for the purpose of demonstrating how to
// use the cql-execution, cql-exec-fhir, and cql-exec-vsac javascript modules.  This CQL
// is NOT clinically validated and should NOT be used in a clinical setting.

library DiabeticFootExam version '1.0.0'
using FHIR version '4.0.1'
include FHIRHelpers version '4.0.1' called FHIRHelpers

// Value set and codes loosely borrowed from CMS 123v7
codesystem "SNOMEDCT": 'http://snomed.info/sct'
codesystem "CONDITION-VER-STATUS": 'http://terminology.hl7.org/CodeSystem/condition-ver-status'
valueset "Diabetes": '1'
code "Confirmed code": 'confirmed' from "CONDITION-VER-STATUS" display 'Confirmed'
concept "Confirmed": { "Confirmed code" } display 'Confirmed'

context Patient

define InDemographic:
  AgeInYears() between 18 and 75

define HasDiabetes:
  exists(
    [Condition: "Diabetes"] C
      where C.verificationStatus ~ "Confirmed"
  )

define HasDocumentedSignsOfInfection:
  exists(
    [DocumentReference] D
      // Adjusted: compare to a string or code, not a concept
      where D.content[0].attachment.data = 'Visual foot exam showed active infection?'
  )

define IsDiabeticWithInfection:
  InDemographic and
  HasDiabetes and
  HasDocumentedSignsOfInfection

