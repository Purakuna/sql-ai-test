"use client";

import { Exam } from "@/shared/models/Exam";
import Question from "@/ui/components/Question";
import Spinner from "@/ui/components/Spinner";
import { useActionState } from "react";
import { FormState, sendExamForEvaluation } from "@/lib/actions/SendExamForEvaluation";

interface ExamFormProps {
    exam: Exam;
}

export default function ExamForm({ exam }: ExamFormProps) {

    const initialState: FormState = {
        evaluationResults: null,
        error: null,
    };

    const [state, formAction, pending] = useActionState(sendExamForEvaluation, initialState);

    const mapSchema = exam.tables.reduce((acc, table) => {
        acc[table.tableName] = table.columns.map((column) => ({
            label: column.columnName,
            type: column.dataType,
            info: column.description,
        }));
        return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as Record<string, any>);
    
    return (
        <form action={formAction}>
            {exam?.questions.map((question) => (
                <Question key={question.id} question={question} mapSchema={mapSchema} />
            ))}

            {state.error && (
                <div className="p-3 rounded-lg mb-4 text-center bg-red-500/20 text-red-300">
                    {state.error}
                </div>
            )}

            <button
                type="submit"
                disabled={pending}
                className="mt-2 w-full py-4 text-lg font-semibold bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center gap-3 transition-colors disabled:bg-gray-500"
            >
                {pending ? (
                <>
                    <Spinner /> Calificando Examen...
                </>
                ) : (
                "Finalizar y Entregar Examen"
                )}
            </button>
        </form>
    )
}