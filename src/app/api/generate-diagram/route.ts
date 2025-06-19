import { handleApiError } from "@/lib/error/ErrorHandler";
import { getDiagramByStudentInSession } from "@/lib/controllers/ExamController";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const diagram = await getDiagramByStudentInSession();

        return NextResponse.json(diagram);
    } catch (error) {
        return handleApiError(error);
    }
}
