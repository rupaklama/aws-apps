import { type CognitoUser } from "@aws-amplify/auth";
import { Amplify, Auth } from "aws-amplify";

// config file from backend
import stackOutputs from "../outputs.json";

const awsRegion = "us-east-1";

// Accessing Auth Service with Amplify
Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: awsRegion,
    // userPoolId: "us-east-1_jBtjHQrsh",
    userPoolId: stackOutputs.AuthStack.SpacesUserPoolId,
    userPoolWebClientId: stackOutputs.AuthStack.SpacesUserPoolClientId, // Client ID in App integration
    authenticationFlowType: "USER_PASSWORD_AUTH",

    // note: identity pool id is used to access AWS services with SDK with Temporary IAM credentials
    identityPoolId: stackOutputs.AuthStack.SpacesIdentityPoolId,
  },
});

export class AuthService {
  private user: CognitoUser | undefined;

  public async login(username: string, password: string): Promise<Object | undefined> {
    try {
      this.user = (await Auth.signIn(username, password)) as CognitoUser;
      return this.user;
    } catch (error) {
      console.error("AuthService.login", error);
      return undefined;
    }
  }

  public getUserName(): string | undefined {
    return this.user?.getUsername();
  }
}
