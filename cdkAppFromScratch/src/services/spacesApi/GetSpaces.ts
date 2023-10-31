import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

interface SpaceEntry {
  id: string;
  location: string;
  name: string;
  photoUrl?: string;
}

// http Get api for list of items
async function getSpaces(event: APIGatewayProxyEvent, dynamoDBClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters) {
    if ("id" in event.queryStringParameters) {
      const spaceId = event.queryStringParameters["id"];

      // note: GetItemCommand is to query single item
      const getItemResponse = await dynamoDBClient.send(
        new GetItemCommand({
          TableName: process.env.TABLE_NAME,
          Key: {
            id: { S: spaceId },
          },
        })
      );

      if (getItemResponse.Item) {
        // unmarshall func is to get to format in json versus default attribute types {S:}
        const unmarshalledItem = unmarshall(getItemResponse.Item);
        return {
          statusCode: 200,
          // body: JSON.stringify(getItemResponse.Item),
          body: JSON.stringify(unmarshalledItem),
        };
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify(`Space with id ${spaceId} not found`),
        };
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify("Id required!"),
      };
    }
  }
  const result = await dynamoDBClient.send(
    // 'ScanCommand' - get request api call to return all the items
    new ScanCommand({
      // db table
      TableName: process.env.TABLE_NAME,
    })
  );

  const unmarshalledItems = result.Items?.map(item => unmarshall(item));
  console.log(unmarshalledItems);

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
}

export { getSpaces };
