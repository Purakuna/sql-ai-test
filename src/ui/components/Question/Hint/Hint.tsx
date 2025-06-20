"use client";

import Spinner from "@/ui/components/Spinner";
import { useHint } from "@/ui/client/useHints";

interface HintProps {
    requirement: string;
}

export default function Hint({ requirement }: HintProps) {
    const { data, trigger, isMutating } = useHint(requirement);

    if (!data?.hint) {
        return (
            <button
                type="button"
                onClick={() => trigger()}
                disabled={isMutating}
                className="text-sm text-indigo-400 hover:text-indigo-300 disabled:opacity-50 flex items-center gap-2"
            >
                {isMutating ? (
                <>
                    <Spinner size="h-4 w-4" color="text-indigo-400" />
                    Generando...
                </>
                ) : (
                "✨ Pedir una Pista"
                )}
            </button>
        )
    }
    
    return (
        <p className="text-sm p-2 bg-indigo-500/10 text-indigo-300 rounded-md">
            <strong>Pista:</strong> {data?.hint}
        </p>
    );
}