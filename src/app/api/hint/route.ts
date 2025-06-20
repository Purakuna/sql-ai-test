import { generateHintForStudentInSession } from "@/lib/controllers/ExamController";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/error/ErrorHandler";

export async function GET(request: NextRequest) {
    try {
    const searchParams = request.nextUrl.searchParams;
    const requirement = searchParams.get("requirement");
    if (!requirement) {
        return NextResponse.json({ error: "No se encontro requisito" }, { status: 400 });
    }
    const hint = await generateHintForStudentInSession(requirement);
    return NextResponse.json(hint);
    } catch (error) {
        return handleApiError(error);
    }
}
