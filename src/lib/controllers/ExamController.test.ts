import { 
    generateExam, 
    getStudentExamByStudentInSession, 
    getDiagramByStudentInSession, 
    generateScenarioDataByStudentInSession,
    generateHintForStudentInSession,
    generateQueryPreviewForStudentInSession,
    sendExamForEvaluation
} from './ExamController';
import * as GenerateExamService from '@/lib/services/GenerateExamService';
import * as StudentService from '@/lib/services/StudentService';
import { getSession, Session } from '@/lib/session';
import { ExamAlreadyExistsError, NotFoundError } from '@/lib/error/ErrorHandler';
import { Exam } from '@/shared/models/Exam';
import { Student } from '@/lib/models/Student';
import { type IronSession } from 'iron-session';

jest.mock('@/lib/services/GenerateExamService');
jest.mock('@/lib/services/StudentService');
jest.mock('@/lib/session', () => ({
    getSession: jest.fn(),
}));

const mockGetStudentExamByStudentId = StudentService.getStudentExamByStudentId as jest.Mock;
const mockSaveStudentExam = StudentService.saveStudentExam as jest.Mock;
const mockGetDataForStudentAndScenario = StudentService.getDataForStudentAndScenario as jest.Mock;
const mockSaveDataForStudentAndScenario = StudentService.saveDataForStudentAndScenario as jest.Mock;
const mockSaveEvaluationResults = StudentService.saveEvaluationResults as jest.Mock;

const mockGenerateScenarioForTest = GenerateExamService.generateScenarioForTest as jest.Mock;
const mockGenerateDiagramForScenario = GenerateExamService.generateDiagramForScenario as jest.Mock;
const mockGenerateInitialDataForScenario = GenerateExamService.generateInitialDataForScenario as jest.Mock;
const mockGenerateHintForSqlQuery = GenerateExamService.generateHintForSqlQuery as jest.Mock;
const mockGenerateQueryPreviewForSqlQuery = GenerateExamService.generateQueryPreviewForSqlQuery as jest.Mock;
const mockSendExamForEvaluationService = GenerateExamService.sendExamForEvaluation as jest.Mock;
const mockCalculateFinalGrade = GenerateExamService.calculateFinalGrade as jest.Mock;

const mockGetSession = getSession as jest.Mock;

