import { type CognitoUser } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { Amplify, Auth } from "aws-amplify";

const awsRegion = "us-east-1";

// Test Auth Service with Amplify
Amplify.configure({
  Auth: {
    region: awsRegion,
    userPoolId: "us-east-1_jBtjHQrsh",
    userPoolWebClientId: "46hlmufmaadat1f1otd9prsc10", // Client ID in App integration
    authenticationFlowType: "USER_PASSWORD_AUTH",

    // note: identity pool id is used to access AWS services with SDK with Temporary IAM credentials
    identityPoolId: "us-east-1:1942eaab-fee3-4b17-a673-b1aaf7c8025c",
  },
});

export class AuthService {
  public async login(username: string, password: string) {
    const result = (await Auth.signIn(username, password)) as CognitoUser;
    return result;
  }

  // to access AWS services with SDK with Temporary IAM credentials
  public async generateTemporaryCredentials(user: CognitoUser) {
    const jwtToken = user.getSignInUserSession().getIdToken().getJwtToken();
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/us-east-1_jBtjHQrsh`; // userPoolId
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: "us-east-1:1942eaab-fee3-4b17-a673-b1aaf7c8025c", // identityPoolId
        logins: {
          [cognitoIdentityPool]: jwtToken,
        },
      }),
    });

    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}
