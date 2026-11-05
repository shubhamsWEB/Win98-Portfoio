// Pure calculator: press(state, key) with key one of 0-9 . + - * / = C CE +/- sqrt
export const initialCalc = { display: "0", stored: null, op: null, fresh: true };

const format = (n) => (Number.isFinite(n) ? String(parseFloat(n.toPrecision(12))) : "Error");

function compute(a, op, b) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  return b === 0 ? NaN : a / b;
}

export function press(state, key) {
  const { display, stored, op, fresh } = state;
  const value = parseFloat(display);
  if (key === "C" || display === "Error") {
    if (key === "C" || /[+\-*/=]/.test(key)) return initialCalc;
  }
  if (/^\d$/.test(key)) {
    if (fresh || display === "Error") return { ...state, display: key, fresh: false };
    return display.length >= 14 ? state : { ...state, display: display === "0" ? key : display + key };
  }
  if (key === ".") {
    if (fresh) return { ...state, display: "0.", fresh: false };
    return display.includes(".") ? state : { ...state, display: `${display}.` };
  }
  if (key === "CE") return { ...state, display: "0", fresh: true };
  if (key === "+/-") return { ...state, display: format(-value) };
  if (key === "sqrt") return { ...state, display: format(Math.sqrt(value)), fresh: true };
  if (key === "=") {
    if (!op) return { ...state, fresh: true };
    return { display: format(compute(stored, op, value)), stored: null, op: null, fresh: true };
  }
  // + - * /
  if (op && !fresh) {
    const result = compute(stored, op, value);
    const shown = format(result);
    return { display: shown, stored: result, op: Number.isFinite(result) ? key : null, fresh: true };
  }
  return { ...state, stored: value, op: key, fresh: true };
}
