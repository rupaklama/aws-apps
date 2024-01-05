import { Stack, StackProps } from "aws-cdk-lib";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  MethodOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

// note: this is API Gateway stack to execute our lambda over the internet as a web api endpoint
// API Gateway provides tools for creating and documenting web APIs that route HTTP requests to Lambda functions.
// Using API Gateway provides users with a secure HTTP endpoint to invoke your Lambda function and can help manage large volumes of calls to your function by throttling traffic and automatically validating and authorizing API calls.

// custom interface since this stack will be accessing shared data in Lambda Stack using cdk props
interface ApiStackProps extends StackProps {
  spacesLambdaIntegration: LambdaIntegration;
  userPool: IUserPool;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // Rest Api construct gateway
    const api = new RestApi(this, "SpacesApi");

    // auth protected route: securing APIs with Cognito
    const authorizer = new CognitoUserPoolsAuthorizer(this, "SpacesApiAuthorizer", {
      cognitoUserPools: [props.userPool],
      identitySource: "method.request.header.Authorization",
    });
    authorizer._attachToApi(api);

    const optionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      },
    };

    // 'root' - Represents the root resource of this API endpoint ('/').
    // Resources and Methods are added to this resource '/spaces'
    const spacesResources = api.root.addResource("spaces");

    // config to link to our lambda
    spacesResources.addMethod("GET", props.spacesLambdaIntegration, optionsWithAuth);
    spacesResources.addMethod("POST", props.spacesLambdaIntegration, optionsWithAuth);
    spacesResources.addMethod("PUT", props.spacesLambdaIntegration, optionsWithAuth);
    spacesResources.addMethod("DELETE", props.spacesLambdaIntegration, optionsWithAuth);
  }
}
