import { Student } from "@/lib/models/Student";
import { 
    generateDiagramForScenario, 
    generateHintForSqlQuery, 
    generateInitialDataForScenario, 
    generateQueryPreviewForSqlQuery, 
    generateScenarioForTest 
} from "@/lib/services/GenerateExamService";
import { 
    getStudentExamByStudentId,
    saveStudentExam,
    getDataForStudentAndScenario,
    saveDataForStudentAndScenario
} from "@/lib/services/StudentService";
import { ExamAlreadyExistsError, NotFoundError } from "@/lib/error/ErrorHandler";
import { getSession } from "@/lib/session";
import { InitialDataTransformed } from "../models/InitialData";

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