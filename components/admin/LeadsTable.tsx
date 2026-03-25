export default function LeadsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-gray-600">Nombre</th>
            <th className="px-4 py-3 text-left text-gray-600">Empresa</th>
            <th className="px-4 py-3 text-left text-gray-600">Email</th>
            <th className="px-4 py-3 text-left text-gray-600">Estado</th>
            <th className="px-4 py-3 text-left text-gray-600">Fecha</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
}
