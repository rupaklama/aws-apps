import { v4 } from "uuid";
import { JSONError } from "./DataValidator";
import { randomUUID } from "crypto";
import { APIGatewayProxyResult } from "aws-lambda";

export function parseJSON(arg: string) {
  try {
    return JSON.parse(arg);
  } catch (error) {
    throw new JSONError(error.message);
  }
}

export function createRandomId() {
  return randomUUID();
}

export function addCorsHeader(response: APIGatewayProxyResult) {
  if (!response.headers) {
    response.headers = {};
  }

  return {
    ...response,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Credentials": true,
    },
  };
}
