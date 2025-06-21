export interface EvaluationResults {
    questions: QuestionEvaluation[];
    finalGrade: number;
}

export interface QuestionEvaluation {
    id: string;
    feedback: string;
    finalGrade: number;
    isValid: boolean;
}
