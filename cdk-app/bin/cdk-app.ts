#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkAppStack } from "../lib/cdk-app-stack";
import { PhotosStack } from "../lib/PhotosStack";
import { PhotosHandlerStack } from "../lib/PhotosHandlerStack";
import { BucketTagger } from "./Tagger";

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
  // this new prop will hold the shared data
  targetBucketARN: photosStack.photosBucketARN,
});

// cdk aspect
const tagger = new BucketTagger("level", "test");
// add tags
cdk.Aspects.of(app).add(tagger);
