export default function StatsPanel({ memory }) {
  return (
    <aside className="hidden lg:block lg:w-80 bg-slate-900 border-l border-slate-800 p-4 text-slate-100">
      <h2 className="text-lg font-semibold mb-3">Panel de progreso</h2>
      <ul className="space-y-2 text-sm">
        <li>Conversaciones: {memory?.conversations?.length || 0}</li>
        <li>Entrenos registrados: {memory?.trainingLogs?.length || 0}</li>
        <li>Objetivos: {(memory?.profile?.goals || []).join(', ') || 'No definidos'}</li>
      </ul>
    </aside>
  );
}
