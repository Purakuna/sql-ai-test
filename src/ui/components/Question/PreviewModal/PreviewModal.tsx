"use client";

import Spinner from "@/ui/components/Spinner";

const PreviewModal = ({
    isOpen,
    onClose,
    result,
    isLoading,
  }: {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: { status: "success" | "error"; headers: string[]; rows: any[][]; error?: string } | null;
    isLoading: boolean;
  }) => {
    if (!isOpen) return null;
  
    const renderContent = () => {
      if (isLoading) {
        return (
          <div className="flex flex-col items-center justify-center h-48">
            <Spinner size="h-10 w-10" color="text-indigo-400" />
            <p className="mt-4 text-gray-300">Ejecutando consulta...</p>
          </div>
        );
      }
      if (!result) return null;
  
      if (result.status === "error") {
        return (
          <div>
            <h3 className="text-xl font-bold text-red-400 mb-3">
              Error de Ejecución
            </h3>
            <pre className="bg-gray-900 p-4 rounded-lg text-red-300 font-mono text-sm whitespace-pre-wrap">
              <code>{result.error}</code>
            </pre>
          </div>
        );
      }
  
      if (result.status === "success") {
        const headers = result.headers || [];
        const rows = result.rows || [];
  
        return (
          <div>
            <h3 className="text-xl font-bold text-green-400 mb-3">
              Resultado de la Consulta
            </h3>
            {headers.length > 0 && rows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-300 bg-gray-900 rounded-lg">
                  <thead className="bg-gray-700 text-xs text-indigo-300 uppercase">
                    <tr>
                      {headers.map((header: string) => (
                        <th key={header} scope="col" className="px-6 py-3">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row: string[], rowIndex: number) => (
                      <tr
                        key={rowIndex}
                        className="border-b border-gray-700 hover:bg-gray-800"
                      >
                        {row.map((cell: string, cellIndex: number) => (
                          <td
                            key={`<span class="math-inline">${rowIndex}-</span>${cellIndex}`}
                            className="px-6 py-4"
                          >
                            {String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400">
                La consulta se ejecutó correctamente pero no arrojó resultados.
              </p>
            )}
          </div>
        );
      }
      return null;
    };
  
    return (
      <div
        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <div
          className="bg-gray-800 p-6 rounded-xl max-w-3xl w-full border-t-4 border-indigo-500"
          onClick={(e) => e.stopPropagation()}
        >
          {renderContent()}
          <button
            onClick={onClose}
            className="mt-6 w-full bg-indigo-600 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  };
  
  export default PreviewModal;
