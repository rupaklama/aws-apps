import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

// http post api
async function postSpacesWithDoc(
  event: APIGatewayProxyEvent,
  dynamoDBClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  // note: using @aws-sdk/lib-dynamodb for api query
  const ddbDocClient = DynamoDBDocumentClient.from(dynamoDBClient);

  // note: when creating an entry into dynamodb, we need to pass it 'id' since the db is configure that way
  const randomId = v4;

  // note: we will get our 'request data obj' inside of the 'event'
  const item = JSON.parse(event.body);
  item.id = randomId();

  const result = await ddbDocClient.send(
    // 'putItem' - post request api call
    new PutItemCommand({
      // db table
      TableName: process.env.TABLE_NAME,
      // item to add in db with following field properties & data
      // Item: {
      // note: Primary ID as partitionKey: { name: "id", type: AttributeType.STRING, } in DataStack.ts
      //   id: {
      //     S: item.id,
      //   },
      //   location: {
      //     // api location
      //     S: item.location,
      //   },
      // },

      Item: item,
    })
  );

  console.log(result);

  return {
    statusCode: 201,
    body: JSON.stringify({ id: item.id, location: item.location }),
  };
}

export { postSpacesWithDoc };
