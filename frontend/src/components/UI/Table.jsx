import React from 'react';

export default function Table({ columns, data, loading, emptyMessage = 'No records found' }) {
  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.width ? { width: col.width } : {}}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <div className="empty-title">{emptyMessage}</div>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row._id || i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({ page, total, limit, onPage }) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing {start}–{end} of {total}
      </div>
      <div className="pagination-btns">
        <button className="pagination-btn" onClick={() => onPage(page - 1)} disabled={page <= 1}>
          ← Prev
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
          return (
            <button
              key={p}
              className={`pagination-btn${p === page ? ' active' : ''}`}
              onClick={() => onPage(p)}
            >
              {p}
            </button>
          );
        })}
        <button className="pagination-btn" onClick={() => onPage(page + 1)} disabled={page >= totalPages}>
          Next →
        </button>
      </div>
    </div>
  );
}
