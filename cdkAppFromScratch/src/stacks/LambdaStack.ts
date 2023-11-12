import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface LambdaStackProps extends StackProps {
  spacesTable: ITable;
}

// stack to deploy lambda function using cdk
export class LambdaStack extends Stack {
  public readonly spacesLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    // Lambda is a serverless computation (no server) where our function code runs in response to events
    // and automatically manages resource scaling for us. eg.direct api query to database without server
    // This lambda fn belongs to the this stack.

    // note:  'NodejsFunction' cdk construct is a Node.js Lambda function bundled using Esbuild, not webpack
    // NodejsFunction is to solve issues with aws node js lambdas written in typescript. eg. dependency management, compilation and bundling issues etc.
    // NodejsFunction compiles ts to js, avoids dev dependencies on the prod build & completely editable
    const spacesLambda = new NodejsFunction(this, "spacesLambda", {
      runtime: Runtime.NODEJS_18_X,

      // code that will be executed inside of lambda in services/hello.js
      handler: "handler",

      // how to execute lambda code & specify path to our code
      // code: Code.fromAsset(join(__dirname, "..", "services")),
      // same as above with regular aws node js lambda
      entry: join(__dirname, "..", "services", "spacesApi", "handler.ts"),

      // note: lambda to access db table in Dynamo db
      environment: {
        TABLE_NAME: props.spacesTable.tableName,
      },
    });

    // spaces lambda has rights to write db
    spacesLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        // spaces table in dynamoDB
        resources: [props.spacesTable.tableArn],
        // actions that spaces lambda can take in db table
        actions: [
          "dynamodb:PutItem",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
      })
    );

    // rights to list s3 buckets
    // spacesLambda.addToRolePolicy(
    //   new PolicyStatement({
    //     effect: Effect.ALLOW,
    //     actions: ["s3:ListAllMyBuckets", "s3:ListBucket"],
    //     resources: ["*"], // bad practice
    //   })
    // );

    this.spacesLambdaIntegration = new LambdaIntegration(spacesLambda);
  }
}
