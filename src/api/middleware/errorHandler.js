// src/api/middleware/errorHandler.js
import { AppError } from '../../core/utils/ErrorHandler.js';
import { HTTP_STATUS } from '../client/apiConfig.js';

export class ApiErrorHandler {
    static handle(error) {
        if (error instanceof AppError) {
            return error;
        }

        const { response } = error;

        // Handle API Response Errors
        if (response) {
            return this.handleResponseError(response);
        }

        // Handle Network/Request Errors
        if (error.request) {
            return new AppError(
                'Network error - no response received',
                'NETWORK_ERROR',
                { originalError: error }
            );
        }

        // Handle Other Errors
        return new AppError(
            'An unexpected error occurred',
            'UNKNOWN_ERROR',
            { originalError: error }
        );
    }

    static handleResponseError(response) {
        const { status, data } = response;
        const message = data?.message || this.getDefaultMessageForStatus(status);

        switch (status) {
            case HTTP_STATUS.BAD_REQUEST:
                return new AppError(message, 'VALIDATION_ERROR', data);

            case HTTP_STATUS.UNAUTHORIZED:
                return new AppError(message, 'UNAUTHORIZED', data);

            case HTTP_STATUS.FORBIDDEN:
                return new AppError(message, 'FORBIDDEN', data);

            case HTTP_STATUS.NOT_FOUND:
                return new AppError(message, 'NOT_FOUND', data);

            case HTTP_STATUS.INTERNAL_SERVER_ERROR:
                return new AppError(message, 'SERVER_ERROR', data);

            default:
                return new AppError(message, 'API_ERROR', data);
        }
    }

    static getDefaultMessageForStatus(status) {
        const statusMessages = {
            [HTTP_STATUS.BAD_REQUEST]: 'Invalid request',
            [HTTP_STATUS.UNAUTHORIZED]: 'Authentication required',
            [HTTP_STATUS.FORBIDDEN]: 'Access denied',
            [HTTP_STATUS.NOT_FOUND]: 'Resource not found',
            [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Server error'
        };

        return statusMessages[status] || 'An error occurred';
    }
}
