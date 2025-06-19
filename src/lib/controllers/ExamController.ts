import { Student } from "@/lib/models/Student";
import { generateScenarioForTest } from "@/lib/services/GenerateExamService";
import { getStudentExamByStudentId, saveStudentExam } from "@/lib/services/StudentService";
import { ExamAlreadyExistsError } from "@/lib/error/ErrorHandler";
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
