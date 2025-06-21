"use client";

import { Question } from "@/shared/models/Question";
import { QuestionEvaluation } from "@/lib/models/EvaluationResults";
import CodeMirror from "@uiw/react-codemirror";
import { sql, MySQL } from "@codemirror/lang-sql";
import { githubDark } from "@uiw/codemirror-theme-github";

export default function QuestionFeedback({ question, query, questionEvaluation }: { question: Question, query: string, questionEvaluation: QuestionEvaluation | null }) {
    if (!questionEvaluation) {
        return null;
    }
    return (
        <div className="p-4 border border-gray-700 rounded-lg bg-gray-900/30 mb-4">
            <div className="flex items-start justify-between flex-wrap gap-2">
            <h3 className="block text-lg font-medium">
                {question.title} ({question.points} Puntos)
            </h3>
            <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                questionEvaluation.isValid && questionEvaluation.finalGrade === 100
                ? "bg-green-500/20 text-green-300"
                : questionEvaluation.finalGrade > 0
                ? "bg-yellow-500/20 text-yellow-300"
                : "bg-red-500/20 text-red-300"
            }`}
            >
            {questionEvaluation.isValid && questionEvaluation.finalGrade === 100
                ? `Correcto (${((questionEvaluation.finalGrade/100) * question.points).toFixed(2)} pts)`
                : questionEvaluation.finalGrade > 0
                ? `Parcialmente Correcto (${((questionEvaluation.finalGrade/100) * question.points).toFixed(2)} pts)`
                : `Incorrecto (0.0 pts)`}
            </span>
            </div>
            <p className="text-sm text-gray-400 mt-1 mb-2">
                {question.prompt}{" "}
                <strong className="text-indigo-400">{question.requirement}</strong>
            </p>
            <div className="relative">
                <CodeMirror
                  value={query}
                  height="150px"
                  readOnly
                  theme={githubDark}
                  extensions={[sql({
                    dialect: MySQL,
                  })]}
                  className="border border-gray-600 rounded-md"
                />
            </div>
            <p className="text-sm text-gray-400 mt-1 mb-2">
                {questionEvaluation.feedback}
            </p>
        </div>
    )
}
