import admin from "firebase-admin";
import { Exam } from "@/shared/models/Exam";
import { Student } from "@/lib/models/Student";
import { InitialDataTransformed } from "@/lib/models/InitialData";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string) as admin.ServiceAccount),
    });
}

const db = admin.firestore();

interface ExamInFirebase extends Exam {
    studentId: string;
    studentName: string;
    createdAt: admin.firestore.Timestamp;
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

export const saveDataForStudentAndScenario = async (studentId: string, data: InitialDataTransformed) => {
    const docRef = db.collection("data-for-student-scenario").doc(studentId);
    await docRef.set({
        data,
        studentId: studentId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
};

export const getDataForStudentAndScenario = async (studentId: string) => {
    const docRef = db.collection("data-for-student-scenario").doc(studentId);
    const doc = await docRef.get();
    if (!doc.exists) {
        return null;
    }
    if (!doc.data()?.data) {
        return null;
    }
    return doc.data()?.data as InitialDataTransformed;
};

