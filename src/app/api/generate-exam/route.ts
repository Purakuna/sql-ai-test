import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/error/ErrorHandler";
import { generateScenarioForTest, setExamInSession } from "@/lib/services/GenerateExamService";

export async function GET() {
    try {
        const exam = await generateScenarioForTest();
        await setExamInSession(exam);

        return NextResponse.json(exam);
    } catch (error) {
        return handleApiError(error);
    }
}
