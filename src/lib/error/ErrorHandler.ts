/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

export class BaseError extends Error {
    statusCode: number;
    details?: object;
    constructor(message: string, statusCode: number, details?: object) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = this.constructor.name;
    }
}

export class UnauthorizedError extends BaseError {
    constructor(message = 'Unauthorized', details?: object) {
        super(message, 401, details);
    }
}

export class ForbiddenError extends BaseError {
    constructor(message = 'Forbidden', details?: object) {
        super(message, 403, details);
    }
}

export class NotFoundError extends BaseError {
    constructor(message = 'Resource not found', details?: object) {
        super(message, 404, details);
    }
}

export class BadRequestError extends BaseError {
    constructor(message = 'Bad request', details?: object) {
        super(message, 400, details);
    }
}

export class ConflictError extends BaseError {
    constructor(message = 'Conflict', details?: object) {
        super(message, 409, details);
    }
}

export class PartialSuccessError extends BaseError {
    constructor(message = 'Operation partially succeeded', details?: object, status = 'partial_success') {
        super(message, 207, { ...details, status }); // 207 Multi-Status
    }
}

export class ExamAlreadyExistsError extends BaseError {
    constructor(message = 'Exam already exists', details?: object) {
        super(message, 409, details);
    }
}

export function handleApiError(error: any) {
    console.error("API Error:", error.name, "-", error.message, error.details ? JSON.stringify(error.details) : '', error.cause ? `Cause: ${error.cause}` : '');

    if (error instanceof BaseError) {
        const responseBody: { message: string; details?: object; cause?: string } = { message: error.message };
        if (error.details) {
            responseBody.details = error.details;
        }
        if (error.cause instanceof Error) {
            responseBody.cause = error.cause.message;
        } else if (typeof error.cause === 'string') {
            responseBody.cause = error.cause;
        }
        return NextResponse.json(responseBody, { status: error.statusCode });
    }

    if ((error as any) instanceof SyntaxError && (error as any).message.includes('JSON')) {
        return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Internal Server Error', details: (error as any).message }, { status: 500 });
}

export function handleActionError(error: any) {
    console.error("Action Error:", error.name, "-", error.message, error.details ? JSON.stringify(error.details) : '', error.cause ? `Cause: ${error.cause}` : '');

    if (error instanceof BaseError) {
        const responseBody: { message: string; details?: object; cause?: string } = { message: error.message };
        if (error.details) {
            responseBody.details = error.details;
        }
        if (error.cause instanceof Error) {
            responseBody.cause = error.cause.message;
        } else if (typeof error.cause === 'string') {
            responseBody.cause = error.cause;
        }
        return { message: error.message, details: error.details, cause: error.cause };
    }

    if ((error as any) instanceof SyntaxError && (error as any).message.includes('JSON')) {
        return { message: 'Invalid JSON body' };
    }

    return { message: 'Internal Server Error', details: (error as any).message };
}
