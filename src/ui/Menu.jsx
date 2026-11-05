import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// items: { label, icon, onClick, items, disabled, checked, shortcut } or { separator: true }
export function MenuList({ items, anchor, inline, onClose, onBack, autoFocus = true, ariaLabel }) {
  const ref = useRef(null);
  const [sub, setSub] = useState(null); // { index, rect, focus }
  const hasGutter = items.some((i) => i.icon || i.checked !== undefined);

  useLayoutEffect(() => {
    if (inline || !anchor) return;
    const el = ref.current;
    const { width: w, height: h } = el.getBoundingClientRect();
    const vw = innerWidth;
    const vh = innerHeight;
    let left;
    let top;
    if (anchor.rect && anchor.side) {
      left = anchor.rect.right - 3;
      if (left + w > vw) left = anchor.rect.left - w + 3;
      top = anchor.rect.top - 3;
    } else if (anchor.rect) {
      left = anchor.rect.left;
      top = anchor.rect.bottom;
    } else {
      left = anchor.x + w > vw ? anchor.x - w : anchor.x;
      top = anchor.y + h > vh ? anchor.y - h : anchor.y;
    }
    el.style.left = `${Math.max(0, Math.min(left, vw - w))}px`;
    el.style.top = `${Math.max(0, Math.min(top, vh - h))}px`;
  }, [anchor, inline]);

  useEffect(() => {
    if (autoFocus) ref.current.focus({ preventScroll: true });
  }, [autoFocus]);

  const buttons = () => [...ref.current.querySelectorAll(":scope > li > button:not(:disabled)")];

  const openSub = (index, button, focus) =>
    setSub({ index, rect: button.getBoundingClientRect(), focus });

  const onKeyDown = (e) => {
    e.stopPropagation();
    const list = buttons();
    const at = list.indexOf(document.activeElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      const next = at === -1 ? (step === 1 ? 0 : list.length - 1) : (at + step + list.length) % list.length;
      list[next]?.focus();
    } else if (e.key === "ArrowRight" && at >= 0) {
      const index = Number(list[at].dataset.index);
      if (items[index].items) openSub(index, list[at], true);
    } else if (e.key === "ArrowLeft" || e.key === "Escape") {
      if (onBack) onBack();
      else if (e.key === "Escape") onClose(true);
    }
  };

  return (
    <ul
      ref={ref}
      className={`menu ${inline ? "menu-inline" : ""}`}
      role="menu"
      aria-label={ariaLabel}
      tabIndex={-1}
      data-menu
      onKeyDown={onKeyDown}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, i) =>
        item.separator ? (
          <li key={i} role="separator" className="sep" />
        ) : (
          <li key={i} role="none">
            <button
              type="button"
              role="menuitem"
              data-index={i}
              disabled={item.disabled}
              aria-haspopup={item.items ? "menu" : undefined}
              aria-expanded={item.items ? sub?.index === i : undefined}
              className={sub?.index === i ? "open" : ""}
              onMouseEnter={(e) => {
                if (item.disabled) return;
                e.currentTarget.focus({ preventScroll: true });
                if (item.items) openSub(i, e.currentTarget, false);
                else setSub(null);
              }}
              onClick={(e) => {
                if (item.items) openSub(i, e.currentTarget, e.detail === 0);
                else {
                  onClose();
                  item.onClick?.();
                }
              }}
            >
              {hasGutter && (
                <span className="menu-gutter">
                  {item.icon ? <img src={item.icon} alt="" /> : item.checked ? "✓" : null}
                </span>
              )}
              <span className="menu-label">{item.label}</span>
              {item.shortcut && <span className="menu-shortcut">{item.shortcut}</span>}
              {item.items && <span className="menu-arrow" aria-hidden="true">▶</span>}
            </button>
            {sub?.index === i &&
              createPortal(
                <MenuList
                  items={item.items}
                  anchor={{ rect: sub.rect, side: true }}
                  autoFocus={sub.focus}
                  ariaLabel={item.label}
                  onClose={onClose}
                  onBack={() => {
                    setSub(null);
                    buttons()[buttons().findIndex((b) => Number(b.dataset.index) === i)]?.focus();
                  }}
                />,
                document.body
              )}
          </li>
        )
      )}
    </ul>
  );
}

// Closes on any press outside a menu, and when focus leaves for an iframe.
export function useDismiss(active, onClose) {
  useEffect(() => {
    if (!active) return;
    const down = (e) => {
      if (!e.target.closest("[data-menu], [data-menu-trigger]")) onClose();
    };
    addEventListener("pointerdown", down);
    addEventListener("blur", onClose);
    return () => {
      removeEventListener("pointerdown", down);
      removeEventListener("blur", onClose);
    };
  }, [active, onClose]);
}

export function Popup({ items, anchor, onClose, ariaLabel }) {
  const previous = useRef(document.activeElement);
  useDismiss(true, onClose);
  return createPortal(
    <MenuList
      items={items}
      anchor={anchor}
      ariaLabel={ariaLabel}
      onClose={(viaEscape) => {
        onClose();
        if (viaEscape) previous.current?.focus?.({ preventScroll: true });
      }}
    />,
    document.body
  );
}

// Right-click helper: const [menu, openMenu] = useContextMenu();
export function useContextMenu() {
  const [state, setState] = useState(null);
  const close = useRef(() => setState(null)).current;
  const open = (e, items) => {
    e.preventDefault();
    e.stopPropagation();
    setState({ items, anchor: { x: e.clientX, y: e.clientY } });
  };
  const element = state && <Popup items={state.items} anchor={state.anchor} onClose={close} />;
  return [element, open];
}

export function MenuBar({ menus }) {
  const [open, setOpen] = useState(null); // { index, rect }
  const close = useRef(() => setOpen(null)).current;
  return (
    <nav className="menubar" aria-label="Menu bar">
      {menus.map((m, i) => (
        <button
          type="button"
          key={m.label}
          data-menu-trigger
          aria-haspopup="menu"
          aria-expanded={open?.index === i}
          className={open?.index === i ? "open" : ""}
          onClick={(e) =>
            setOpen(open?.index === i ? null : { index: i, rect: e.currentTarget.getBoundingClientRect() })
          }
          onMouseEnter={(e) => {
            if (open && open.index !== i) setOpen({ index: i, rect: e.currentTarget.getBoundingClientRect() });
          }}
        >
          {m.label}
        </button>
      ))}
      {open && (
        <Popup key={open.index} items={menus[open.index].items} anchor={{ rect: open.rect }} onClose={close} ariaLabel={menus[open.index].label} />
      )}
    </nav>
  );
}
