// import { handler } from "../src/services/hello";
import { handler } from "../src/services/spacesApi/handler";

// note: the vs code debugger will execute this file & this file must be selecting while launching debugger
// calling these functions in project modules to debug using vs code debugger
handler(
  // post api call
  {
    httpMethod: "POST",
    body: JSON.stringify({
      location: "New York city",
    }),
  } as any,
  {} as any
);
