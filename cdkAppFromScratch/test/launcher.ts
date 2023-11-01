// import { handler } from "../src/services/hello";
import { handler } from "../src/services/spacesApi/handler";

// note: the vs code debugger will execute this file & this 'launcher.ts' file
// must be selected while launching vscode debugger.
// Calling these functions in our project modules to debug here.

// handler(
//   // post api call
//   {
//     httpMethod: "POST",
//     body: JSON.stringify({
//       location: "San Francisco city",
//     }),
//   } as any,
//   {} as any
// );

// handler(
//   {
//     httpMethod: "GET",
//     queryStringParameters: {
//       id: "10a94822-ad97-4987-a81e-fb2a11210163",
//     },
//     // body: JSON.stringify({
//     //   location: "San Francisco city",
//     // }),
//   } as any,
//   {} as any
// );

handler(
  {
    httpMethod: "PUT",
    queryStringParameters: {
      id: "69a81e15-5131-4b50-8ec5-4b79a2644267",
    },
    body: JSON.stringify({
      location: "SF City",
    }),
  } as any,
  {} as any
);
