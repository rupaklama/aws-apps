import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

interface SpaceEntry {
  id: string;
  location: string;
  name: string;
  photoUrl?: string;
}

// http Get api for list of items
async function getSpaces(event: APIGatewayProxyEvent, dynamoDBClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const result = await dynamoDBClient.send(
    // 'ScanCommand' - get request api call to return all the items
    new ScanCommand({
      // db table
      TableName: process.env.TABLE_NAME,
    })
  );

  console.log(result.Items);

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
}

export { getSpaces };
