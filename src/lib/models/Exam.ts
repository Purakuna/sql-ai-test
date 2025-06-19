import { LightQuestion, Question } from "./Question";

export interface Exam {
    scenario: string;
    tables: string;
    questions: Question[];
}

export interface LightExam {
    scenario: string;
    tables: string;
    questions: LightQuestion[];
}
    