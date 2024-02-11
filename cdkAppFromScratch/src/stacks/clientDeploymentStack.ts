import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../infra/utils";
import { join } from "path";
import { existsSync } from "fs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";

export class ClientDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    // S3 bucket to store the website files
    const deploymentBucket = new Bucket(this, "ClientDeploymentBucket", {
      bucketName: "spaces-client-frontend",
    });

    const clientDir = join(__dirname, "..", "..", "client", "build");

    // Returns true if the path exists, false otherwise.
    if (!existsSync(clientDir)) {
      console.warn("Client build directory does not exist");
      return;
    }

    // 1. create a Bucket Deployment to deploy the website files to the S3 bucket
    new BucketDeployment(this, "ClientDeployment", {
      sources: [Source.asset(clientDir)],
      destinationBucket: deploymentBucket,
    });

    // 2. create a originIdentity that can read from the S3 bucket
    const originIdentity = new OriginAccessIdentity(this, "OriginIdentity");
    deploymentBucket.grantRead(originIdentity);

    // 3. create a CloudFront distribution that provides a simple way to distribute content to end users
    const distribution = new Distribution(this, "SpacesDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new S3Origin(deploymentBucket, {
          // bucket to serve as the origin for this distribution
          originAccessIdentity: originIdentity,
        }),
      },
    });

    // 4. create an output to show the URL of the CloudFront distribution
    new CfnOutput(this, "SpacesUrl", {
      value: distribution.distributionDomainName, // URL of the CloudFront distribution
    });
  }
}
