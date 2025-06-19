"use client";

import useSWR from 'swr';
import mermaid from "mermaid";
import { useRef, useEffect } from "react";
import Spinner from "../Spinner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EERDiagram() {
    const { data, error, isLoading } = useSWR('/api/generate-diagram', fetcher);
    const mermaidRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!data) return;

        if (mermaidRef.current) {
            mermaid.initialize({ startOnLoad: false, theme: "dark" });
            mermaid.render("mermaid-svg", data?.diagram).then((el) => {
                if (mermaidRef.current) {
                  mermaidRef.current.innerHTML = el.svg;
                }
              });
        }
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
