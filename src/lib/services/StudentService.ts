import { Student } from "../models/Student";
import { Exam } from "../models/Exam";
import { saveExamToFirebase } from "../adapters/Firebase";
import { getStudentExamByStudentId as getStudentExamByStudentIdFromFirebase } from "../adapters/Firebase";
import { ExamAlreadyExistsError } from "../error/ErrorHandler";


export async function getStudentExamByStudentId(studentId: string) {
    return await getStudentExamByStudentIdFromFirebase(studentId);
}

export async function saveStudentExam(student: Student, exam: Exam) {
    
    const examInFirebase = await getStudentExamByStudentId(student.studentId);
    if (examInFirebase) {
        throw new ExamAlreadyExistsError("Student exam already exists");
    }
    await saveExamToFirebase(exam, student);
}
