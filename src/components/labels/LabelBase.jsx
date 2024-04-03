import React from "react";

const LabelBase = ({ label, htmlFor, children }) => {
  return (
    <div className="form-group" style={{ marginBottom: "5px", marginTop: "8px", fontSize: "14px" }}>
      <label htmlFor={htmlFor} style={{ fontWeight: "bold", fontSize: "16px" }}>{label}</label>
      {children}
    </div>
  );
};

export default LabelBase;
