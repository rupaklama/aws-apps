import { DynamoDBClient, GetItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

interface SpaceEntry {
  id: string;
  location: string;
  name: string;
  photoUrl?: string;
}

// http PUT api for updating an item
async function updateSpace(
  event: APIGatewayProxyEvent,
  dynamoDBClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters && "id" in event.queryStringParameters && event.body) {
    const parsedBody = JSON.parse(event.body);

    const spaceId = event.queryStringParameters["id"];
    const requestBodyKey = Object.keys(parsedBody)[0]; // 'location'
    const requestBodyValue = parsedBody[requestBodyKey];

    const updateResult = await dynamoDBClient.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: spaceId },
        },
        // to prevent issues with the field name of being aws reserve keywords
        // our custom way of updating field
        UpdateExpression: "set #zzzNew = :new",
        ExpressionAttributeValues: {
          // defining our custom attributes here for key = value
          ":new": {
            S: requestBodyValue, // value
          },
        },
        ExpressionAttributeNames: {
          "#zzzNew": requestBodyKey, // key
        },

        // updated value
        ReturnValues: "UPDATED_NEW",
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify(updateResult.Attributes),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify("Please provide right args!"),
  };
}

export { updateSpace };
