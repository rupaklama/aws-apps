import { Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../infra/utils";
import { Bucket, HttpMethods, IBucket } from "aws-cdk-lib/aws-s3";

// Application data to be store in Dynamo DB
// note: this stack is to create a tables in dynamo db
export class DataStack extends Stack {
  public readonly spacesTable: ITable;
  public readonly photosBucket: IBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    // Need table name to use with Lambda function
    this.spacesTable = new Table(this, "SpacesTable", {
      // note: partition key - must have important property
      // The Primary Key in relation db is equivalent to the Partition Key in a single-field-key table.
      // 'Partitioning key' is an ordered set of one or more columns in a table and
      // while the 'sort key' is used to sort items within a partition.
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },

      // table name should be unique so to avoid issues use above getSuffixFromStack
      // tableName: `SpacesTable-${suffix}`,
      tableName: "SpacesTable",
    });

    this.photosBucket = new Bucket(this, "SpacesPhotosBucket", {
      bucketName: `spaces-photos-bucket-${suffix}`,
      // note: cors access on calling sdk
      cors: [
        {
          allowedOrigins: ["*"],
          allowedMethods: [HttpMethods.GET, HttpMethods.PUT, HttpMethods.HEAD],
          allowedHeaders: ["*"],
        },
      ],
      // accessControl: BucketAccessControl.PUBLIC_READ, - not working now in future, alternate below is used
      // This way our bucket will hold public files and we can access them from the browser
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
    });
  }
}
