export function Pagination({ page, totalPages, onChange }) {
  const safeTotal = Math.max(1, totalPages)

  const canPrev = page > 1
  const canNext = page < safeTotal

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => onChange(page - 1)}
        disabled={!canPrev}
      >
        Prev
      </button>

      <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">
        Page <span className="font-semibold">{page}</span> of{' '}
        <span className="font-semibold">{safeTotal}</span>
      </div>

      <button
        type="button"
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => onChange(page + 1)}
        disabled={!canNext}
      >
        Next
      </button>
    </div>
  )
}
