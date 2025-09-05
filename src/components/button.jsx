import React from "react";
import "../styles/calculator.css";

export default function Button({ label, onClick, className = "" }) {
  return (
    <button
      className={`calc-btn ${className}`}
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  );
}
