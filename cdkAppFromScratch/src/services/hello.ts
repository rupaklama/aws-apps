// note: 'services' dir hosts Lambda Functions

// note: 'AWS SDK' is to access & interact with AWS Resources eg. S3 resources here
import { ListBucketsCommand, S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 } from "uuid";

// npm i @aws-sdk/client-s3 : sdk to list our buckets
const s3Client = new S3Client({});

// basic lambda function to deploy using cdk through API gateway
// APIGatewayProxyEvent - event that triggers the lambda function on accessing the API Gateway
async function handler(event: APIGatewayProxyEvent, context: Context) {
  // to see our buckets list
  const command = new ListBucketsCommand({});
  const listBucketsResult = (await s3Client.send(command)).Buckets;

  const response: APIGatewayProxyResult = {
    // note: in order for this lambda to be executed by Api Gateway,
    // it needs to return statusCode & body in the json format
    statusCode: 200,
    body: JSON.stringify(`Hello from lambda! This is your s3 buckets: ${JSON.stringify(listBucketsResult)}`),
  };

  console.log(event);

  return response;
}

export { handler };
