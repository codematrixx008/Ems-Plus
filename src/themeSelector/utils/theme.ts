type ThemeColor =
  | "pink"
  | "green"
  | "orange"
  | "blue"
  | "purple"
  | "brown"
  | "dark";

/**
 * 🔹 Set the active theme and save it to localStorage
 */
export function setTheme(color: ThemeColor) {
  document.documentElement.setAttribute("data-supreme", color);
  localStorage.setItem("theme", color);
}

/**
 * 🔹 Load the previously saved theme or fallback to default
 */
export function loadTheme() {
  const saved = localStorage.getItem("theme") as ThemeColor | null;

  // Default fallback theme
  const theme: ThemeColor = saved || "pink";

  document.documentElement.setAttribute("data-supreme", theme);
}
