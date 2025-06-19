"use client";

import { generateExam, FormState } from "./actions";
import { useActionState } from "react";
import SubmitButton from "@/ui/components/SubmitButton";

export default function StartExamForm() {
    const initialState: FormState = {
        message: "",
        error: false,
    };
    const [state, formAction] = useActionState(generateExam, initialState);
    return (
        <form
          action={formAction}
          className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-2xl text-white"
        >
          <h1 className="text-3xl font-bold text-center text-indigo-400">
            Examen Dinámico de SQL
          </h1>
          <p className="text-center text-gray-400 mt-2 mb-6">
            Ingresa tus datos para generar un examen único.
          </p>

          {state.message && (
          <div className={`p-3 rounded-lg mb-4 text-center ${state.error ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
            {state.message}
          </div>
        )}

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Número de Estudiante"
              name="studentId"
              required
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Nombre Completo"
              name="fullName"
              required
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <SubmitButton />

          <p className="text-xs text-center text-yellow-400 mt-4 font-semibold">
            ADVERTENCIA: Una vez que comiences, si cambias de pestaña o ventana,
            el examen se anulará automáticamente.
          </p>
        </form>
    )
}
