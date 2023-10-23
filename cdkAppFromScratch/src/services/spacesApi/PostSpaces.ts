import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

// http post api
export async function postSpaces(
  event: APIGatewayProxyEvent,
  dynamoDBClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  // note: when creating an entry into dynamodb, we need to pass it id since the db is configure that way
  const randomId = v4;

  // response body obj from handler.ts
  const item = JSON.parse(event.body);
  item.id = randomId();

  const result = await dynamoDBClient.send(
    new PutItemCommand({
      // db table
      TableName: process.env.TABLE_NAME,
      // item to add in db
      Item: {
        id: {
          S: item.id,
        },

        // api location
        S: item.location,
      },
    })
  );

  console.log(result);

  return {
    statusCode: 201,
    body: JSON.stringify({ id: randomId }),
  };
}
