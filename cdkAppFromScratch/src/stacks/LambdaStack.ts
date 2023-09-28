import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Code, Function as LambdaFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { join } from "path";

interface LambdaStackProps extends StackProps {
  spacesTable: ITable;
}

// stack to deploy lambda function using cdk
export class LambdaStack extends Stack {
  public readonly helloLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    // Lambda is a serverless computation (no server) where our function code runs in response to events
    // and automatically manages resource scaling for us. eg.direct api query to database without server
    // This lambda fn belongs to the this stack.
    const helloLambda = new LambdaFunction(this, "HelloLambda", {
      runtime: Runtime.NODEJS_18_X,

      // code that will be executed inside of lambda in services/hello.js
      handler: "hello.main",

      // how to execute lambda code & specify path to our code
      code: Code.fromAsset(join(__dirname, "..", "services")),

      // note: lambda to access db table in Dynamo db
      environment: {
        TABLE_NAME: props.spacesTable.tableName,
      },
    });

    this.helloLambdaIntegration = new LambdaIntegration(helloLambda);
  }
}
