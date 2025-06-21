import { LightQuestion, Question } from "../../shared/models/Question";

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
}

export interface LightExam {
    scenario: string;
    tables: Table[];
    questions: LightQuestion[];
}
    