class ApiError extends Error {
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack=""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;
        this.stack = stack;

        if (stack) {
            this.stack = stack;
        } else {
            // ensures stack tace is attached to this if not present.
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

const getErrorStatusAndMessage = (err) => {
    const errorDetails = new ApiError(err?.statusCode ? err.statusCode : 500, err?.message ? err.message : "Error while creating user.");
    return {
        statusCode: err.statusCode ? err.statusCode : 500,
        message: errorDetails.message
    }
}

export { ApiError, getErrorStatusAndMessage }