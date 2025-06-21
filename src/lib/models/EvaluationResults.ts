export interface EvaluationResults {
    questions: {
        id: string;
        feedback: string;
        finalGrade: number;
        isValid: boolean;
    }[];
    finalGrade: number;
}
