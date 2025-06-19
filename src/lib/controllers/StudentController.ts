import { getSession } from "../session";
import { Student } from "../models/Student";

export async function getStudentInSession(): Promise<Student | null> {
    const session = await getSession();
    return session.student || null;
}
