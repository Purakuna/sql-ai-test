jest.mock('@google/genai', () => {
    return {
        GoogleGenAI: jest.fn().mockImplementation(() => {
        return {
            models: {
            generateContent: jest.fn(),
            },
        };
        }),
    };
});

jest.mock('@/lib/session', () => ({
    getSession: jest.fn(),
}));

jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((body, init) => ({ body, init })),
    },
}));