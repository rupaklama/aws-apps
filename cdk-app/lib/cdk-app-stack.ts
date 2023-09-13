import * as cdk from "aws-cdk-lib";
import { Bucket, CfnBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

/* note - 
  This module contains our all cloudformation stacks.
  cdk outputs to CloudFormation Stack template on deploy 
*/
/* 
  A stack is a collection of AWS resources that you can manage as a single unit. In other words, you can create, update, or delete a collection of resources by creating, updating, or deleting stacks. All the resources in a stack are defined by the stack's AWS CloudFormation template. A stack, for instance, can include all the resources required to run a web application, such as a web server, a database, and networking rules. If you no longer require that web application, you can simply delete the stack, and all of its related resources are deleted.
*/

// note: Constructs are resources and a basic building bocks of cdk app
// In CDK, MOST of the time L2 Constructs are use, L3 more often & L1 sometimes.
// At the end, all Constructs are converted into Basic Level L1 Construct

// Manually creating L3 Construct: Need to extend Construct Class to create L3 construct
class L3Bucket extends Construct {
  constructor(scope: Construct, id: string, expiration: number) {
    super(scope, id);

    new Bucket(this, "MyL3Bucket", {
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(expiration),
        },
      ],
    });
  }
}

// NOTE: auto generated CDK stack class

export class CdkAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here inside the 'constructor'

    // note: On all Constructs, need to pass 'scope' as first arg with 'this' to point to current cdk Stack
    // that way constructs or resources will belong to the current cdk stack.

    // note: CDK Deployment parameters - passing extra data on deployment
    const duration = new cdk.CfnParameter(this, "duration", {
      // setting default value for duration
      default: 6,
      minValue: 1,
      maxValue: 10,
      // note: First letter of Type needs to be defined in Uppercase
      type: "Number",
    });

    // S3 Construct: create S3 bucket 3 ways
    // L2 Construct: Most popular & common way to create Construct(resource)
    const myL2Bucket = new Bucket(this, "MyL2Bucket", {
      // Config for files to be deleted in this bucket after expire time
      lifecycleRules: [
        {
          // expiration: cdk.Duration.days(3),
          expiration: cdk.Duration.days(duration.valueAsNumber),
        },
      ],
    });

    // note: Cloudformation Outputs is to query details about the cdk stack for other use cases
    // a great way to share information that is store between stacks and aws resources
    new cdk.CfnOutput(this, "MyL2BucketName", {
      // note: this will be created & added into the 'Outputs' of CdkAppStack in aws console
      value: myL2Bucket.bucketName,
    });

    // L3 Construct instance being created by L3 Construct class above
    new L3Bucket(this, "MyL3Bucket", 3);

    // L1 Construct with CloudFormation
    new CfnBucket(this, "MyL1Bucket", {
      lifecycleConfiguration: {
        rules: [
          {
            expirationInDays: 1,
            status: "Enabled",
          },
        ],
      },
    });
  }
}
