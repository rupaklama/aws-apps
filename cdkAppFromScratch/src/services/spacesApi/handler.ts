// note: 'services' dir hosts Lambda Functions
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./DeleteSpace";

// note: Very import thing is that when we are working with AWS DynamoDB is that the
// DynamoDB Client should be initialize in outer scope of http methods as a good practice
// npm i @aws-sdk/client-dynamodb

// initializing & connecting to DynamoDB here with aws dynamoDB sdk
const dynamoDBClient = new DynamoDBClient({});

// basic lambda function to deploy using cdk through API gateway
// note: serving multiple http calls with same lambda for the Spaces Api resource
async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let message = "";

  try {
    switch (event.httpMethod) {
      case "GET":
        // message = "Hello from GET!";
        const getResponse = await getSpaces(event, dynamoDBClient);
        return getResponse;

      case "POST":
        // message = "Hello from POST!";
        const postResponse = await postSpaces(event, dynamoDBClient);
        return postResponse;

      case "PUT":
        const putResponse = await updateSpace(event, dynamoDBClient);
        return putResponse;

      case "DELETE":
        const deleteResponse = await deleteSpace(event, dynamoDBClient);
        return deleteResponse;

      default:
        break;
    }
  } catch (error) {
    console.error("dynamoDB", error);
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }

  const response: APIGatewayProxyResult = {
    // note: in order for this lambda to be executed by Api Gateway,
    // it needs to return statusCode & body in the json format
    statusCode: 200,
    body: JSON.stringify(message),
  };

  return response;
}

export { handler };
