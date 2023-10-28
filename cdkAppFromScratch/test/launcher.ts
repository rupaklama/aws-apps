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

handler(
  {
    httpMethod: "GET",
    // body: JSON.stringify({
    //   location: "San Francisco city",
    // }),
  } as any,
  {} as any
);
