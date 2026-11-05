// Pure window-manager state. Every window lives in `windows` keyed by app id;
// `order` is back-to-front, so the last visible entry is the focused window.
export const initialState = { windows: {}, order: [] };

const raise = (order, id) => [...order.filter((w) => w !== id), id];

export function focusedId({ windows, order }) {
  return [...order].reverse().find((id) => !windows[id].minimized) ?? null;
}

function place({ w, h, center }, viewport, count) {
  const width = Math.min(w, viewport.w - 8);
  const height = Math.min(h, viewport.h - 8);
  const step = (count % 6) * 26;
  const x = center ? (viewport.w - width) / 2 : 110 + step;
  const y = center ? (viewport.h - height) / 2.5 : 24 + step;
  return {
    x: Math.round(Math.max(4, Math.min(x, viewport.w - width - 4))),
    y: Math.round(Math.max(4, Math.min(y, viewport.h - height - 4))),
    w: width,
    h: height,
  };
}

export function reducer(state, action) {
  const { windows, order } = state;
  const { id } = action;
  const win = windows[id];

  switch (action.type) {
    case "open":
      if (win) {
        return {
          windows: {
            ...windows,
            [id]: { ...win, minimized: false, props: action.props ?? win.props },
          },
          order: raise(order, id),
        };
      }
      return {
        windows: {
          ...windows,
          [id]: {
            id,
            ...place(action.size, action.viewport, order.length),
            minimized: false,
            maximized: false,
            props: action.props,
          },
        },
        order: [...order, id],
      };
    case "focus":
      if (!win || (focusedId(state) === id && !win.minimized)) return state;
      return {
        windows: { ...windows, [id]: { ...win, minimized: false } },
        order: raise(order, id),
      };
    case "minimize":
      return { ...state, windows: { ...windows, [id]: { ...win, minimized: true } } };
    case "taskbar":
      // Win98 behaviour: focused -> minimize, otherwise restore and raise.
      return reducer(state, { type: focusedId(state) === id ? "minimize" : "focus", id });
    case "maximize":
      return { ...state, windows: { ...windows, [id]: { ...win, maximized: !win.maximized } } };
    case "move":
      return { ...state, windows: { ...windows, [id]: { ...win, x: action.x, y: action.y } } };
    case "close": {
      const { [id]: _closed, ...rest } = windows;
      return { windows: rest, order: order.filter((w) => w !== id) };
    }
    default:
      return state;
  }
}
