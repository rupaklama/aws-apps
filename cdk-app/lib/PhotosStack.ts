import * as cdk from "aws-cdk-lib";
import { Bucket, CfnBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class PhotosStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Construct to store images
    // note: Updating Construct or Logical id 'PhotosBucket' will create a new resource
    // & delete the old one. Need to delete old s3 bucket manually on having issues.
    const photosBucket = new Bucket(this, "PhotosBucket", {
      // defining custom name, s3 bucket name must be unique
      bucketName: "photosbucket-12322",
    });

    // creating output value to use in other stack - PhotosHandlerStack.ts
    // note: the id is the key "photos-bucket" to the output value in PhotosHandlerStack.ts
    new cdk.CfnOutput(this, "photos-bucket", {
      value: photosBucket.bucketArn,
      // export name to make sure referencing with right key
      exportName: "photos-bucket",
    });
  }
}
