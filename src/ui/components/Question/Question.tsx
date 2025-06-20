"use client";

import { Question as QuestionType } from "@/shared/models/Question";
import CodeMirror from "@uiw/react-codemirror";
import { sql, MySQL } from "@codemirror/lang-sql";
import { githubDark } from "@uiw/codemirror-theme-github";
import { useExamStore } from "@/ui/store";

interface QuestionProps {
    question: QuestionType;
    mapSchema?: Record<string, { label: string; type: string; info: string }[]>;
}

export default function Question({ question, mapSchema }: QuestionProps) {
  const { queries, setQuery } = useExamStore();

    return (
        <div className="p-4 border border-gray-700 rounded-lg bg-gray-900/30">
            <label htmlFor={question.id} className="block text-lg font-medium">
                {question.title} ({question.points} Puntos)
              </label>
              <p className="text-sm text-gray-400 mt-1 mb-2">
                {question.prompt}{" "}
                <strong className="text-indigo-400">{question.requirement}</strong>
              </p>
              <div className="relative">
                <CodeMirror
                  value={queries[question.id] || ""}
                  height="150px"
                  theme={githubDark}
                  extensions={[sql({
                    dialect: MySQL,
                    schema: mapSchema,
                  })]}
                  onChange={(value) =>
                    setQuery(value, question.id)
                  }
                  className="border border-gray-600 rounded-md"
                />
              </div>
        </div>
    );
}
