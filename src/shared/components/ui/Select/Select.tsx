"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import classes from "./Select.module.scss";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: readonly SelectOption[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  disabled?: boolean;
}

/** Controlled, select-only combobox; navigation previews options before committing. */
const Select = ({
  label,
  options,
  value,
  onChange,
  name,
  disabled = false,
}: SelectProps) => {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const search = useRef({ text: "", time: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const selected = options.findIndex((option) => option.value === value);
  const expanded = open && !disabled && options.length > 0;

  useEffect(() => {
    if (!expanded) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [expanded]);

  useEffect(() => {
    if (expanded)
      list.current?.children[active]?.scrollIntoView?.({ block: "nearest" });
  }, [active, expanded]);

  const show = () => {
    setActive(Math.max(selected, 0));
    search.current = { text: "", time: 0 };
    setOpen(true);
  };
  const choose = (index: number) => {
    const option = options[index];
    if (option && option.value !== value) onChange(option.value);
    setOpen(false);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const { key } = event;
    if (key === "Tab") {
      if (expanded) choose(active);
      return;
    }
    if (key === "Escape") {
      if (expanded) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
      }
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(key)) {
      event.preventDefault();
      if (key === "Enter" || key === " ") {
        if (expanded) choose(active);
        else show();
      } else {
        setOpen(true);
        setActive(
          key === "Home"
            ? 0
            : key === "End"
              ? options.length - 1
              : expanded
                ? Math.max(
                    0,
                    Math.min(
                      options.length - 1,
                      active + (key === "ArrowDown" ? 1 : -1),
                    ),
                  )
                : Math.max(selected, 0),
        );
      }
      return;
    }
    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      const text =
        (now - search.current.time < 700 ? search.current.text : "") +
        key.toLowerCase();
      search.current = { text, time: now };
      const prefix = [...text].every((letter) => letter === text[0])
        ? text[0]
        : text;
      const start = expanded ? active : selected;
      for (let offset = 1; offset <= options.length; offset++) {
        const index = (Math.max(start, -1) + offset) % options.length;
        if (options[index].label.toLowerCase().startsWith(prefix)) {
          setActive(index);
          setOpen(true);
          break;
        }
      }
    }
  };

  return (
    <div
      ref={root}
      className={classes.select}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <label id={`${id}-label`} htmlFor={id} className={classes.label}>
        {label}
      </label>
      <div className={classes.control}>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-labelledby={`${id}-label`}
          aria-expanded={expanded}
          aria-controls={`${id}-list`}
          aria-haspopup="listbox"
          aria-activedescendant={
            expanded ? `${id}-option-${active}` : undefined
          }
          disabled={disabled || options.length === 0}
          className={classes.trigger}
          onKeyDown={handleKeyDown}
          onClick={() => (expanded ? setOpen(false) : show())}
        >
          <span>{options[selected]?.label ?? "Select an option"}</span>
          <span aria-hidden="true" className={classes.chevron} />
        </button>
        <ul
          ref={list}
          id={`${id}-list`}
          role="listbox"
          aria-labelledby={`${id}-label`}
          aria-hidden={!expanded}
          className={classes.options}
          data-open={expanded}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={option.value === value}
              className={classes.option}
              data-active={expanded && active === index}
              onPointerMove={() => setActive(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
            >
              {option.label}
              <span aria-hidden="true">
                {option.value === value ? "✓" : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {name && (
        <input type="hidden" name={name} value={value} disabled={disabled} />
      )}
    </div>
  );
};

export default Select;
