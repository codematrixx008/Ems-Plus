import './components/controls/css/BaseComponents.css';

//Custom Component Controls Import
import FormControlDemo from './pages/FormControlDemo';
import { ComplexControlDemo } from './pages/ComplexControlDemo';
import AdvanceSelectDemo from './pages/AdvanceSelectDemo';

//Theme Selector Import
import { loadTheme } from "./themeSelector/utils/theme"; 
import { ThemeSelector } from './themeSelector/ThemeSelector';

loadTheme();

export default function App() {
  return (
    <div style={{ padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 3,
          background: "var(--ctl-surface)",
          padding: "10px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          borderRadius: "var(--ctl-radius)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.2rem", color: "var(--main-theme)" }}>
          My Custom Component Practice Dashboard
        </h2>
        <ThemeSelector />
      </div>

      {/* Grid */}

      {/* <GridContainer
        schema={employeeSchema}
        rows={employeeRows}
        onOpenRecord={(id) => alert(`Open record ${id}`)}
        buttons={gridButtons}
        enableFiltering={true}
        enablePagination={true}
      />
      <hr className="my-3" /> */}

      {/* Custom Form Controls */}
      {/* <FormControlDemo /> */}
      <ComplexControlDemo />
      {/* <AdvanceSelectDemo /> */}
    </div>
  );
}