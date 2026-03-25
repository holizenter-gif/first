const COLUMNS = ["Prospecto", "Diagnóstico", "Propuesta", "Contrato", "Activo", "Recurrente"];

export default function KanbanBoard() {
  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {COLUMNS.map((col) => (
        <div key={col} className="min-w-[200px] bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-700 mb-3">{col}</h3>
          <div className="space-y-2 min-h-[100px]"></div>
        </div>
      ))}
    </div>
  );
}
