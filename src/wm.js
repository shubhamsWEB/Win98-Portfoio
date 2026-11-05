// Pure window-manager state. Every window lives in `windows` keyed by app id;
// `order` is back-to-front, so the last visible entry is the focused window.
export const initialState = { windows: {}, order: [], desktopHidden: [] };

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

// Applies new geometry; `rev` tells the window to overwrite any native resize.
function arrange(state, rect) {
  const visible = state.order.filter((id) => !state.windows[id].minimized);
  const windows = { ...state.windows };
  visible.forEach((id, i) => {
    const win = windows[id];
    windows[id] = { ...win, ...rect(i, visible.length), maximized: false, rev: (win.rev ?? 0) + 1 };
  });
  return { ...state, windows };
}

export function reducer(state, action) {
  const { windows, order } = state;
  const { id } = action;
  const win = windows[id];
  const update = (patch) => ({ ...state, windows: { ...windows, [id]: { ...win, ...patch } } });

  switch (action.type) {
    case "open":
      if (win) {
        return {
          ...update({ minimized: false, props: action.props ?? win.props }),
          order: raise(order, id),
        };
      }
      return {
        ...state,
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
      return { ...update({ minimized: false }), order: raise(order, id) };
    case "minimize":
      return update({ minimized: true });
    case "taskbar":
      // Win98 behaviour: focused -> minimize, otherwise restore and raise.
      return reducer(state, { type: focusedId(state) === id ? "minimize" : "focus", id });
    case "maximize":
      return update({ maximized: !win.maximized });
    case "move":
      return update({ x: action.x, y: action.y });
    case "title":
      return win ? update({ title: action.title }) : state;
    case "close": {
      const { [id]: _closed, ...rest } = windows;
      return { ...state, windows: rest, order: order.filter((w) => w !== id) };
    }
    case "showDesktop": {
      const visible = order.filter((w) => !windows[w].minimized);
      const targets = visible.length ? visible : state.desktopHidden.filter((w) => windows[w]);
      const next = { ...windows };
      targets.forEach((w) => (next[w] = { ...windows[w], minimized: visible.length > 0 }));
      return { ...state, windows: next, desktopHidden: visible };
    }
    case "cascade":
      return arrange(state, (i) => ({
        x: 12 + i * 26,
        y: 12 + i * 26,
        w: Math.min(640, action.viewport.w - 40),
        h: Math.min(440, action.viewport.h - 40),
      }));
    case "tile":
      return arrange(state, (i, n) => ({
        x: Math.round((i * action.viewport.w) / n),
        y: 0,
        w: Math.round(action.viewport.w / n),
        h: action.viewport.h,
      }));
    default:
      return state;
  }
}
