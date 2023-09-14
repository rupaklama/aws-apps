import * as cdk from "aws-cdk-lib";
import { Bucket, CfnBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class PhotosStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Construct to store images
    // note: Updating Construct or Logical id 'PhotosBucket' will create a new resource
    // & delete the old one. Need to delete old s3 bucket manually on having issues.
    new Bucket(this, "PhotosBucket", {
      // defining custom name, s3 bucket name must be unique
      bucketName: "photosbucket-12322",
    });
  }
}
