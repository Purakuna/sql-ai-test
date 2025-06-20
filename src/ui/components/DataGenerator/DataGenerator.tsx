"use client";

import Spinner from "../Spinner";
import { useEffect, useTransition } from "react";
import { usePreloadStore } from "@/ui/store";

export default function DataGenerator() {
    const { isLoading, startPreload, setIsLoading, setIsCompleted } = usePreloadStore();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(async () => {
            await startPreload();
            setIsCompleted(true);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setIsLoading(isPending);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPending]);

    if (!isLoading) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 p-4 z-50">
            <div className="flex items-center gap-2 bg-gray-800 p-6 rounded-xl border-t-4 border-indigo-500 shadow-lg">
              <Spinner size="h-10 w-10" color="text-indigo-400" />
              <p className="text-gray-300">Generando datos iniciales...</p>
            </div>
          </div>
    );
}
