export class BusinessLogicException extends Error {
  constructor(public message: string, public type: number) {
    super(message);
  }
}

export enum BusinessError {
  NOT_FOUND = 404,
  PRECONDITION_FAILED = 412,
  BAD_REQUEST = 400
} 