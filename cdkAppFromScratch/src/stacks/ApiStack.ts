import { Stack, StackProps } from "aws-cdk-lib";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  MethodOptions,
  ResourceOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

// note: this is API Gateway stack to execute our lambda over the internet as a web api endpoint
// API Gateway provides tools for creating and documenting web APIs that route HTTP requests to Lambda functions.
// Using API Gateway provides users with a secure HTTP endpoint to invoke your Lambda function and can help manage large volumes of calls to your function by throttling traffic and automatically validating and authorizing API calls.

// custom interface since this stack will be accessing Lambda Stack using cdk props
interface ApiStackProps extends StackProps {
  spacesLambdaIntegration: LambdaIntegration;

  // note: this value needs to be public to be accessed by our API stack for security
  // Only Cognito auth & authorized user can access the API
  userPool: IUserPool;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // Rest Api construct gateway
    const api = new RestApi(this, "SpacesApi");

    // auth protected route: securing APIs with Cognito User pool
    const authorizer = new CognitoUserPoolsAuthorizer(this, "SpacesApiAuthorizer", {
      cognitoUserPools: [props.userPool],
      identitySource: "method.request.header.Authorization", // jwt
    });
    authorizer._attachToApi(api);

    // passing above into all http calls in lambda below
    const optionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      },
    };

    // enabling cors for our API
    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"], // Cors.ALL_ORIGINS
        allowMethods: ["GET", "POST", "PUT", "DELETE"], // Cors.ALL_METHODS
        allowHeaders: ["*"],
      },
    };

    // 'root' - Represents the root resource of this API endpoint ('/').
    // Resources and Methods are added to this resource '/spaces'
    const spacesResources = api.root.addResource("spaces", optionsWithCors);

    // config to link to our lambda
    spacesResources.addMethod("GET", props.spacesLambdaIntegration, optionsWithAuth);
    spacesResources.addMethod("POST", props.spacesLambdaIntegration, optionsWithAuth);
    spacesResources.addMethod("PUT", props.spacesLambdaIntegration, optionsWithAuth);
    spacesResources.addMethod("DELETE", props.spacesLambdaIntegration, optionsWithAuth);
  }
}
