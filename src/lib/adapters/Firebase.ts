import admin from "firebase-admin";
import { Exam } from "@/lib/models/Exam";
import { Student } from "@/lib/models/Student";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string) as admin.ServiceAccount),
    });
}

const db = admin.firestore();

type ExamInFirebase = {
    scenario: string;
    tables: string[];
    questions: string[];
    studentId: string;
    studentName: string;
    createdAt: admin.firestore.FieldValue;
}

export const saveExamToFirebase = async (exam: Exam, student: Student) => {
    const docRef = db.collection("exams").doc(student.studentId);
    await docRef.set({
        ...exam,
        studentId: student.studentId,
        studentName: student.fullName,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
};

export const getStudentExamByStudentId = async (studentId: string) => {
    const docRef = db.collection("exams").doc(studentId);
    const doc = await docRef.get();
    if (!doc.exists) {
        return null;
    }
    return doc.data() as ExamInFirebase;
};
