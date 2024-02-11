import { Fn, Stack } from "aws-cdk-lib";
import { APIGatewayProxyEvent } from "aws-lambda";

// Getting Stack's very last random part of its name to generate unique names
export function getSuffixFromStack(stack: Stack) {
  const shortStackId = Fn.select(2, Fn.split("/", stack.stackId));
  const suffix = Fn.select(4, Fn.split("-", shortStackId));
  return suffix;
}

// Check if the user has the admin group, only admin can do delete operation
// note: APIGatewayProxyEvent is request object data and also contains authorizer info from user pool cognito
export function hasAdminGroup(event: APIGatewayProxyEvent) {
  const groups = event.requestContext.authorizer?.claims["cognito:groups"];

  // our 'admins' group in User pool of Cognito
  if (groups) {
    return (groups as string).includes("admins");
  }

  return false;
}
