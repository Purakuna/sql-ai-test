import { generateInitialDataForScenario } from "@/lib/services/GenerateExamService";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/error/ErrorHandler";

export async function GET() {
    try {
        const session = await getSession();
        const initialData = await generateInitialDataForScenario(session.exam);

        return NextResponse.json(initialData);
    } catch (error) {
        return handleApiError(error);
    }
}
