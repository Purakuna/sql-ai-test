import { Student } from "@/lib/models/Student";
import { 
    calculateFinalGrade,
    generateDiagramForScenario, 
    generateHintForSqlQuery, 
    generateInitialDataForScenario, 
    generateQueryPreviewForSqlQuery, 
    generateScenarioForTest,
    sendExamForEvaluation as sendExamForEvaluationService
} from "@/lib/services/GenerateExamService";
import { 
    getStudentExamByStudentId,
    saveStudentExam,
    getDataForStudentAndScenario,
    saveDataForStudentAndScenario,
    saveEvaluationResults
} from "@/lib/services/StudentService";
import { ExamAlreadyExistsError, NotFoundError } from "@/lib/error/ErrorHandler";
import { getSession } from "@/lib/session";
import { InitialDataTransformed } from "../models/InitialData";
import { SubmitQuery } from "../models/SubmitQuery";

export async function generateExam(student: Student) {
    
    const examExists = await getStudentExamByStudentId(student.studentId);
    if (examExists) {
        throw new ExamAlreadyExistsError("El estudiante ya tiene un examen");
    }
    const exam = await generateScenarioForTest();
    await saveStudentExam(student, exam);

    const session = await getSession();
    session.student = student;
    await session.save();

    return exam;
}

export async function getStudentExamByStudentInSession() {
    const session = await getSession();
    if (!session.student) {
        throw new NotFoundError("No se encontro estudiante en la sesion");
    }

    return await getStudentExamByStudentId(session.student?.studentId);
}

export async function getDiagramByStudentInSession() {
    const session = await getSession();
    if (!session.student) {
        throw new NotFoundError("No se encontro estudiante en la sesion");
    }

    const examFound = await getStudentExamByStudentId(session.student?.studentId);

    if (!examFound) {
        throw new NotFoundError("No se encontro examen");
    }

    return generateDiagramForScenario(examFound);
}

export async function generateScenarioDataByStudentInSession() {
    const session = await getSession();
    if (!session.student) {
        throw new NotFoundError("No se encontro estudiante en la sesion");
    }

    const examFound = await getStudentExamByStudentId(session.student?.studentId);

    if (!examFound) {
        throw new NotFoundError("No se encontro examen");
    }

    if (session.dataForScenarioLoaded) {
        return;
    }

    const data = await generateInitialDataForScenario(examFound);

    const mappedData: InitialDataTransformed = {
        tables: []
    };

    for (const tableObj of data.ts) {
        const table = tableObj.t;
        const rows: Record<string, string>[] = [];

        for (const row of tableObj.d) {
            const rowObj: Record<string, string> = {};
            for (const cell of row) {
                rowObj[cell.cn] = cell.cv;
            }
            rows.push(rowObj);
        }

        mappedData.tables.push({
            table,
            rows,
        });
    }
    
    await saveDataForStudentAndScenario(session.student?.studentId, mappedData);

    session.dataForScenarioLoaded = true;
    await session.save();
}

export async function generateHintForStudentInSession(requirement: string) {
    const session = await getSession();
    if (!session.student) {
        throw new NotFoundError("No se encontro estudiante en la sesion");
    }

    const examFound = await getStudentExamByStudentId(session.student?.studentId);

    if (!examFound) {
        throw new NotFoundError("No se encontro examen");
    }

    return generateHintForSqlQuery(examFound, requirement);
}

export async function generateQueryPreviewForStudentInSession(sqlQuery: string) {
    const session = await getSession();
    if (!session.student) {
        throw new NotFoundError("No se encontro estudiante en la sesion");
    }

    const examFound = await getStudentExamByStudentId(session.student?.studentId);

    if (!examFound) {
        throw new NotFoundError("No se encontro examen");
    }

    const data = await getDataForStudentAndScenario(session.student?.studentId);

    if (!data) {
        throw new NotFoundError("No se encontro data");
    }

    return generateQueryPreviewForSqlQuery(examFound, data, sqlQuery);
}

export async function sendExamForEvaluation(submitQuery: Record<string, string>) {
    const session = await getSession();
    if (!session.student) {
        throw new NotFoundError("No se encontro estudiante en la sesion");
    }

    const examFound = await getStudentExamByStudentId(session.student?.studentId);

    if (!examFound) {
        throw new NotFoundError("No se encontro examen");
    }

    const data = await getDataForStudentAndScenario(session.student?.studentId);

    if (!data) {
        throw new NotFoundError("No se encontro data");
    }

    // Validate if all submitQueries matches examFound questions
    examFound.questions.forEach((question) => {
        if (!submitQuery[question.id]) {
            throw new NotFoundError(`Falta responder la pregunta ${question.id}`);
        }
    });

    const submitQueryTransformed: SubmitQuery = {
        queries: examFound.questions.map((question) => ({
            questionId: question.id,
            requirement: question.requirement,
            query: submitQuery[question.id],
        })),
    };

    const evaluationResults = await sendExamForEvaluationService(examFound, data, submitQueryTransformed);

    const finalGrade = calculateFinalGrade(evaluationResults, examFound);

    evaluationResults.finalGrade = finalGrade;          

    await saveEvaluationResults(evaluationResults, submitQueryTransformed, session.student);

    return { evaluationResults, submitQuery: submitQueryTransformed };
}