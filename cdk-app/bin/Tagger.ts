import { IAspect } from "aws-cdk-lib";
import { CfnBucket } from "aws-cdk-lib/aws-s3";
import { IConstruct } from "constructs";

// This is CDK Aspect, one of the cdk feature to modify resources after created. eg. add tags, security, linters etc
export class BucketTagger implements IAspect {
  private key: string;
  private value: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }

  // 'visit' require method in IAspect interface
  visit(node: IConstruct): void {
    // node is a construct, console all constructs
    console.log("visiting: " + node.node.id);

    if (node instanceof CfnBucket) {
      node.tags.setTag(this.key, this.value);
    }
  }
}
