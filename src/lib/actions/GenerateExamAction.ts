/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { generateExam as generateExamController } from "@/lib/controllers/ExamController";
import { z } from "zod/v4";
import { handleActionError } from "@/lib/error/ErrorHandler";
import { redirect } from "next/navigation";

const schema = z.object({
  studentId: z.string("El número de estudiante es requerido.").min(1, "El número de estudiante es requerido."),
  fullName: z.string("El nombre completo es requerido.").min(1, "El nombre completo es requerido."),
});

export type FormState = {
    message: string;
    error: boolean;
};

export async function generateExam(
    prevState: FormState, 
    formData: FormData
): Promise<FormState> {
    
    const validatedFields = schema.safeParse({
        studentId: formData.get("studentId"),
        fullName: formData.get("fullName"),
    });

    if (!validatedFields.success) {
        return {
            message: validatedFields.error.flatten().fieldErrors.fullName?.[0] || validatedFields.error.flatten().fieldErrors.studentId?.[0] || "Error de validación.",
            error: true,
        };
    }

    const { studentId, fullName } = validatedFields.data;

    try {
        console.log("Generando examen para:", { studentId, fullName });

        await generateExamController({ studentId, fullName });

    } catch (error: any) {
        const errorDetails = handleActionError(error);
        console.error("Error al generar el examen:", error);
        return {
            message: errorDetails.message,
            error: true,
        };
    }

    redirect("/");
}
