import { App } from "aws-cdk-lib";
import { DataStack } from "../stacks/Data.stack";

/* cdk instance to initialize our application & business logics */
const app = new App();

// stacks belong to the current cdk app
new DataStack(app, "DataStack");
