export class ApiError extends Error {
  constructor(envelope, statusCode) {
    const err = envelope?.error ?? {};
    super(err.message ?? 'Unknown error');
    this.code = err.code ?? 'UNKNOWN';
    this.statusCode = statusCode ?? 500;
    this.details = err.details ?? null;
    this.requestId = envelope?.meta?.requestId ?? null;
  }

  isAuth() {
    return this.code === 'UNAUTHORIZED';
  }

  isValidation() {
    return this.code === 'VALIDATION_ERROR';
  }

  toString() {
    return `ApiError [${this.statusCode}/${this.code}]: ${this.message}`;
  }
}
