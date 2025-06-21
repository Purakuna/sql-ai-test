import { LightQuestion, Question } from "@/shared/models/Question";
import { EvaluationResults } from "@/lib/models/EvaluationResults";
import { SubmitQuery } from "@/lib/models/SubmitQuery";

export interface Table {
    tableName: string;
    columns: {
        columnName: string;
        dataType: string;
        description: string;
    }[];
}

export interface Exam {
    scenario: string;
    tables: Table[];
    questions: Question[];
    evaluationResults?: EvaluationResults;
    submitQuery?: SubmitQuery;
}

export interface LightExam {
    scenario: string;
    tables: Table[];
    questions: LightQuestion[];
}
    