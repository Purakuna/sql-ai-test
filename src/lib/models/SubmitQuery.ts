export interface SubmitQuery {
    queries: {
        questionId: string;
        requirement: string;
        query: string;
    }[];
}
