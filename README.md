# CQL Express R4

## About
CQL is a domain-specific language that allows clinicians and researchers to express queries and retrieve data from electronic health records (EHRs) in a standardized and interoperable way. CQL supports the use of terminology services, which are external services that provide mappings and translations between different code systems and value sets.

One limitation of FHIRPath-based CQL execution is that it cannot handle assertions in the FHIR DocumentReference resource. I have forked the nodejs CQL execution engine to add a hook that can call an LLM when it encounters a DocumentReference [here](https://github.com/dermatologist/cql-execution).

This is an simple express server example of how to use the LLM hook to execute CQL that contains assertions in the DocumentReference resource. See related projects for more details.

## Related projects
* [cql-execution](https://github.com/dermatologist/cql-execution)
* [cql-exec-vsac](https://github.com/dermatologist/cql-exec-vsac)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/): Ensure that Node.js, preferably version 16 or higher, is installed on your system, as this project utilizes the latest versions of TypeScript and Nodemon.
- [npm](https://www.npmjs.com/): npm is the package manager for Node.js and comes with the Node.js installation.

## Installation

Clone the repository to your local machine:

```
git clone https://github.com/dermatologist/cql-express-r4.git
```

Navigate to the project directory:

```
cd cql-express-r4/
```

Install the project dependencies including TypeScript and Nodemon:

```
npm i
```

## Usage

LLM APIs and hyperparameters are defined in the `src/bootstrap.ts` file. You can modify the code to suit your requirements.
For development purposes, you can run the application using Nodemon to automatically restart the server when changes are detected. Execute the following command:

```
npm run dev
```

This will start the server at `http://localhost:3000` by default. You can change the port in the `src/index.ts` file or create an `.env` file to manage the environt-specific variables separately.

For production, you can build the TypeScript files and then start the server. Run the following commands:

```
npm run build
npm start
```

## Project Structure

The project structure is organized as follows:

- `src`: Contains TypeScript source files
    - `index.ts`: Configures and starts the Express application
- `dist`: Output directory created during build for compiled TypeScript files
- `package.json`: Project configuration and dependencies
- `tsconfig.json`: TypeScript configuration

You can customize the project configuration i nthe `tsconfig.json` file and adjust the server settings in the `src/index.ts` file.

## Give us a star ⭐️
If you find this project useful, give us a star. It helps others discover the project.

## Contributors

* [Bell Eapen](https://nuchange.ca) | [![Twitter Follow](https://img.shields.io/twitter/follow/beapen?style=social)](https://twitter.com/beapen)
