import React, { Component } from "react";
import "./NumberBoard.css"; // 별도의 CSS 파일을 import 합니다.

class NumberBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardData: [
        [1, 2, 3, 4, 5, 6],
        [7, 8, 9, 10, 11, 12],
        [13, 14, 15, 16, 17, 18],
        [19, 20, 21, 22, 23, 24],
        [25, 26, 27, 28, 29, 30],
        [31, 32, 33, 34, 35, 36]
      ]
    };
  }

  render() {
    return (
      <div className="number-board">
        {this.state.boardData.map((row, rowIndex) => (
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
  }
}

export default NumberBoard;
