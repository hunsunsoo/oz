import React, {useState} from "react";
import "./Board.css"; // 별도의 CSS 파일을 import 합니다.

const NumberBoard = ({ boardData }) => {
  return (
    <div className="number-board">
      {boardData.map((row, rowIndex) => (
        <div className="number-row" key={rowIndex}>
          {row.map((cell, columnIndex) => (
            <div
              className={rowIndex % 2 === columnIndex % 2 ? "number-cell even" : "number-cell odd"}
              key={columnIndex}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const AlphaBoard = ( {onCellClick} ) => {
  const boardData = [
    ['A', 'B', 'C', 'D', 'E', 'F'],
    ['G', 'H', 'I', 'J', 'K', 'L'],
    ['M', 'N', 'O', 'P', 'Q', 'R'],
    ['S', 'T', 'U', 'V', 'W', 'X'],
    ['Y', 'Z', 'a', 'b', 'c', 'd'],
    ['e', 'f', 'g', 'h', 'i', 'j']
  ];

  const [selectedCells, setSelectedCells] = useState([]);

  const handleClick = (cellValue) => {
    const isCellSelected = selectedCells.includes(cellValue);

    if (isCellSelected) {
      setSelectedCells(selectedCells.filter((value) => value !== cellValue));
    } else {
      setSelectedCells([...selectedCells, cellValue]);
    }

    onCellClick(selectedCells);
  };

  return (
    <div className="alpha-board">
      {boardData.map((row, rowIndex) => (
        <div className="alpha-row" key={rowIndex}>
          {row.map((cell, columnIndex) => (
            <div
              className={rowIndex % 2 === columnIndex % 2 ? "alpha-cell even" : "alpha-cell odd"}
              key={columnIndex}
              onClick={() => handleClick(cell)}
              style={{
                // Apply red border style to selected cells
                outline: selectedCells.includes(cell) ? "2px solid red" : "none",
                outlineOffset: "-2px"
              }}
            >
              {cell} 
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const MathBoard = () => {
    const boardData = [
      ["+", "-"],
      ["x", "%"]
    ];
  
    return (
      <div className="math-board">
        {boardData.map((row, rowIndex) => (
          <div className="math-row" key={rowIndex}>
            {row.map((cell, columnIndex) => (
              <div
                className={rowIndex % 2 === columnIndex % 2 ? "math-cell even" : "math-cell odd"}
                key={columnIndex}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

const AnsBoard = () => {
  const tableData = ['K', '+', 'J', '-', 'H'];

  return (
    <div className="ans-board">
      <div className="ans-row">
        {tableData.map((cell, columnIndex) => (
          <div
            className={columnIndex % 2 === 0 ? "ans-cell even" : "ans-cell odd"}
            key={columnIndex}
          >
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
};
  
const MiroRed = () => {
  const boardData = [
    [0, 1, 1, 0, 0, 0],
    [0, 0, 1, 0, 1, 0],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1],
    [1, 0, 1, 0, 0, 0]
  ];

  return (
    <div className="miro-red">
      {boardData.map((row, rowIndex) => (
        <div className="miro-red-row" key={rowIndex}>
          {row.map((color, columnIndex) => (
            <div
              className={rowIndex % 2 === columnIndex % 2 ? "miro-red-cell even" : "miro-red-cell odd"}
              style={{ backgroundColor: color === 1 ? 'red' : '#979797' }}
              key={columnIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const MiroGreen = () => {
  const boardData = [
    [1, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 1],
    [0, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 0],
    [1, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 1]
  ];

  return (
    <div className="miro-green">
      {boardData.map((row, rowIndex) => (
        <div className="miro-green-row" key={rowIndex}>
          {row.map((color, columnIndex) => (
            <div
              className={rowIndex % 2 === columnIndex % 2 ? "miro-green-cell even" : "miro-green-cell odd"}
              style={{ backgroundColor: color === 1 ? 'green' : '#979797' }}
              key={columnIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const MiroBlue = () => {
  const boardData = [
    [1, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 1],
    [0, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 0],
    [1, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 1]
  ];

  return (
    <div className="miro-blue">
      {boardData.map((row, rowIndex) => (
        <div className="miro-blue-row" key={rowIndex}>
          {row.map((color, columnIndex) => (
            <div
              className={rowIndex % 2 === columnIndex % 2 ? "miro-blue-cell even" : "miro-blue-cell odd"}
              style={{ backgroundColor: color === 1 ? 'blue' : '#979797' }}
              key={columnIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export { NumberBoard, AlphaBoard, MathBoard, AnsBoard, MiroRed, MiroGreen, MiroBlue };
