import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";

async function testAuth() {
  const service = new AuthService();
  const loginResult = await service.login("admin", "goToHell");

  // console.log(loginResult.getSignInUserSession().getIdToken().getJwtToken());

  // to access AWS services with SDK with Temporary IAM credentials
  const credentials = await service.generateTemporaryCredentials(loginResult);
  // console.log(credentials);

  const buckets = await listBuckets(credentials);
  console.log(buckets);
}

// testing admin group to see if it has access to list all the buckets wtih IAM temp credentials
async function listBuckets(credentials: any) {
  const client = new S3Client({
    credentials: credentials,
  });
  const command = new ListBucketsCommand({});
  const result = await client.send(command);
  return result;
}

testAuth();
