"use client";

import mermaid from "mermaid";
import { useRef, useEffect } from "react";
import Spinner from "../Spinner";
import { useDiagram } from "@/ui/client/useDiagram";

export default function EERDiagram() {
    const { data, error, isLoading } = useDiagram();
    const mermaidRef = useRef<HTMLDivElement>(null);

    const drawDiagram = async function (diagram: string) {
        const element = mermaidRef.current;
        if (!element) return;
        const graphDefinition = diagram;
        mermaid.initialize({ startOnLoad: false, theme: "dark" });
        const { svg, bindFunctions } = await mermaid.render('mermaid-svg', graphDefinition);
        element.innerHTML = svg;

        if (bindFunctions) {
          bindFunctions(element);
        }
      };

    useEffect(() => {
        if (!data || !data.diagram) return;

        drawDiagram(data.diagram);
    }, [data]);
    
    if (error) {
        return (
            <div className="flex justify-center items-center p-4">
              <p className="text-red-500">Error al generar diagrama de tablas</p>
            </div>
        );
    }
    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-4">
              <Spinner />
              <p className="ml-2">Generando diagrama de tablas...</p>
            </div>
        );
    }
    
    return (
        <div className="mermaid-container flex justify-center p-4" ref={mermaidRef} />
    );
}
