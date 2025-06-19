import { LightQuestion } from "@/lib/models/Question";

export const BUILD_SYSTEM_PROMPT = (scenario: string, tablesAsString: string, questions: LightQuestion[]) => {
    return `
    Eres un generador de datos iniciales para una base de datos. 

    **Reglas:**
    1. Genera datos iniciales para cada tabla en el esquema proporcionado.
    2. Cada tabla debe tener al menos 3 y maximo 5 filas de datos.
    3. Los datos deben ser coherentes con las relaciones entre tablas.
    4. No inventes datos, tablas, columnas, etc que no existan en el esquema.
    5. Usa datos creativos y realistas para el escenario.

    Los valores de las columnas DEBEN satisfacer las preguntas del examen (fechas, valores especificos a consultar).

    **Escenario:** ${scenario}
    **Tablas:** ${tablesAsString}
    **Preguntas:** 

    ${questions.map((question, index) => `    ${index + 1}) Requisito: ${question.requirement}.`).join("\n")}

    **Formato de Salida:**
    Devuelve la respuesta estrictamente en el formato JSON solicitado.
`;
};

export const SCHEMA = {
    type: "object",
    properties: {
      ts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            t: { type: "string", description: "Nombre de la tabla" },
            d: {
              type: "array",
              description: "Datos iniciales para la tabla",
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    cn: {
                      type: "string",
                      description: "Nombre de la columna que pertenece a la tabla, no es el tipo de dato. Ejemplo: nombre, apellido, etc.",
                    },
                    cv: {
                      type: "string",
                      description: "Valor de la columna",
                    },
                  },
                  required: ["cn", "cv"],
                },
              },
            },
          },
          required: ["t", "d"],
        },
      },
    },
    required: ["ts"],
};
    