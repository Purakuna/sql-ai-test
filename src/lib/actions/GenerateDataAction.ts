"use server";

import { generateScenarioDataByStudentInSession } from "@/lib/controllers/ExamController";
import { handleActionError } from "@/lib/error/ErrorHandler";

export type FormState = {
    message: string;
    error: boolean;
};

export async function generateData(): Promise<FormState> {
    try {
        await generateScenarioDataByStudentInSession();

        return { message: "Datos generados correctamente", error: false };
    } catch (error) {
        const errorDetails = handleActionError(error);
        return { message: errorDetails.message, error: true };
    }
}