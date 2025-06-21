import { generateExam, FormState } from './GenerateExamAction';
import { generateExam as generateExamController } from "@/lib/controllers/ExamController";
import { handleActionError } from "@/lib/error/ErrorHandler";
import { redirect } from "next/navigation";

jest.mock('@/lib/controllers/ExamController', () => ({
    generateExam: jest.fn(),
}));

jest.mock('@/lib/error/ErrorHandler', () => ({
    handleActionError: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
}));

const mockGenerateExamController = generateExamController as jest.Mock;
const mockHandleActionError = handleActionError as jest.Mock;
const mockRedirect = redirect as unknown as jest.Mock;

describe('generateExam', () => {
    let prevState: FormState;

    beforeEach(() => {
        jest.clearAllMocks();
        prevState = { message: "", error: false };
    });

    it('should return a validation error if studentId is missing', async () => {
        const formData = new FormData();
        formData.append('fullName', 'John Doe');

        const result = await generateExam(prevState, formData);

        expect(result.error).toBe(true);
        expect(result.message).toBe("El número de estudiante es requerido.");
        expect(mockGenerateExamController).not.toHaveBeenCalled();
        expect(mockRedirect).not.toHaveBeenCalled();
    });

    it('should return a validation error if fullName is missing', async () => {
        const formData = new FormData();
        formData.append('studentId', '12345');

        const result = await generateExam(prevState, formData);

        expect(result.error).toBe(true);
        expect(result.message).toBe("El nombre completo es requerido.");
        expect(mockGenerateExamController).not.toHaveBeenCalled();
        expect(mockRedirect).not.toHaveBeenCalled();
    });

    it('should call the controller and redirect on successful validation', async () => {
        const formData = new FormData();
        formData.append('studentId', '12345');
        formData.append('fullName', 'John Doe');
        
        mockGenerateExamController.mockResolvedValue(undefined);

        await generateExam(prevState, formData);
        
        expect(mockGenerateExamController).toHaveBeenCalledWith({
            studentId: '12345',
            fullName: 'John Doe',
        });
        expect(mockRedirect).toHaveBeenCalledWith('/');
        expect(mockHandleActionError).not.toHaveBeenCalled();
    });

    it('should handle errors from the controller and return an error state', async () => {
        const formData = new FormData();
        formData.append('studentId', '12345');
        formData.append('fullName', 'John Doe');

        const controllerError = new Error('Failed to generate');
        const handledError = { message: 'Error del sistema al generar el examen.' };

        mockGenerateExamController.mockRejectedValue(controllerError);
        mockHandleActionError.mockReturnValue(handledError);

        const result = await generateExam(prevState, formData);

        expect(mockGenerateExamController).toHaveBeenCalledWith({
            studentId: '12345',
            fullName: 'John Doe',
        });
        expect(mockHandleActionError).toHaveBeenCalledWith(controllerError);
        expect(mockRedirect).not.toHaveBeenCalled();
        expect(result.error).toBe(true);
        expect(result.message).toBe(handledError.message);
    });
});
