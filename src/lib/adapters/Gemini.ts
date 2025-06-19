import { GoogleGenAI, GenerateContentConfig } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const generateAsJson = (systemInstruction: string, schema: object, userPrompt: string, model: string = "gemini-2.0-flash") => {
    const config: GenerateContentConfig = {
        responseMimeType: 'application/json',
        responseSchema: schema,
        systemInstruction: [
            {
                text: systemInstruction
            }
        ]
    };

    if (model.startsWith("gemini-2.5")) {
        config.thinkingConfig = {
            thinkingBudget: -1,
        };
    }

    const contents = [
        {
            role: 'user',
            parts: [
              {
                text: userPrompt,
              },
            ],
          },
    ];



    return ai.models.generateContent({
        config,
        contents,
        model
    });
};