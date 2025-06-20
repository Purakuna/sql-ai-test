import { NextRequest, NextResponse } from "next/server";
import { generateQueryPreviewForStudentInSession } from "@/lib/controllers/ExamController";
import { handleApiError } from "@/lib/error/ErrorHandler";

export async function GET(request: NextRequest) {
    try {
    const searchParams = request.nextUrl.searchParams;
    const sqlQuery = searchParams.get("sqlQuery");
    if (!sqlQuery) {
        return NextResponse.json({ error: "No se encontro consulta" }, { status: 400 });
    }
    const preview = await generateQueryPreviewForStudentInSession(sqlQuery);
    return NextResponse.json(preview);
    } catch (error) {
        return handleApiError(error);
    }
}
