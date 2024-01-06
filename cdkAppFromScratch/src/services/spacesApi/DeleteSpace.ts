import { DeleteItemCommand, DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hasAdminGroup } from "../../infra/utils";

// http delete api
async function deleteSpace(
  event: APIGatewayProxyEvent,
  dynamoDBClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (!hasAdminGroup(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify(`Not authorized`),
    };
  }

  if (event.queryStringParameters) {
    if ("id" in event.queryStringParameters) {
      const spaceId = event.queryStringParameters["id"];

      // note: DeleteItemCommand is to delete single item
      await dynamoDBClient.send(
        new DeleteItemCommand({
          TableName: process.env.TABLE_NAME,
          Key: {
            id: { S: spaceId },
          },
        })
      );

      return {
        statusCode: 200,
        body: JSON.stringify(`Deleted space with id ${spaceId}`),
      };
    }
  }
}

export { deleteSpace };
