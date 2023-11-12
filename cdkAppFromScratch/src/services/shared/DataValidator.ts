import { SpaceEntry } from "../model/Model";

export class MissingFieldError extends Error {
  // note - message is the only param built in Error Object accepts
  constructor(message: string) {
    super(`Value for ${message} expected!`);

    // constructor function won't be call in the stack trace to not to pollute with more unneeded details
    Error.captureStackTrace(this, this.constructor);
  }
}

export class JSONError extends Error {
  constructor(message: string) {
    super(`Value for ${message} expected!`);

    Error.captureStackTrace(this, this.constructor);
  }
}
export function validateAsSpaceEntry(arg: any) {
  if ((arg as SpaceEntry).location === undefined) {
    throw new MissingFieldError("location");
  }

  if ((arg as SpaceEntry).name === undefined) {
    throw new MissingFieldError("name");
  }

  if ((arg as SpaceEntry).id === undefined) {
    throw new MissingFieldError("id");
  }
}
