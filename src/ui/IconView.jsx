import { useState } from "react";

// A folder's contents: single-click selects, double-click, Enter or tap opens.
export default function IconView({ items, details, emptyText, status }) {
  const [selected, setSelected] = useState(null);
  const current = items.find((i) => i.id === selected);
  return (
    <>
      <ul className={`files ${details ? "details-list" : ""}`} onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}>
        {items.length === 0 && <li className="empty">{emptyText}</li>}
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={`file-item ${selected === item.id ? "selected" : ""}`}
              aria-pressed={selected === item.id}
              onClick={(e) => {
                setSelected(item.id);
                if (e.detail === 0 || matchMedia("(pointer: coarse)").matches) item.onOpen();
              }}
              onDoubleClick={item.onOpen}
            >
              <img src={item.icon} alt="" width={details ? 16 : 32} height={details ? 16 : 32} />
              <span>{item.name}</span>
              {details && <small>{item.detail}</small>}
            </button>
          </li>
        ))}
      </ul>
      <div className="status-bar">
        <p className="status-bar-field">{items.length} object(s)</p>
        <p className="status-bar-field">{current?.detail ?? status ?? ""}</p>
      </div>
    </>
  );
}
