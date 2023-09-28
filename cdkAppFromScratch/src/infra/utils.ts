import { Fn, Stack } from "aws-cdk-lib";

// Getting Stack's very last random part of its name to generate unique names
export function getSuffixFromStack(stack: Stack) {
  const shortStackId = Fn.select(2, Fn.split("/", stack.stackId));
  const suffix = Fn.select(4, Fn.split("-", shortStackId));
  return suffix;
}
