import { Student } from "@/lib/models/Student";
import { generateDiagramForScenario, generateInitialDataForScenario, generateScenarioForTest } from "@/lib/services/GenerateExamService";
import { getStudentExamByStudentId, saveStudentExam } from "@/lib/services/StudentService";
import { ExamAlreadyExistsError, NotFoundError } from "@/lib/error/ErrorHandler";
import { getSession } from "@/lib/session";

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

export async function getInitialDataByStudentInSession() {
    const session = await getSession();
    if (!session.student) {
        throw new NotFoundError("No se encontro estudiante en la sesion");
    }

    const examFound = await getStudentExamByStudentId(session.student?.studentId);

    if (!examFound) {
        throw new NotFoundError("No se encontro examen");
    }

    return generateInitialDataForScenario(examFound);
}
