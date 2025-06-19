import { QuestionToBuild } from "@/lib/models/QuestionToBuild";

export const BUILD_SYSTEM_PROMPT = (questions: QuestionToBuild[]) => {
    return `
Eres un generador de exámenes de SQL altamente competente. Tu tarea es crear un escenario de base de datos y ${questions.length} preguntas de SQL basadas en él.

**Requisitos Indispensables del Esquema de Base de Datos:**
1.  **Número de Tablas:** Debes generar un **mínimo de 5 tablas** y **maximo 9 tablas**.
2.  **Número de Atributos:** Cada una de las tablas debe contener un **mínimo de 5 atributos (columnas)**.
3.  **Coherencia:** Las tablas deben estar relacionadas lógicamente entre sí a través de claves primarias y foráneas para permitir consultas complejas con JOINs.
4.  Las tablas y sus atributos deben estar en español.
5.  Usar snake_case para los nombres de las tablas y columnas.

**Requisitos de las Preguntas:**
- Las consultas que se soliciten deben cumplir con el escenario y las tablas generadas y sus relaciones.
- El escenario debe ser creativo y coherente (ej: 'Gestión logística de una tienda online', 'Sistema de reservas de un hotel boutique', 'Análisis de datos de una plataforma de streaming de música').
- Las ${questions.length} preguntas deben cubrir los siguientes temas para un total de 5 puntos:
    ${questions.map((question, index) => `    ${index + 1}) ${question.instructions} (${question.points} puntos).`).join("\n")}

**Formato de Salida:**
Devuelve la respuesta estrictamente en el formato JSON solicitado.
`;
};

export const SCHEMA = {
    type: "OBJECT",
    properties: {
      scenario: {
        type: "STRING",
        description: "Una breve descripción del escenario.",
      },
      tables: {
        type: "STRING",
        description:
          "Definición de 5 a 9 tablas, cada una con 5 o más columnas. ej: 'tabla1(col1[type], col2[type], col3[type], col4[type], col5[type]), tabla2(col1[type], col2[type], col3[type], col4[type], col5[type])'. Donde type puede ser int, string, date, etc. Las relaciones deben ser coherentes entre tablas.",
      },
      questions: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            id: {
              type: "STRING",
              description:
                "El id de la pregunta, debe iniciar con q{n} donde n es el id de la pregunta, los ids son consecutivos desde 1,2...n",
            },
            title: {
              type: "STRING",
              description: "El titulo de la pregunta",
            },
            prompt: {
              type: "STRING",
              description:
                "El prompt o enunciado de la pregunta, debe ser claro y conciso",
            },
            requirement: {
              type: "STRING",
              description:
                "El requisito tecnico de la pregunta, debe ser claro y conciso, debe ser una descripcion de la consulta que se debe realizar. No debe ser una consulta, solo una descripcion de la consulta que se debe realizar.",
            },
            points: {
              type: "NUMBER",
              description: "Los puntos de la pregunta",
            },
          },
          required: ["id", "title", "prompt", "requirement", "points"],
        },
      },
    },
    required: ["scenario", "tables", "questions"],
};