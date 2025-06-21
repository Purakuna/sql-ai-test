import { Student } from "@/lib/models/Student";
import { Exam } from "@/shared/models/Exam";
import { saveExamToFirebase } from "@/lib/adapters/Firebase";
import { ExamAlreadyExistsError } from "@/lib/error/ErrorHandler";
import { 
    saveDataForStudentAndScenario as saveDataForStudentAndScenarioInFirebase, 
    getDataForStudentAndScenario as getDataForStudentAndScenarioInFirebase,
    getStudentExamByStudentId as getStudentExamByStudentIdFromFirebase,
    saveEvaluationResultsToFirebase
} from "@/lib/adapters/Firebase";
import { InitialDataTransformed } from "@/lib/models/InitialData";
import { EvaluationResults } from "@/lib/models/EvaluationResults";
import { SubmitQuery } from "@/lib/models/SubmitQuery";

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

export async function saveEvaluationResults(evaluationResults: EvaluationResults, submitQuery: SubmitQuery, student: Student) {
    await saveEvaluationResultsToFirebase(evaluationResults, submitQuery, student);
}