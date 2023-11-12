import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

import { validateAsSpaceEntry } from "../shared/DataValidator";
import { createRandomId, parseJSON } from "../shared/utils";

// http post api
async function postSpaces(event: APIGatewayProxyEvent, dynamoDBClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  // note: when creating an entry into dynamodb, we need to pass it 'id' since the db is configure that way
  const randomId = createRandomId();

  // note: we will get our 'request data obj' inside of the 'event'
  const item = parseJSON(event.body);
  item.id = randomId;

  // validate data
  validateAsSpaceEntry(item);

  const result = await dynamoDBClient.send(
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

      // note: marshall func will add attribute types just like above { S: }
      Item: marshall(item),
    })
  );

  console.log(result);

  return {
    statusCode: 201,
    body: JSON.stringify({ id: item.id, location: item.location }),
  };
}

export { postSpaces };
