import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  CfnUserPoolGroup,
  UserPool,
  UserPoolClient,
} from "aws-cdk-lib/aws-cognito";

import { Effect, FederatedPrincipal, PolicyStatement, Role } from "aws-cdk-lib/aws-iam";
import { IBucket } from "aws-cdk-lib/aws-s3";

import { Construct } from "constructs";

interface AuthStackProps extends StackProps {
  photosBucket: IBucket;
}

export class AuthStack extends Stack {
  // User pool for authentication
  // note: This userPool value needs to be public to be accessed by our API stack for security
  public userPool: UserPool;
  private userPoolClient: UserPoolClient;

  // note: Identity pool for authorization, access control & to call AWS services with SDK
  private identityPool: CfnIdentityPool;
  // Must need to create roles for authenticated & unauthenticated users in identity pool
  private authenticatedRole: Role;
  private unAuthenticatedRole: Role;

  // admin role to list all the buckets using IAM temp credentials
  private adminRole: Role;

  constructor(scope: Construct, id: string, props?: AuthStackProps) {
    super(scope, id, props);

    this.createUserPool();
    this.createUserPoolClient();

    this.createIdentityPool();
    this.createIdentityRoles(props.photosBucket);
    this.attachIdentityRoles();

    // create this at the end to avoid compilation issues
    this.createAdminsGroup();
  }

  // note: In order to create user pool, need user pool as well as user client below
  private createUserPool() {
    this.userPool = new UserPool(this, "SpacesUserPool", {
      selfSignUpEnabled: true,
      signInAliases: {
        // username and email are the two ways to sign in
        username: true,
        email: true,
      },
    });

    // Creates an CfnOutput value for this stack since we need userPoolId on connecting to this user pool
    // The output being created here is named "SpacesUserPoolId".
    // The value of this output is set to the ID of a User Pool, which is a user directory in Amazon Cognito.
    new CfnOutput(this, "SpacesUserPoolId", {
      value: this.userPool.userPoolId, // User pool ID: us-east-1_jBtjHQrsh
    });
  }

  private createUserPoolClient() {
    this.userPoolClient = this.userPool.addClient("SpacesUserPoolClient", {
      authFlows: {
        // need these default values to avoid any issues
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
    });

    new CfnOutput(this, "SpacesUserPoolClientId", {
      value: this.userPoolClient.userPoolClientId,
    });
  }

  // Cognito User Groups for providing different privileges for different users
  // Only Cognito authenticated & authorized user in this group can access the API
  private createAdminsGroup() {
    new CfnUserPoolGroup(this, "SpaceAdmins", {
      userPoolId: this.userPool.userPoolId,
      groupName: "admins",

      // connecting "admins" group to this adminRole
      roleArn: this.adminRole.roleArn,
    });
  }

  // note: Identity pool for authorization, access control & to call AWS services with SDK
  private createIdentityPool() {
    this.identityPool = new CfnIdentityPool(this, "SpacesIdentityPool", {
      allowUnauthenticatedIdentities: true,
      // linking user pool to identity pool
      cognitoIdentityProviders: [
        // auth providers
        {
          clientId: this.userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });

    // to access the identity pool id from other stacks
    new CfnOutput(this, "SpacesIdentityPoolId", {
      // ref is to access the value of the identity pool id
      value: this.identityPool.ref,
    });
  }

  private createIdentityRoles(photosBucket: IBucket) {
    // note: Must need to create roles for authenticated & unauthenticated users in identity pool
    // note: Extra role for admin users if needed
    this.authenticatedRole = new Role(this, "CognitoDefaultAuthenticatedRole", {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });
    this.unAuthenticatedRole = new Role(this, "CognitoDefaultUnauthenticatedRole", {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "unauthenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });
    this.adminRole = new Role(this, "CognitoAdminRole", {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });

    // note: admin role to list & perform any actions inside this bucket
    this.adminRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "s3:PutObject",
          "s3:PutObjectAcl",
          // "s3:ListAllMyBuckets",
        ],
        // resources: ["*"], // all
        resources: [photosBucket.bucketArn + "/*"],
      })
    );
  }

  // note: Attaching above roles to identity pool
  private attachIdentityRoles() {
    new CfnIdentityPoolRoleAttachment(this, "RolesAttachment", {
      identityPoolId: this.identityPool.ref, // id value
      roles: {
        authenticated: this.authenticatedRole.roleArn,
        unauthenticated: this.unAuthenticatedRole.roleArn,
      },
      // Users have role based in their token & can access the resources based on their role
      roleMappings: {
        // adminsMapping - custom name, can be anything
        adminsMapping: {
          type: "Token",
          ambiguousRoleResolution: "AuthenticatedRole",
          identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`,
        },
      },
    });
  }
}
