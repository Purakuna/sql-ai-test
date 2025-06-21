import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { generateAsJson, _ai } from './Gemini';

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

const MockedGoogleGenAI = GoogleGenAI as jest.Mock;

describe('Gemini', () => {
    describe('generateAsJson', () => {

        let mockGenerateContent: jest.Mock;
    
      beforeEach(() => {
        mockGenerateContent = _ai.models.generateContent as jest.Mock;
        MockedGoogleGenAI.mockClear();
        process.env.GEMINI_API_KEY = 'test-api-key';
      });
    
      test('should call generateContent with default model and correct parameters', async () => {
        const systemInstruction = 'Eres un asistente útil.';
        const schema = { type: 'object', properties: { response: { type: 'string' } } };
        const userPrompt = 'Hola, ¿quién eres?';
        const mockApiResponse: Partial<GenerateContentResponse> = { text: 'Soy un modelo de IA' };
    
        mockGenerateContent.mockResolvedValue(mockApiResponse);
    
        const result = await generateAsJson(systemInstruction, schema, userPrompt);
    
        expect(result).toBe(mockApiResponse);
        expect(mockGenerateContent).toHaveBeenCalledTimes(1);
        expect(mockGenerateContent).toHaveBeenCalledWith({
          model: 'gemini-2.0-flash',
          contents: [{
            role: 'user',
            parts: [{ text: userPrompt }],
          }],
          config: {
            responseMimeType: 'application/json',
            responseSchema: schema,
            systemInstruction: [{ text: systemInstruction }],
          },
        });
      });
    
      test('should include thinkingConfig for models starting with "gemini-2.5"', async () => {
        const systemInstruction = 'Instrucción del sistema.';
        const schema = { type: 'object', properties: {} };
        const userPrompt = 'Prompt del usuario.';
        const customModel = 'gemini-2.5-pro-vision';
    
        await generateAsJson(systemInstruction, schema, userPrompt, customModel);
    
        expect(mockGenerateContent).toHaveBeenCalledWith(
          expect.objectContaining({
            model: customModel,
            config: expect.objectContaining({
              thinkingConfig: {
                thinkingBudget: -1,
              },
            }),
          }),
        );
      });
    
      test('should not include thinkingConfig for models not starting with "gemini-2.5"', async () => {
        const systemInstruction = 'Instrucción del sistema.';
        const schema = { type: 'object', properties: {} };
        const userPrompt = 'Prompt del usuario.';
        const customModel = 'gemini-1.5-flash';
    
        await generateAsJson(systemInstruction, schema, userPrompt, customModel);
    
        const calls = mockGenerateContent.mock.calls;
        expect(calls[0][0].config).not.toHaveProperty('thinkingConfig');
      });
    
      test('should use the custom model when provided', async () => {
        const systemInstruction = 'Instrucción.';
        const schema = { type: 'object', properties: {} };
        const userPrompt = 'Prompt.';
        const customModel = 'my-custom-model-123';
    
        await generateAsJson(systemInstruction, schema, userPrompt, customModel);
    
        expect(mockGenerateContent).toHaveBeenCalledWith(
          expect.objectContaining({
            model: customModel,
          }),
        );
      });
    });
});
