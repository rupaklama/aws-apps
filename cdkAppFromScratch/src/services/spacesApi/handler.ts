// note: 'services' dir hosts Lambda Functions

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

// basic lambda function to deploy using cdk through API gateway
async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let message = "";

  switch (event.httpMethod) {
    case "GET":
      message = "Hello from GET!";
      break;
    case "POST":
      message = "Hello from POST!";
      break;
    default:
      break;
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
