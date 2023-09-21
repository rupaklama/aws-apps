import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Code, Function as LambdaFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { join } from "path";

// stack to deploy lambda function using cdk
export class LambdaStack extends Stack {
  public readonly helloLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Lambda function is a code to create a resource in AWS
    // This lambda fn belongs to the this stack
    const helloLambda = new LambdaFunction(this, "HelloLambda", {
      runtime: Runtime.NODEJS_18_X,

      // code that will be executed inside of lambda in services/hello.js
      handler: "hello.main",

      // how to execute lambda code & specify path to our code
      code: Code.fromAsset(join(__dirname, "..", "services")),
    });

    this.helloLambdaIntegration = new LambdaIntegration(helloLambda);
  }
}
