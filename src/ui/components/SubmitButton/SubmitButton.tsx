import { useFormStatus } from "react-dom";
import Spinner from "../Spinner";

export default function SubmitButton() {
    const { pending } = useFormStatus();
  
    return (
      <button
        type="submit"
        disabled={pending}
        className="w-full mt-6 py-3 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {pending ? (
          <>
            <Spinner /> Generando Examen...
          </>
        ) : (
          "✨ Generar Examen Personalizado"
        )}
      </button>
    );
  }
  