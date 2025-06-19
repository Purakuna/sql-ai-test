import { handleApiError } from "@/lib/error/ErrorHandler";
import { generateDiagramForScenario } from "@/lib/services/GenerateExamService";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getSession();
        const diagram = await generateDiagramForScenario(session.exam);

        return NextResponse.json(diagram);
    } catch (error) {
        return handleApiError(error);
    }
}