describe('ExamController', () => {

    let mockStudent: Student;
    let mockExam: Exam;
    let mockSession: IronSession<Session>;

    beforeEach(() => {
        mockStudent = { studentId: '123', fullName: 'Test Student' };
        mockExam = { 
            scenario: 'scenario',
            tables: [], 
            questions: [
                { id: 'q1', requirement: 'req1', title: 'title1', prompt: 'prompt1', points: 1 }, 
                { id: 'q2', requirement: 'req2', title: 'title2', prompt: 'prompt2', points: 2 }
            ]
        };
        mockSession = {
            student: mockStudent,
            dataForScenarioLoaded: false,
            save: jest.fn(),
            destroy: jest.fn(),
            updateConfig: jest.fn(),
        };
        jest.clearAllMocks();
        mockGetSession.mockResolvedValue(mockSession);
    });

    describe('generateExam', () => {
        it('should generate and save an exam if one does not exist', async () => {
            mockGetStudentExamByStudentId.mockResolvedValue(null);
            mockGenerateScenarioForTest.mockResolvedValue(mockExam);

            const result = await generateExam(mockStudent);

            expect(mockGetStudentExamByStudentId).toHaveBeenCalledWith(mockStudent.studentId);
            expect(mockGenerateScenarioForTest).toHaveBeenCalled();
            expect(mockSaveStudentExam).toHaveBeenCalledWith(mockStudent, mockExam);
            expect(mockSession.save).toHaveBeenCalled();
            expect(result).toEqual(mockExam);
        });

        it('should throw ExamAlreadyExistsError if an exam already exists', async () => {
            mockGetStudentExamByStudentId.mockResolvedValue(mockExam);
            await expect(generateExam(mockStudent)).rejects.toThrow(ExamAlreadyExistsError);
        });
    });

    describe('getStudentExamByStudentInSession', () => {
        it('should return exam for student in session', async () => {
            mockGetStudentExamByStudentId.mockResolvedValue(mockExam);
            const result = await getStudentExamByStudentInSession();
            expect(mockGetStudentExamByStudentId).toHaveBeenCalledWith(mockStudent.studentId);
            expect(result).toEqual(mockExam);
        });

        it('should throw NotFoundError if no student in session', async () => {
            mockGetSession.mockResolvedValueOnce({ student: null });
            await expect(getStudentExamByStudentInSession()).rejects.toThrow(NotFoundError);
        });
    });

    describe('getDiagramByStudentInSession', () => {
        it('should return a diagram for the student exam', async () => {
            const diagramUrl = 'mermaid diagram mock <CODE>';
            mockGetStudentExamByStudentId.mockResolvedValue(mockExam);
            mockGenerateDiagramForScenario.mockResolvedValue(diagramUrl);

            const result = await getDiagramByStudentInSession();

            expect(mockGetStudentExamByStudentId).toHaveBeenCalledWith(mockStudent.studentId);
            expect(mockGenerateDiagramForScenario).toHaveBeenCalledWith(mockExam);
            expect(result).toBe(diagramUrl);
        });

        it('should throw NotFoundError if no exam is found', async () => {
            mockGetStudentExamByStudentId.mockResolvedValue(null);
            await expect(getDiagramByStudentInSession()).rejects.toThrow(NotFoundError);
        });
    });

    describe('generateScenarioDataByStudentInSession', () => {
        const rawData = { ts: [{ t: 'users', d: [[{ cn: 'id', cv: '1' }]] }] };
        
        it('should generate, transform, and save data if not loaded', async () => {
            mockGetStudentExamByStudentId.mockResolvedValue(mockExam);
            mockGenerateInitialDataForScenario.mockResolvedValue(rawData);

            await generateScenarioDataByStudentInSession();

            expect(mockGenerateInitialDataForScenario).toHaveBeenCalledWith(mockExam);
            expect(mockSaveDataForStudentAndScenario).toHaveBeenCalledWith(mockStudent.studentId, expect.any(Object));
            expect(mockSession.save).toHaveBeenCalled();
        });

        it('should do nothing if data is already loaded', async () => {
            mockGetSession.mockResolvedValueOnce({ ...mockSession, dataForScenarioLoaded: true });
            mockGetStudentExamByStudentId.mockResolvedValue(mockExam);

            await generateScenarioDataByStudentInSession();

            expect(mockGenerateInitialDataForScenario).not.toHaveBeenCalled();
            expect(mockSaveDataForStudentAndScenario).not.toHaveBeenCalled();
        });
    });
    
    describe('generateHintForStudentInSession', () => {
        it('should return a hint for a given requirement', async () => {
            const requirement = 'Select all users';
            const hint = 'Selecciona todos los usuarios';
            mockGetStudentExamByStudentId.mockResolvedValue(mockExam);
            mockGenerateHintForSqlQuery.mockResolvedValue(hint);
            
            const result = await generateHintForStudentInSession(requirement);
            
            expect(mockGenerateHintForSqlQuery).toHaveBeenCalledWith(mockExam, requirement);
            expect(result).toBe(hint);
        });
    });

    describe('generateQueryPreviewForStudentInSession', () => {
        const mockDbData = { tables: [] };
        const mockPreview = { columns: ['id'], rows: [['1']] };
        
        it('should return a query preview', async () => {
            const sqlQuery = 'SELECT id FROM users;';
            mockGetStudentExamByStudentId.mockResolvedValue(mockExam);

            mockGetDataForStudentAndScenario.mockResolvedValue(mockDbData);
            mockGenerateQueryPreviewForSqlQuery.mockResolvedValue(mockPreview);
            
            const result = await generateQueryPreviewForStudentInSession(sqlQuery);
            
            expect(mockGenerateQueryPreviewForSqlQuery).toHaveBeenCalledWith(mockExam, mockDbData, sqlQuery);
            expect(result).toEqual(mockPreview);
        });

        it('should throw NotFoundError if no scenario data is found', async () => {
            mockGetStudentExamByStudentId.mockResolvedValue(mockExam);
            mockGetDataForStudentAndScenario.mockResolvedValue(null);
            await expect(generateQueryPreviewForStudentInSession('query')).rejects.toThrow(NotFoundError);
        });
    });

    describe('sendExamForEvaluation', () => {
        const submitQuery = { q1: 'SELECT 1', q2: 'SELECT 2' };
        const mockDbData = { tables: [] };
        const mockEvaluation = { finalGrade: 0, results: [] };

        it('should process and save a valid exam submission', async () => {
            mockGetStudentExamByStudentId.mockResolvedValue(mockExam);
            mockGetDataForStudentAndScenario.mockResolvedValue(mockDbData);
            mockSendExamForEvaluationService.mockResolvedValue(mockEvaluation);
            mockCalculateFinalGrade.mockReturnValue(95);

            const result = await sendExamForEvaluation(submitQuery);

            expect(mockSendExamForEvaluationService).toHaveBeenCalled();
            expect(mockCalculateFinalGrade).toHaveBeenCalledWith(mockEvaluation, mockExam);
            expect(mockSaveEvaluationResults).toHaveBeenCalledWith(
                { ...mockEvaluation, finalGrade: 95 }, 
                expect.any(Object), 
                mockStudent
            );
            expect(result.evaluationResults.finalGrade).toBe(95);
        });

        it('should throw NotFoundError if a question is missing from the submission', async () => {
            const incompleteSubmitQuery = { q1: 'SELECT 1' };
            mockGetStudentExamByStudentId.mockResolvedValue(mockExam);
            mockGetDataForStudentAndScenario.mockResolvedValue(mockDbData);
            
            await expect(sendExamForEvaluation(incompleteSubmitQuery)).rejects.toThrow(NotFoundError);
        });
    });
});
