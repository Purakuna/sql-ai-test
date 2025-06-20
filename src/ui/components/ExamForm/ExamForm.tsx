"use client";

import { Exam } from "@/lib/models/Exam";
import Question from "@/ui/components/Question";
import Spinner from "@/ui/components/Spinner";

interface ExamFormProps {
    exam: Exam;
}

export default function ExamForm({ exam }: ExamFormProps) {

    // TODO: implement pending
    const pending = false;

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
        <form action="">
            {exam?.questions.map((question) => (
                <Question key={question.id} question={question} mapSchema={mapSchema} />
            ))}

            <button
                type="submit"
                disabled={pending}
                className="mt-6 w-full py-4 text-lg font-semibold bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center gap-3 transition-colors disabled:bg-gray-500"
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