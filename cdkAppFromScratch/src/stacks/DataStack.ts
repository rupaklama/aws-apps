import { Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../infra/utils";

// Application data to be store in Dynamo DB
export class DataStack extends Stack {
  public readonly spacesTable: ITable;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    this.spacesTable = new Table(this, "SpacesTable", {
      // note: partition key - must have important property
      // The Primary Key in relation db is equivalent to the Partition Key in a single-field-key table.
      // 'Partitioning key' is an ordered set of one or more columns in a table and
      // while the 'sort key' is used to sort items within a partition.
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },

      // table name should be unique so to avoid issues
      tableName: "SpaceTable",
    });
  }
}
