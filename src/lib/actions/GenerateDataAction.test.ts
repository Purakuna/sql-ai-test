import { generateData } from './GenerateDataAction';
import { generateScenarioDataByStudentInSession } from "@/lib/controllers/ExamController";
import { handleActionError } from "@/lib/error/ErrorHandler";

jest.mock('@/lib/controllers/ExamController', () => ({
    generateScenarioDataByStudentInSession: jest.fn(),
}));

jest.mock('@/lib/error/ErrorHandler', () => ({
    handleActionError: jest.fn(),
}));

const mockGenerateScenario = generateScenarioDataByStudentInSession as jest.Mock;
const mockHandleActionError = handleActionError as jest.Mock;

describe('generateData', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a success message when data generation is successful', async () => {
        mockGenerateScenario.mockResolvedValue(undefined);

        const result = await generateData();

        expect(mockGenerateScenario).toHaveBeenCalledTimes(1);
        expect(mockHandleActionError).not.toHaveBeenCalled();
        expect(result).toEqual({
            message: "Datos generados correctamente",
            error: false,
        });
    });

    it('should return an error message when data generation fails', async () => {
        const mockError = new Error('Database connection failed');
        const handledError = { message: 'Error de base de datos' };

        mockGenerateScenario.mockRejectedValue(mockError);
        mockHandleActionError.mockReturnValue(handledError);

        const result = await generateData();

        expect(mockGenerateScenario).toHaveBeenCalledTimes(1);
        expect(mockHandleActionError).toHaveBeenCalledWith(mockError);
        expect(result).toEqual({
            message: handledError.message,
            error: true,
        });
    });
});
