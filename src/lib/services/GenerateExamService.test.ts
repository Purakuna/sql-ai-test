import {
    generateQuestionsToBuild,
    generateScenarioForTest,
    setExamInSession,
    generateInitialDataForScenario,
    generateDiagramForScenario,
    generateHintForSqlQuery,
    generateQueryPreviewForSqlQuery,
    sendExamForEvaluation,
    calculateFinalGrade
} from './GenerateExamService';
import { generateAsJson } from '@/lib/adapters/Gemini';
import { getSession } from '@/lib/session';
import { NotFoundError } from '../error/ErrorHandler';
import { Exam } from '@/shared/models/Exam';
import { EvaluationResults } from '@/lib/models/EvaluationResults';

jest.mock('@/lib/adapters/Gemini', () => ({
    generateAsJson: jest.fn(),
}));

jest.mock('@/lib/session', () => ({
    getSession: jest.fn(),
}));

const mockGenerateAsJson = generateAsJson as jest.Mock;
const mockGetSession = getSession as jest.Mock;

describe('GenerateExamService', () => {

    let mockExam: Exam;

    beforeEach(() => {
        mockExam = {
            scenario: 'Test Scenario',
            tables: [{ tableName: 'users', columns: [{ columnName: 'id', dataType: 'int', description: 'ID' }, { columnName: 'name', dataType: 'varchar', description: 'Name' }] }],
            questions: [{ id: 'q1', requirement: 'Select all users', points: 1, title: 'q1', prompt: 'p1' }],
        };
        jest.clearAllMocks();
        mockGenerateAsJson.mockResolvedValue({ text: JSON.stringify({ success: true }) });
    });

    describe('generateQuestionsToBuild', () => {
        it('should return a non-empty array of questions', () => {
            const questions = generateQuestionsToBuild();
            expect(Array.isArray(questions)).toBe(true);
            expect(questions.length).toBeGreaterThan(0);
            expect(questions[0]).toHaveProperty('instructions');
            expect(questions[0]).toHaveProperty('points');
        });
    });

    describe('generateScenarioForTest', () => {
        it('should call generateAsJson and parse the result', async () => {
            mockGenerateAsJson.mockResolvedValue({ text: JSON.stringify(mockExam) });
            const result = await generateScenarioForTest();
            expect(mockGenerateAsJson).toHaveBeenCalledWith(expect.any(String), expect.any(Object), expect.any(String));
            expect(result).toEqual(mockExam);
        });

        it('should throw an error if no content is generated', async () => {
            mockGenerateAsJson.mockResolvedValue({ text: null });
            await expect(generateScenarioForTest()).rejects.toThrow('No se genero contenido');
        });
    });

    describe('setExamInSession', () => {
        it('should get session, set exam data, and save', async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mockSession = { exam: null, save: jest.fn() } as any;
            mockGetSession.mockResolvedValue(mockSession);
            
            await setExamInSession(mockExam);

            expect(mockGetSession).toHaveBeenCalled();
            expect(mockSession.exam).toBeDefined();
            expect(mockSession.exam?.scenario).toBe(mockExam.scenario);
            expect(mockSession.exam?.questions[0]).not.toHaveProperty('points');
            expect(mockSession.save).toHaveBeenCalled();
        });
    });

    describe('generateInitialDataForScenario', () => {
        it('should throw NotFoundError if exam is not provided', async () => {
            await expect(generateInitialDataForScenario(undefined)).rejects.toThrow(NotFoundError);
        });
        
        it('should call generateAsJson and return parsed data', async () => {
            const mockData = { ts: [] };
            mockGenerateAsJson.mockResolvedValue({ text: JSON.stringify(mockData) });
            const result = await generateInitialDataForScenario(mockExam);
            expect(mockGenerateAsJson).toHaveBeenCalled();
            expect(result).toEqual(mockData);
        });
    });

    describe('generateDiagramForScenario', () => {
        it('should throw NotFoundError if exam is not provided', async () => {
            await expect(generateDiagramForScenario(undefined)).rejects.toThrow(NotFoundError);
        });

        it('should generate a diagram and return it', async () => {
            const mockDiagram = { diagram: '<svg>...</svg>' };
            mockGenerateAsJson.mockResolvedValue({ text: JSON.stringify(mockDiagram) });
            const result = await generateDiagramForScenario(mockExam);
            expect(mockGenerateAsJson).toHaveBeenCalled();
            expect(result).toEqual(mockDiagram);
        });
    });

    describe('generateHintForSqlQuery', () => {
        it('should throw NotFoundError if exam is not provided', async () => {
            await expect(generateHintForSqlQuery(undefined, 'req')).rejects.toThrow(NotFoundError);
        });

        it('should generate a hint and return it', async () => {
            const mockHint = { hint: 'SELECT * FROM users' };
            mockGenerateAsJson.mockResolvedValue({ text: JSON.stringify(mockHint) });
            const result = await generateHintForSqlQuery(mockExam, 'Select all users');
            expect(mockGenerateAsJson).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Object),
                expect.stringContaining('Select all users')
            );
            expect(result).toEqual(mockHint);
        });
    });

    describe('generateQueryPreviewForSqlQuery', () => {
        const mockData = { tables: [] };
        const mockQuery = 'SELECT * FROM users';

        it('should generate a preview using gemini-2.5-flash', async () => {
            const mockPreview = { status: 'success', headers: ['id'], rows: [['1']]};
            mockGenerateAsJson.mockResolvedValue({ text: JSON.stringify(mockPreview) });
            const result = await generateQueryPreviewForSqlQuery(mockExam, mockData, mockQuery);
            expect(mockGenerateAsJson).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Object),
                expect.stringContaining(mockQuery),
                "gemini-2.5-flash"
            );
            expect(result).toEqual(mockPreview);
        });
    });

    describe('sendExamForEvaluation', () => {
        const mockData = { tables: [] };
        const mockSubmitQuery = { queries: [] };

        it('should send exam data for evaluation using gemini-2.5-flash', async () => {
            const mockEvaluation = { questions: [] };
            mockGenerateAsJson.mockResolvedValue({ text: JSON.stringify(mockEvaluation) });
            const result = await sendExamForEvaluation(mockExam, mockData, mockSubmitQuery);
             expect(mockGenerateAsJson).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Object),
                expect.any(String),
                "gemini-2.5-flash"
            );
            expect(result).toEqual(mockEvaluation);
        });
    });

    describe('calculateFinalGrade', () => {
        const fullExam: Exam = {
            scenario: 'Test',
            tables: [],
            questions: [
                { id: 'q1', requirement: 'req1', points: 1, title: 'q1', prompt: 'p1' },
                { id: 'q2', requirement: 'req2', points: 1, title: 'q2', prompt: 'p2' },
                { id: 'q3', requirement: 'req3', points: 0.5, title: 'q3', prompt: 'p3' },
            ],
        };

        it('should correctly calculate the final grade', () => {
            const evaluation: EvaluationResults = {
                finalGrade: 0,
                questions: [
                    { id: 'q1', finalGrade: 100, feedback: 'feedback1', isValid: true }, // 1 * 1 = 1 point
                    { id: 'q2', finalGrade: 80, feedback: 'feedback2', isValid: true },  // 0.8 * 1 = 0.8 points
                    { id: 'q3', finalGrade: 50, feedback: 'feedback3', isValid: true },  // 0.5 * 0.5 = 0.25 points
                ],
            };
            // Total = 1 + 0.8 + 0.25 = 2.05
            const finalGrade = calculateFinalGrade(evaluation, fullExam);
            expect(finalGrade).toBe(2.05);
        });

        it('should handle missing questions in evaluation gracefully', () => {
             const evaluation: EvaluationResults = {
                finalGrade: 0,
                questions: [
                    { id: 'q1', finalGrade: 100, feedback: 'feedback1', isValid: true }, // 1 * 1 = 1 point
                    // q2 is missing
                    { id: 'q3', finalGrade: 100, feedback: 'feedback3', isValid: true }, // 1 * 0.5 = 0.5 points
                ],
            };
            // Total = 1 + 0.5 = 1.5
            const finalGrade = calculateFinalGrade(evaluation, fullExam);
            expect(finalGrade).toBe(1.5);
        });

        it('should return 0 if no questions match', () => {
             const evaluation: EvaluationResults = {
                finalGrade: 0,
                questions: [
                    { id: 'q99', finalGrade: 100, feedback: 'feedback99', isValid: true },
                ],
            };
            const finalGrade = calculateFinalGrade(evaluation, fullExam);
            expect(finalGrade).toBe(0);
        });
    });
});
