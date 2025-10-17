import React, { useState } from "react";
import { CommonProps } from "../type/types";
import "./bsAccordion.css";

export type BsAccordionItem = {
  key: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

export type BsAccordionProps = CommonProps & {
  items: BsAccordionItem[];
  multiple?: boolean;
  defaultOpenKeys?: string[];
};

export const BsAccordion: React.FC<BsAccordionProps> = ({
  items,
  multiple = false,
  defaultOpenKeys = [],
}) => {
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys);

  const toggle = (key: string) => {
    setOpenKeys((prev) => {
      const alreadyOpen = prev.includes(key);
      if (multiple)
        return alreadyOpen ? prev.filter((k) => k !== key) : [...prev, key];
      return alreadyOpen ? [] : [key];
    });
  };

  return (
    <div className="sg-accordion">
      {items.map((item) => {
        const isOpen = openKeys.includes(item.key);

        return (
          <div key={item.key} className="sg-accordion__item">
            {/* Header */}
            <button
              type="button"
              className="sg-accordion__header"
              aria-expanded={isOpen}
              onClick={() => toggle(item.key)}
            >
              <div className="sg-accordion__title">{item.title}</div>

              <div
                className="sg-accordion__tools"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Optional custom right-side controls */}
                {/* {item["tools"]} */}
              </div>

              <span className="sg-accordion__chevron">
                {isOpen ? "▴" : "▾"}
              </span>
            </button>

            {/* Body */}
            {isOpen && (
              <div className="sg-accordion__panel">
                <div className="sg-accordion__content">{item.content}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
