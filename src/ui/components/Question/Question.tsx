"use client";

import { useState, useEffect } from "react";
import { Question as QuestionType } from "@/shared/models/Question";
import CodeMirror from "@uiw/react-codemirror";
import { sql, MySQL } from "@codemirror/lang-sql";
import { githubDark } from "@uiw/codemirror-theme-github";
import { useExamStore } from "@/ui/store";
import { usePreview } from "@/ui/client/usePreview";
import Hint from "./Hint";
import Spinner from "../Spinner";
import PreviewModal from "./PreviewModal";

interface QuestionProps {
    question: QuestionType;
    mapSchema?: Record<string, { label: string; type: string; info: string }[]>;
}

export default function Question({ question, mapSchema }: QuestionProps) {
  const { queries, setQuery } = useExamStore();
  const [showPreview, setShowPreview] = useState(false);

  const currentQuery = queries[question.id] || "";

  const { data: preview, trigger, isMutating: isLoadingPreview } = usePreview();

  useEffect(() => {
    if(!isLoadingPreview && preview) {
      setShowPreview(true);
    }
  }, [isLoadingPreview, preview]);

    return (
        <div className="p-4 border border-gray-700 rounded-lg bg-gray-900/30 mb-4">
            <label htmlFor={question.id} className="block text-lg font-medium">
                {question.title} ({question.points} Puntos)
              </label>
              <p className="text-sm text-gray-400 mt-1 mb-2">
                {question.prompt}{" "}
                <strong className="text-indigo-400">{question.requirement}</strong>
              </p>
              <div className="flex justify-end mb-2">
                <button 
                className="text-sm text-cyan-400 hover:text-cyan-300 disabled:opacity-50 flex items-center gap-2" 
                onClick={() => trigger(currentQuery)} 
                data-testid="execute-button"
                disabled={isLoadingPreview}
              >
                  {isLoadingPreview ? (
                    <>
                      <Spinner size="h-4 w-4" color="text-cyan-400" />
                      Generando...
                    </>
                  ) : (
                    "▶️ Ejecutar Consulta"
                  )}
                </button>
              </div>
              <div className="relative">
                <CodeMirror
                  value={currentQuery}
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
                <input type="hidden" name={question.id} value={currentQuery} />
              </div>
              <div className="mt-2 flex w-full">
                <Hint requirement={question.requirement} />
              </div>
              <PreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                result={preview}
                isLoading={isLoadingPreview}
              />
        </div>
    );
}
