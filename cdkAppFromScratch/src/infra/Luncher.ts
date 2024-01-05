import { App } from "aws-cdk-lib";
import { DataStack } from "../stacks/DataStack";
import { LambdaStack } from "../stacks/LambdaStack";
import { ApiStack } from "../stacks/ApiStack";
import { AuthStack } from "../stacks/AuthStack";

/* cdk instance to initialize our application & business logics */
const app = new App();

// Stacks belong to the current cdk app
const dataStack = new DataStack(app, "DataStack");

// lambda stack
const lambdaStack = new LambdaStack(app, "LambdaStack", {
  spacesTable: dataStack.spacesTable,
});

// auth stack
const authStack = new AuthStack(app, "AuthStack");

// Using API Gateway provides users with a secure HTTP endpoint to invoke your Lambda function
// Config to link API Gateway stack to our lambda stack above
new ApiStack(app, "ApiStack", {
  spacesLambdaIntegration: lambdaStack.spacesLambdaIntegration,
  userPool: authStack.userPool,
});
