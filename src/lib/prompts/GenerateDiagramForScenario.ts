export const BUILD_SYSTEM_PROMPT = (scenario: string, tablesAsString: string) => {
    return `
    Eres un generador de esquemas de bases de datos. Dada la siguiente definición de esquema en texto, genera el código completo de Mermaid.js para un Diagrama de Entidad-Relación (ERD) que lo represente.
            
            **Reglas:**
            - Identifica claves primarias (PK) y foráneas (FK). Una columna como 'id_tabla' en la tabla 'tabla' es una PK. Una columna como 'id_otra_tabla' en cualquier tabla es una FK que referencia a 'otra_tabla'.
            - Define las relaciones entre las tablas basadas en las FK.
            - Usa 'int' para las claves y 'string' para los demás tipos de datos por defecto.
            - Solo devuelve el bloque de código Mermaid, sin explicaciones adicionales.
            - Los textos de las relaciones deben estar en español
            - Respetar estrictamente la definición de los campos (Nombre de tablas, nombre de columnas)
            - Debes asignar tipo de dato de acuerdo a la definición de los campos [type] y del ejercicio, si no se especifica el tipo de dato, se debe usar 'string' por defecto.
            - el tipo DECIMAL si viene como DECIMAL(10, 2) se debe usar solo DECIMAL.

            **Escenario:** ${scenario}

            **Ejemplo de Entrada:**
            \`\`\`
            Autores(id_autor, nombre), Libros(id_libro, titulo, id_autor)
            \`\`\`

            **Ejemplo de Salida Esperada:**
            \`\`\`mermaid
            erDiagram
                Autores {
                    int id_autor PK
                    string nombre
                }
                Libros {
                    int id_libro PK
                    string titulo
                    int id_autor FK
                }
                Autores ||--o{ Libros : "escribe"
            \`\`\`

            **Esquema a Procesar:**
            ${tablesAsString}

    **Formato de Salida:**
    Devuelve la respuesta estrictamente en el formato JSON solicitado.
`;
};

export const SCHEMA = {
    type: "object",
    properties: {
      diagram: {
        type: "string",
        description: "El diagrama de entidad-relación en formato Mermaid.js.",
      },
    },
    required: ["diagram"],
};
