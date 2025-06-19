import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/error/ErrorHandler";
import { getInitialDataByStudentInSession } from "@/lib/controllers/ExamController";

export async function GET() {
    try {
        const initialData = await getInitialDataByStudentInSession();

        return NextResponse.json(initialData);
    } catch (error) {
        return handleApiError(error);
    }
}
