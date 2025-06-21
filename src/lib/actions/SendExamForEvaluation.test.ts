import { sendExamForEvaluation, FormState } from './SendExamForEvaluation';
import { sendExamForEvaluation as sendExamForEvaluationController } from "@/lib/controllers/ExamController";
import { handleActionError } from "@/lib/error/ErrorHandler";
import { formDataToStringRecord } from "@/shared/util/object";
import { revalidatePath } from "next/cache";

jest.mock('@/lib/controllers/ExamController', () => ({
    sendExamForEvaluation: jest.fn(),
}));

jest.mock('@/lib/error/ErrorHandler', () => ({
    handleActionError: jest.fn(),
}));

jest.mock('@/shared/util/object', () => ({
    formDataToStringRecord: jest.fn(),
}));

jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
}));

const mockSendExamController = sendExamForEvaluationController as jest.Mock;
const mockHandleActionError = handleActionError as jest.Mock;
const mockFormDataToStringRecord = formDataToStringRecord as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;

describe('sendExamForEvaluation', () => {
    let prevState: FormState;
    let formData: FormData;

    beforeEach(() => {
        jest.clearAllMocks();
        prevState = { evaluationResults: null, submitQuery: null, error: null };
        formData = new FormData();
        formData.append('question1', 'answer1');
    });

    it('should successfully process the form and return evaluation results', async () => {
        const mockQueries = { question1: 'answer1' };
        const mockControllerResult = {
            evaluationResults: { score: 95, feedback: "Great job!" },
            submitQuery: { question1: 'answer1' },
        };

        mockFormDataToStringRecord.mockReturnValue(mockQueries);
        mockSendExamController.mockResolvedValue(mockControllerResult);

        const result = await sendExamForEvaluation(prevState, formData);

        expect(mockFormDataToStringRecord).toHaveBeenCalledWith(formData);
        expect(mockSendExamController).toHaveBeenCalledWith(mockQueries);
        expect(mockRevalidatePath).toHaveBeenCalledWith("/");
        expect(result).toEqual({
            ...mockControllerResult,
            error: null,
        });
    });

    it('should return an error if formData cannot be processed', async () => {
        mockFormDataToStringRecord.mockReturnValue(null);

        const result = await sendExamForEvaluation(prevState, formData);

        expect(mockSendExamController).not.toHaveBeenCalled();
        expect(mockRevalidatePath).not.toHaveBeenCalled();
        expect(result).toEqual({
            evaluationResults: null,
            submitQuery: null,
            error: "Error al enviar el examen para evaluación.",
        });
    });

    it('should handle errors thrown by the controller', async () => {
        const mockQueries = { question1: 'answer1' };
        const error = new Error("Controller failed");
        const handledError = { message: "Ocurrió un error en el controlador." };

        mockFormDataToStringRecord.mockReturnValue(mockQueries);
        mockSendExamController.mockRejectedValue(error);
        mockHandleActionError.mockReturnValue(handledError);

        const result = await sendExamForEvaluation(prevState, formData);

        expect(mockSendExamController).toHaveBeenCalledWith(mockQueries);
        expect(mockHandleActionError).toHaveBeenCalledWith(error);
        expect(mockRevalidatePath).not.toHaveBeenCalled();
        expect(result).toEqual({
            evaluationResults: null,
            submitQuery: null,
            error: handledError.message,
        });
    });
});
