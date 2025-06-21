import { generateAsJson } from "@/lib/adapters/Gemini";
import { 
    SYSTEM_PROMPT as SYSTEM_PROMPT_GENERATE_SCENARIO_FOR_TEST, 
    SCHEMA as SCHEMA_GENERATE_SCENARIO_FOR_TEST 
} from "@/lib/prompts/GenerateScenarioForTest";
import { 
    SYSTEM_PROMPT as SYSTEM_PROMPT_GENERATE_INITIAL_DATA_FOR_SCENARIO, 
    SCHEMA as SCHEMA_GENERATE_INITIAL_DATA_FOR_SCENARIO 
} from "@/lib/prompts/GenerateInitialDataForScenario";
import { 
    SYSTEM_PROMPT as SYSTEM_PROMPT_GENERATE_DIAGRAM_FOR_SCENARIO, 
    SCHEMA as SCHEMA_GENERATE_DIAGRAM_FOR_SCENARIO, 
} from "@/lib/prompts/GenerateDiagramForScenario";
import { 
    SYSTEM_PROMPT as SYSTEM_PROMPT_GENERATE_HINT_FOR_SQL_QUERY, 
    SCHEMA as SCHEMA_GENERATE_HINT_FOR_SQL_QUERY 
} from "@/lib/prompts/GenerateHintForSqlQuery";
import { 
    SYSTEM_PROMPT as SYSTEM_PROMPT_GENERATE_QUERY_PREVIEW_FOR_SQL, 
    SCHEMA as SCHEMA_GENERATE_QUERY_PREVIEW_FOR_SQL 
} from "@/lib/prompts/GenerateQueryPreviewForSQL";

import { QuestionToBuild } from "@/lib/models/QuestionToBuild";
import { Exam } from "@/shared/models/Exam";
import { getSession } from "@/lib/session";
import { NotFoundError } from "../error/ErrorHandler";
import { InitialData, InitialDataTransformed } from "@/lib/models/InitialData";

export const generateQuestionsToBuild = (): QuestionToBuild[] => {
    
return [
    {
    instructions: "INNER JOIN con dos tablas y condiciones where de complejidad media",
    points: 1
    },
    {
    instructions: "INNER JOIN con dos tablas y condiciones where de complejidad alta",
    points: 1
    },
    {
    instructions: "LEFT o RIGHT JOIN excluyendo nulos con dos tablas y condiciones where de complejidad media",
    points: 1
    },
    {
    instructions: "LEFT o RIGHT JOIN incluyendo nulos con dos tablas y condiciones where de complejidad media",
    points: 1
    },
    {
    instructions: "COUNT con GROUP BY y condiciones where de complejidad media-alta",
    points: 0.5
    },
    {
    instructions: "SUM o AVG con GROUP BY y condiciones where de complejidad media-alta",
    points: 0.5
    }
    ];
}

const QUESTIONS_TO_BUILD = generateQuestionsToBuild();

export const generateScenarioForTest = async (): Promise<Exam> => {
    
    const generatedContent = await generateAsJson(
        SYSTEM_PROMPT_GENERATE_SCENARIO_FOR_TEST, 
        SCHEMA_GENERATE_SCENARIO_FOR_TEST, 
        `Preguntas: ${QUESTIONS_TO_BUILD.map((question, index) => `    ${index + 1}) ${question.instructions} (${question.points} puntos).`).join("\n")}`
    );

    if (!generatedContent.text) {
        throw new Error("No se genero contenido");
    }

    return JSON.parse(generatedContent.text);
}

export const setExamInSession = async (exam: Exam) => {
    const session = await getSession();
    session.exam = {
        scenario: exam.scenario,
        tables: exam.tables,
        questions: exam.questions.map((question) => ({
            requirement: question.requirement
        }))
    };
    await session.save();
}

export const generateInitialDataForScenario = async (exam?: Exam): Promise<InitialData> => {
    if (!exam) {
        throw new NotFoundError("No se encontro examen");
    }
    
    const { scenario, tables, questions } = exam;

    if (!scenario || !tables || !questions) {
        throw new Error("No se encontro escenario, tablas o preguntas");
    }
    
    const generatedContent = await generateAsJson(
        SYSTEM_PROMPT_GENERATE_INITIAL_DATA_FOR_SCENARIO, 
        SCHEMA_GENERATE_INITIAL_DATA_FOR_SCENARIO, 
        `Escenario: ${scenario}. Tablas: ${JSON.stringify(tables)}. Preguntas: (${questions.map((question, index) => `    ${index + 1}) Requisito: ${question.requirement}.`).join(",")})`
    );

    if (!generatedContent.text) {
        throw new Error("No se genero contenido");
    }

    return JSON.parse(generatedContent.text);
}

export const generateDiagramForScenario = async (exam: Exam | undefined): Promise<{ diagram: string }> => {
    if (!exam) {
        throw new NotFoundError("No se encontro examen");
    }
    
    const { scenario, tables } = exam;

    if (!scenario || !tables) {
        throw new Error("No se encontro escenario o tablas");
    }
    
    const generatedContent = await generateAsJson(
        SYSTEM_PROMPT_GENERATE_DIAGRAM_FOR_SCENARIO, 
        SCHEMA_GENERATE_DIAGRAM_FOR_SCENARIO, 
        `Escenario: ${scenario}, Tablas: ${JSON.stringify(tables)}`
    );

    if (!generatedContent.text) {
        throw new Error("No se genero contenido");
    }

    return JSON.parse(generatedContent.text);
}

export const generateHintForSqlQuery = async (exam: Exam | undefined, requirement: string): Promise<{ hint: string }> => {
    if (!exam) {
        throw new NotFoundError("No se encontro examen");
    }
    
    const { scenario, tables } = exam;

    if (!scenario || !tables) {
        throw new Error("No se encontro escenario o tablas");
    }
    
    const generatedContent = await generateAsJson(
        SYSTEM_PROMPT_GENERATE_HINT_FOR_SQL_QUERY, 
        SCHEMA_GENERATE_HINT_FOR_SQL_QUERY, 
        `Escenario: ${scenario}, Tablas: ${JSON.stringify(tables)}, Requisito: ${requirement}`
    );

    if (!generatedContent.text) {
        throw new Error("No se genero contenido");
    }

    return JSON.parse(generatedContent.text);
}

export const generateQueryPreviewForSqlQuery = async (exam: Exam | undefined, data: InitialDataTransformed, sqlQuery: string): Promise<{ status: string, headers?: string[], rows?: string[][] }> => {
    if (!exam) {
        throw new NotFoundError("No se encontro examen");
    }
    
    const { scenario, tables } = exam;

    if (!scenario || !tables) {
        throw new Error("No se encontro escenario o tablas");
    }
    
    const generatedContent = await generateAsJson(
        SYSTEM_PROMPT_GENERATE_QUERY_PREVIEW_FOR_SQL, 
        SCHEMA_GENERATE_QUERY_PREVIEW_FOR_SQL, 
        `Escenario: ${scenario}, Tablas: ${JSON.stringify(tables)}, Data: ${JSON.stringify(data)}, Query: ${sqlQuery}`,
        "gemini-2.5-flash" // Required to be more accurate
    );

    if (!generatedContent.text) {
        throw new Error("No se genero contenido");
    }

    return JSON.parse(generatedContent.text);
}
