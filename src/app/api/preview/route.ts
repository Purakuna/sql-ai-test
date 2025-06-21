import { NextRequest, NextResponse } from "next/server";
import { generateQueryPreviewForStudentInSession } from "@/lib/controllers/ExamController";
import { handleApiError } from "@/lib/error/ErrorHandler";

export async function POST(request: NextRequest) {
    try {
    const body = await request.json();
    const sqlQuery = body.sqlQuery;
    if (!sqlQuery) {
        return NextResponse.json({ error: "No se encontro consulta" }, { status: 400 });
    }
    const preview = await generateQueryPreviewForStudentInSession(sqlQuery);
    return NextResponse.json(preview);
    } catch (error) {
        return handleApiError(error);
    }
}
