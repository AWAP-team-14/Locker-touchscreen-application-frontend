import React from "react";

const VirtualKeyboard = ({ onKeyPress }) => {
  const keyboardLayout = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["0", "X", "C"], // X for backspace, C for clear
  ];

  return (
    <div className="keyboard w-50 m-auto bg-dark rounded text-center p-3 pt-0">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className="btn btn-secondary m-2 btn-lg  "
              onClick={() => onKeyPress(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
