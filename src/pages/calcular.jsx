import React, { useState, useEffect } from "react";
import Button from "../components/button";
import "../styles/calculator.css";

export default function Calculator() {
  const [display, setDisplay] = useState("0");

  // Factorial
  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  };

  // Calculate
  const calculate = () => {
    try {
      let expr = display;

      // Replace constants
      expr = expr.replace(/π/g, Math.PI).replace(/e/g, Math.E);

      // Powers
      expr = expr.replace(/(\\d+)x²/g, (_, n) => `Math.pow(${n},2)`);
      expr = expr.replace(/(\\d+)x³/g, (_, n) => `Math.pow(${n},3)`);
      expr = expr.replace(/(\\d+)\\^(\\d+)/g, (_, a, b) => `Math.pow(${a},${b})`);

      // Functions
      expr = expr.replace(/sin\\(([^)]+)\\)/g, (_, x) => `Math.sin(${x})`);
      expr = expr.replace(/cos\\(([^)]+)\\)/g, (_, x) => `Math.cos(${x})`);
      expr = expr.replace(/tan\\(([^)]+)\\)/g, (_, x) => `Math.tan(${x})`);
      expr = expr.replace(/log\\(([^)]+)\\)/g, (_, x) => `Math.log10(${x})`);
      expr = expr.replace(/ln\\(([^)]+)\\)/g, (_, x) => `Math.log(${x})`);
      expr = expr.replace(/√\\(([^)]+)\\)/g, (_, x) => `Math.sqrt(${x})`);

      // Factorial
      if (expr.includes("!")) {
        expr = expr.replace(/(\\d+)!/g, (_, n) => factorial(parseInt(n)));
      }

      // Symbols → JS
      expr = expr.replace(/÷/g, "/").replace(/×/g, "*");

      const result = Function(`return ${expr}`)();
      setDisplay(String(result));
    } catch {
      setDisplay("Error");
    }
  };

  // Handle button clicks
  const handleClick = (value) => {
    if (value === "C") {
      setDisplay("0");
    } else if (value === "=") {
      calculate();
    } else if (value === "⌫") {
      setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
    } else {
      setDisplay(display === "0" ? value : display + value);
    }
  };

  // 🔥 Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      let key = e.key;

      if (/^[0-9.]$/.test(key)) {
        setDisplay((prev) => (prev === "0" ? key : prev + key));
      } else if (key === "+") {
        setDisplay((prev) => prev + "+");
      } else if (key === "-") {
        setDisplay((prev) => prev + "-");
      } else if (key === "*") {
        setDisplay((prev) => prev + "×"); // match button symbol
      } else if (key === "/") {
        setDisplay((prev) => prev + "÷"); // match button symbol
      } else if (key === "^") {
        setDisplay((prev) => prev + "^");
      } else if (key === "(" || key === ")") {
        setDisplay((prev) => prev + key);
      } else if (key === "Enter") {
        e.preventDefault();
        calculate();
      } else if (key === "Backspace") {
        setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      } else if (key === "Escape") {
        setDisplay("0");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Button layout
  const buttons = [
    ["MC", "MR", "MS", "M+", "M-", "C"],
    ["sin(", "cos(", "tan(", "log(", "ln(", "CE"],
    ["x²", "x³", "^", "√(", "1/", "⌫"],
    ["π", "e", "n!", "(", ")", "÷"],
    ["7", "8", "9", "×", "±", "-"],
    ["4", "5", "6", "+", "1", "2"],
    ["3", "0", ".", "=", "", ""],
  ];

  return (
    <div className="calculator">
      <div className="display">{display}</div>

      <div className="buttons">
        {buttons.flat().map((label, i) =>
          label ? (
            <Button
              key={i}
              label={label}
              onClick={handleClick}
              className={
                label === "C"
                  ? "btn-red"
                  : ["CE", "⌫"].includes(label)
                  ? "btn-orange"
                  : ["÷", "×", "+", "-", "^"].includes(label)
                  ? "btn-blue"
                  : label === "="
                  ? "btn-equal"
                  : ""
              }
            />
          ) : (
            <span key={i}></span>
          )
        )}
      </div>
    </div>
  );
}
