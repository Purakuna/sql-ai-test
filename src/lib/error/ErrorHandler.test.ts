import { NextResponse } from 'next/server';
import {
    BaseError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    BadRequestError,
    ConflictError,
    PartialSuccessError,
    ExamAlreadyExistsError,
    handleApiError,
    handleActionError,
} from './ErrorHandler';

jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((body, init) => ({ body, init })),
    },
}));

const mockNextResponseJson = NextResponse.json as jest.Mock;

describe('ErrorHandler', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    describe('Custom Error Classes', () => {
        it('BaseError should correctly assign properties', () => {
            const error = new BaseError('A base error', 500, { detail: 'info' });
            expect(error.message).toBe('A base error');
            expect(error.statusCode).toBe(500);
            expect(error.details).toEqual({ detail: 'info' });
            expect(error.name).toBe('BaseError');
        });

        it.each([
            [UnauthorizedError, 'Unauthorized', 401],
            [ForbiddenError, 'Forbidden', 403],
            [NotFoundError, 'Resource not found', 404],
            [BadRequestError, 'Bad request', 400],
            [ConflictError, 'Conflict', 409],
            [ExamAlreadyExistsError, 'Exam already exists', 409],
        ])('%s should have correct default values', (ErrorClass, defaultMessage, defaultStatus) => {
            const error = new ErrorClass();
            expect(error.message).toBe(defaultMessage);
            expect(error.statusCode).toBe(defaultStatus);
            expect(error.name).toBe(ErrorClass.name);
        });

        it('PartialSuccessError should set correct defaults and include status in details', () => {
            const error = new PartialSuccessError('Partial op', { id: 1 });
            expect(error.message).toBe('Partial op');
            expect(error.statusCode).toBe(207);
            expect(error.details).toEqual({ id: 1, status: 'partial_success' });
            expect(error.name).toBe('PartialSuccessError');
        });
    });

    describe('handleApiError', () => {
        it('should handle BaseError subclasses correctly', () => {
            const error = new NotFoundError('User not found', { userId: '123' });
            handleApiError(error);
            expect(mockNextResponseJson).toHaveBeenCalledWith(
                { message: 'User not found', details: { userId: '123' } },
                { status: 404 }
            );
        });

        it('should handle BaseError with a cause', () => {
            const cause = 'Underlying reason';
            const error = new BadRequestError('Invalid input', { cause });
            handleApiError(error);
            expect(mockNextResponseJson).toHaveBeenCalledWith(
                { message: 'Invalid input', details: { cause: 'Underlying reason' } },
                { status: 400 }
            );
        });

        it('should handle JSON SyntaxError', () => {
            const error = new SyntaxError('Unexpected token a in JSON at position 1');
            handleApiError(error);
            expect(mockNextResponseJson).toHaveBeenCalledWith(
                { message: 'Invalid JSON body' },
                { status: 400 }
            );
        });

        it('should handle generic Errors as Internal Server Error', () => {
            const error = new Error('Something went wrong');
            handleApiError(error);
            expect(mockNextResponseJson).toHaveBeenCalledWith(
                { message: 'Internal Server Error', details: 'Something went wrong' },
                { status: 500 }
            );
        });

        it('should handle non-Error objects as Internal Server Error', () => {
            const error = { message: 'A plain object error' };
            handleApiError(error);
            expect(mockNextResponseJson).toHaveBeenCalledWith(
                { message: 'Internal Server Error', details: 'A plain object error' },
                { status: 500 }
            );
        });
    });

    describe('handleActionError', () => {
        it('should handle BaseError subclasses correctly', () => {
            const error = new ConflictError('Email exists', { email: 'test@test.com' });
            const result = handleActionError(error);
            expect(result).toEqual({
                message: 'Email exists',
                details: { email: 'test@test.com' },
            });
        });

        it('should handle BaseError with a cause', () => {
            const cause = 'Underlying string reason';
            const error = new ForbiddenError('Access denied', { cause });
            const result = handleActionError(error);
            expect(result).toEqual({
                message: 'Access denied',
                details: { cause: 'Underlying string reason' },
            });
        });

        it('should handle JSON SyntaxError', () => {
            const error = new SyntaxError('Unexpected token a in JSON at position 1');
            const result = handleActionError(error);
            expect(result).toEqual({ message: 'Invalid JSON body' });
        });

        it('should handle generic Errors as Internal Server Error', () => {
            const error = new Error('Generic action failure');
            const result = handleActionError(error);
            expect(result).toEqual({
                message: 'Internal Server Error',
                details: 'Generic action failure'
            });
        });
    });
});
