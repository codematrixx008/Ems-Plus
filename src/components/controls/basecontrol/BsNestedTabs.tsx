import React, { useState } from "react";

type Tab = {
  key: string;
  label: string;
  children?: Tab[];
  content?: React.ReactNode;
};

export const BsNestedTabs: React.FC<{ tabs: Tab[] }> = ({ tabs }) => {
  const [mainActive, setMainActive] = useState(tabs[0].key);
  const mainTab = tabs.find((t) => t.key === mainActive);

  const [subActive, setSubActive] = useState(
    mainTab?.children ? mainTab.children[0].key : ""
  );

  React.useEffect(() => {
    if (mainTab?.children) {
      setSubActive(mainTab.children[0].key);
    }
  }, [mainActive]);

  const subTab = mainTab?.children?.find((s) => s.key === subActive);

  return (
    <div className="ntabs-container">
      {/* Main Tabs */}
      <div className="ntabs-main">
        {tabs.map((tab) => (
          <BsButtonControl
            key={tab.key}
            className={`ntab-btn ${mainActive === tab.key ? "active" : ""}`}
            onClick={() => setMainActive(tab.key)}
          >
            {tab.label}
          </BsButtonControl>
        ))}
      </div>

      {/* Sub Tabs */}
      {mainTab?.children && (
        <div className="ntabs-sub">
          {mainTab.children.map((sub) => (
            <BsButtonControl
              key={sub.key}
              className={`nsub-btn ${subActive === sub.key ? "active" : ""}`}
              onClick={() => setSubActive(sub.key)}
            >
              {sub.label}
            </BsButtonControl>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="ntabs-content">
        {subTab?.content || mainTab?.content || "No content"}
      </div>
    </div>
  );
};
