export interface Question {
    id: string;
    title: string;
    prompt: string;
    requirement: string;
    points: number;
}

export interface LightQuestion {
    requirement: string;
}
    