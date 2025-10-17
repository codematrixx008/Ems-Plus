// src/components/ThemeSelector.tsx
import React from "react";
import { setTheme } from "./utils/theme";

export const ThemeSelector: React.FC = () => {
    const themes = [
        { name: "pink", color: "#ec1346" },
        { name: "green", color: "#377b06" },
        { name: "orange", color: "#e74818" },
        { name: "blue", color: "#1741e8" },
        { name: "purple", color: "#721ce3" },
        { name: "brown", color: "#ae6337" },
        { name: "dark", color: "#111827" },
    ] as const;

    return (
        <div
            style={{
                display: "flex",
                gap: "0.75rem",
                margin: "1rem",
                flexWrap: "wrap",
                alignItems: "center",
            }}
        >
            {themes.map((t) => (
                <button
                    key={t.name}
                    title={t.name.charAt(0).toUpperCase() + t.name.slice(1) + " Theme"}
                    onClick={() => setTheme(t.name)}
                    style={{
                        borderRadius: "50%",
                        // border: "2px solid #e5e7eb",
                        borderStyle: "none",
                        width: "30px",
                        height: "30px",
                        background: t.color,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#9ca3af";
                    }}
                    onMouseOut={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                    }}
                />
            ))}
        </div>
    );
};
