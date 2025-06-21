import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { LightExam } from "@/shared/models/Exam";
import { Student } from "@/lib/models/Student";

const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET as string,
    cookieName: "mysql-ai-test",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};


export interface Session {
    student?: Student;
    exam?: LightExam;
    dataForScenarioLoaded?: boolean;
}

export async function getSession() {
    return getIronSession<Session>(await cookies(), sessionOptions);
}