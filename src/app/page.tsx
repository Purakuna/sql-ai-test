"use server";

import { getStudentInSession } from "@/lib/controllers/StudentController";
import { redirect } from "next/navigation";
import { getStudentExamByStudentInSession } from "@/lib/controllers/ExamController";
import EERDiagram from "@/ui/components/EERDiagram";
import DataGenerator from "@/ui/components/DataGenerator";
import ExamForm from "@/ui/components/ExamForm";
import QuestionFeedback from "@/ui/components/QuestionFeedback";

export default async function Home() {
    const student = await getStudentInSession();

    if (!student) {
      redirect("/start");
    }

    const exam = await getStudentExamByStudentInSession();

    if (!exam) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 text-white">
          <p className="text-gray-400">No se encontró ningún examen para este estudiante.</p>
        </div>
      );
    }

    if(exam.evaluationResults) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 text-white">
          <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-2xl shadow-2xl space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-indigo-400">
                Examen Finalizado
              </h1>
              <p className="text-gray-400">
                Estudiante: {student.fullName} ({student.studentId})
              </p>
            </div>
            <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <div className="my-8 text-center">
            <p className="text-xl text-gray-300">Tu Nota Final es:</p>
            <p
              className={`text-7xl font-bold ${
                exam.evaluationResults.finalGrade >= 3.0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {exam.evaluationResults.finalGrade}
            </p>
          </div>
            </div>

            {exam.questions.map((question) => (
            <QuestionFeedback
              key={question.id}
              question={question}
              query={exam.submitQuery?.queries.find((q) => q.questionId === question.id)?.query || ""}
              questionEvaluation={exam.evaluationResults?.questions.find((q) => q.id === question.id) || null}
            />
          ))}
          </div>
        </div>
      );
    }

    return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 text-white">
      <DataGenerator />
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-400">
            Examen en Curso...
          </h1>
          <p className="text-gray-400">
            Estudiante: {student.fullName} ({student.studentId})
          </p>
          <p className="text-yellow-400 font-bold mt-2">
            NO CAMBIES DE PESTAÑA O EL EXAMEN SERÁ ANULADO
          </p>
        </div>
        <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
          <h2 className="text-lg font-semibold text-indigo-300">
            Escenario del Examen:
          </h2>
          <p className="text-gray-300">{exam?.scenario}</p>
          <h3 className="font-semibold mt-2 text-indigo-300">
            Esquema de Tablas:
          </h3>
          <EERDiagram />
        </div>
        <ExamForm exam={exam} />
      </div>
    </div>
  );
}
