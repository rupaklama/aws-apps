#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkAppStack } from "../lib/cdk-app-stack";
import { PhotosStack } from "../lib/PhotosStack";
import { PhotosHandlerStack } from "../lib/PhotosHandlerStack";

/* cdk instance to initialize our application */

const app = new cdk.App();

// Multiple CDK STACKS

// NOTE: The original/parent stack needs to deploy first manually since CDK deploys in
// an alphabetical order which will create an issues on deployment.
// NOTE: This won't happen when sharing resources with CDK props like below

// new CdkAppStack(app, "CdkAppStack", {});
const photosStack = new PhotosStack(app, "PhotosStack");

new PhotosHandlerStack(app, "PhotosHandlerStack", {
  // note: Sharing resources with CDK props, better option
  // this new prop will hold the share data
  targetBucketARN: photosStack.photosBucketARN,
});
