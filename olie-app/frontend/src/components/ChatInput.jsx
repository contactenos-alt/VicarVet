import { useState } from 'react';

export default function ChatInput({ onSend, loading }) {
  const [value, setValue] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const cleaned = value.trim();
    if (!cleaned || loading) return;
    onSend(cleaned);
    setValue('');
  };

  return (
    <form onSubmit={submit} className="border-t border-slate-800 p-4 flex gap-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ej: Hoy entrené pierna, me sentí pesado, dormí 5h"
        className="flex-1 rounded-xl bg-slate-800 text-slate-100 px-4 py-3 outline-none border border-slate-700"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-emerald-500 text-slate-950 px-5 font-semibold disabled:opacity-50"
      >
        {loading ? '...' : 'Enviar'}
      </button>
    </form>
  );
}
