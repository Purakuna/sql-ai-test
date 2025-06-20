import { Student } from "../models/Student";
import { Exam } from "../models/Exam";
import { saveExamToFirebase } from "../adapters/Firebase";
import { ExamAlreadyExistsError } from "../error/ErrorHandler";
import { 
    saveDataForStudentAndScenario as saveDataForStudentAndScenarioInFirebase, 
    getDataForStudentAndScenario as getDataForStudentAndScenarioInFirebase,
    getStudentExamByStudentId as getStudentExamByStudentIdFromFirebase
} from "../adapters/Firebase";
import { InitialDataTransformed } from "../models/InitialData";

export async function getStudentExamByStudentId(studentId: string) {
    const rawExam = await getStudentExamByStudentIdFromFirebase(studentId);

    if (!rawExam) {
        return null;
    }

    return {
        ...rawExam,
        createdAt: rawExam.createdAt.toDate(),
    }
}

export async function saveStudentExam(student: Student, exam: Exam) {
    
    const examInFirebase = await getStudentExamByStudentId(student.studentId);
    if (examInFirebase) {
        throw new ExamAlreadyExistsError("Student exam already exists");
    }
    await saveExamToFirebase(exam, student);
}

export async function saveDataForStudentAndScenario(studentId: string, data: InitialDataTransformed) {
    await saveDataForStudentAndScenarioInFirebase(studentId, data);
}

export async function getDataForStudentAndScenario(studentId: string) {
    const data = await getDataForStudentAndScenarioInFirebase(studentId);
    if (!data) {
        return null;
    }
    return data;
}