import { Placement, Align } from "../type/types";

export function computePosition(anchor: DOMRect, content: DOMRect, placement: Placement, align: Align, offset=8) {
  let x = 0, y = 0;
  const alignDelta = (axis: "x"|"y") => {
    if (align === "start") return 0;
    if (align === "end") return axis === "x" ? anchor.width - content.width : anchor.height - content.height;
    return axis === "x" ? (anchor.width - content.width) / 2 : (anchor.height - content.height) / 2;
  };

  switch (placement) {
    case "top":
      x = anchor.left + alignDelta("x");
      y = anchor.top - content.height - offset;
      break;
    case "bottom":
      x = anchor.left + alignDelta("x");
      y = anchor.bottom + offset;
      break;
    case "left":
      x = anchor.left - content.width - offset;
      y = anchor.top + alignDelta("y");
      break;
    case "right":
      x = anchor.right + offset;
      y = anchor.top + alignDelta("y");
      break;
  }
  x = Math.max(8, Math.min(x, window.innerWidth - content.width - 8));
  y = Math.max(8, Math.min(y, window.innerHeight - content.height - 8));
  return { x, y };
}