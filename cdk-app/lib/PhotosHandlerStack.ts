import * as cdk from "aws-cdk-lib";
import { Code, Function as LambdaFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { Bucket, CfnBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

// custom interface with additional prop to share data
interface PhotosHandlerStackProps extends cdk.StackProps {
  targetBucketARN: string;
}

export class PhotosHandlerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PhotosHandlerStackProps) {
    super(scope, id, props);

    // note: Cross Stack References with Intrinsic Function - FN::importValue

    // The intrinsic function Fn::ImportValue returns the value of an output exported by another stack.
    // You typically use this function to create cross-stack references.
    // Need to provide key/id "photos-bucket" from PhotosStack.ts
    // const targetBucket = cdk.Fn.importValue("photos-bucket");

    // This stack will share resources from another stack like with Lambda function
    // Lambda function is a code to create a resource in AWS
    new LambdaFunction(this, "PhotosHandler", {
      runtime: Runtime.NODEJS_16_X,
      handler: "index.handler",
      code: Code.fromInline(`
        exports.handler = async (event) => {
          console.log('Hello!" + process.env.TARGET_BUCKET)
        }
      `),
      environment: {
        TARGET_BUCKET: props.targetBucketARN,
      },
    });
  }
}
