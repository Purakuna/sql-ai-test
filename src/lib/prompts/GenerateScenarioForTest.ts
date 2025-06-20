export const SYSTEM_PROMPT = `
Eres un generador de exámenes de SQL altamente competente. Tu tarea es crear un escenario de base de datos y preguntas de SQL basadas en él.

**Requisitos Indispensables del Esquema de Base de Datos:**
1.  **Número de Tablas:** Debes generar un **mínimo de 5 tablas** y **maximo 9 tablas**.
2.  **Número de Atributos:** Cada una de las tablas debe contener un **mínimo de 5 atributos (columnas)**.
3.  **Coherencia:** Las tablas deben estar relacionadas lógicamente entre sí a través de claves primarias y foráneas para permitir consultas complejas con JOINs.
4.  Las tablas y sus atributos deben estar en español.
5.  Usar snake_case para los nombres de las tablas y columnas.
6.  La cantidad de preguntas esta limitada a las que te proporcione el usuario.

**Requisitos de las Preguntas:**
- Las consultas que se soliciten deben cumplir con el escenario y las tablas generadas y sus relaciones.
- El escenario debe ser creativo y coherente (ej: 'Gestión logística de una tienda online', 'Sistema de reservas de un hotel boutique', 'Análisis de datos de una plataforma de streaming de música').
- Las preguntas deben cubrir un total de 5 puntos.
- Si la cantidad de puntos solicitado por el usuario es menor o mayor a 5, debes ajustar la cantidad de preguntas y puntos para que cubran un total de 5 puntos.

**Formato de Salida:**
Devuelve la respuesta estrictamente en el formato JSON solicitado.
`;

export const SCHEMA = {
  type: "OBJECT",
  properties: {
    scenario: {
      type: "STRING",
      description: "Una breve descripción del escenario.",
    },
    tables: {
      type: "ARRAY",
      description: "Una lista de entre 5 y 9 tablas que componen el esquema de la base de datos.",
      items: {
        type: "OBJECT",
        properties: {
          tableName: {
            type: "STRING",
            description: "El nombre de la tabla (ej. 'usuarios', 'productos')."
          },
          columns: {
            type: "ARRAY",
            description: "Una lista de 5 o más columnas para esta tabla.",
            items: {
              type: "OBJECT",
              properties: {
                columnName: {
                  type: "STRING",
                  description: "El nombre de la columna (ej. 'id', 'nombre_usuario')."
                },
                dataType: {
                  type: "STRING",
                  description: "El tipo de dato SQL de la columna (ej. INT, VARCHAR(100), DATETIME, DECIMAL(10, 2), BOOLEAN)."
                },
                description: {
                  type: "STRING",
                  description: "Una breve descripción de la columna, indicando si es clave primaria (PK), foránea (FK) y a qué tabla referencia, o su propósito general."
                }
              },
              required: ["columnName", "dataType", "description"]
            }
          }
        },
        required: ["tableName", "columns"]
      }
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
