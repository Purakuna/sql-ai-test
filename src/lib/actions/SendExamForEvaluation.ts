"use server";

import { sendExamForEvaluation as sendExamForEvaluationController } from "@/lib/controllers/ExamController";
import { EvaluationResults } from "@/lib/models/EvaluationResults";
import { handleActionError } from "@/lib/error/ErrorHandler";
import { formDataToStringRecord } from "@/shared/util/object";

export type FormState = {
    evaluationResults: EvaluationResults | null;
    error: string | null;
};

export async function sendExamForEvaluation(prevState: FormState, formData: FormData): Promise<FormState> {

    const queries = formDataToStringRecord(formData);

    if (!queries) {
        return {
            evaluationResults: null,
            error: "Error al enviar el examen para evaluación.",
        };
    }

    try {
        const evaluationResults = await sendExamForEvaluationController(queries);

        return {
            evaluationResults,
            error: null,
        };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        const errorDetails = handleActionError(error);
        console.error("Error al enviar el examen para evaluación:", error);
        return {
            evaluationResults: null,
            error: errorDetails.message,
        };
    }
}

