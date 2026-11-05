import { useState } from "react";

const IST = new Intl.DateTimeFormat(undefined, { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" });
const MONTH = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" });
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function DateTime({ close }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const blanks = cursor.getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const isThisMonth = year === today.getFullYear() && month === today.getMonth();

  return (
    <div className="datetime prose">
      <div className="row cal-nav">
        <button aria-label="Previous month" onClick={() => setCursor(new Date(year, month - 1, 1))}>&lt;</button>
        <b aria-live="polite">{MONTH.format(cursor)}</b>
        <button aria-label="Next month" onClick={() => setCursor(new Date(year, month + 1, 1))}>&gt;</button>
      </div>
      <div className="cal">
        {DAYS.map((d, i) => <b key={i}>{d}</b>)}
        {Array.from({ length: blanks }, (_, i) => <span key={`b${i}`} />)}
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={isThisMonth && today.getDate() === i + 1 ? "today" : ""}>{i + 1}</span>
        ))}
      </div>
      <p>Shubham's local time: <b>{IST.format(today)}</b> (IST)</p>
      <div className="row-end">
        <button className="default" onClick={close}>OK</button>
      </div>
    </div>
  );
}
