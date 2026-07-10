import React from "react";

interface ChildComponentProps {
  guidelines: string[];
  icon: string;
}

const ChildComponent = ({ guidelines, icon }: ChildComponentProps) => {
  return (
    <div>
      {guidelines.map((guideline: string, index: number) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <span style={{ marginRight: "8px" }}>{icon}</span>
          <div dangerouslySetInnerHTML={{ __html: guideline }} />
        </div>
      ))}
    </div>
  );
};

export default ChildComponent;
