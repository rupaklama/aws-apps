import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

interface SpaceEntry {
  id: string;
  location: string;
  name: string;
  photoUrl?: string;
}

// http post api
async function postSpaces(event: APIGatewayProxyEvent, dynamoDBClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  // note: when creating an entry into dynamodb, we need to pass it 'id' since the db is configure that way
  const randomId = v4;

  // note: we will get our 'request data obj' inside of the 'event'
  const item: SpaceEntry = JSON.parse(event.body);
  item.id = randomId();

  const result = await dynamoDBClient.send(
    // 'putItem' - post request api call
    new PutItemCommand({
      // db table
      TableName: process.env.TABLE_NAME,
      // item to add in db with following field properties & data
      Item: {
        // note: Primary ID as partitionKey: { name: "id", type: AttributeType.STRING, } in DataStack.ts
        id: {
          S: item.id,
        },
        location: {
          // api location
          S: item.location,
        },
      },
    })
  );

  console.log(result);

  return {
    statusCode: 201,
    body: JSON.stringify({ id: item.id, location: item.location }),
  };
}

export { postSpaces };
