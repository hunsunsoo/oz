import React, { Component } from "react";
import "./AlphaBoard.css"; // 별도의 CSS 파일을 import 합니다.

class AlphaBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardData: [
        ['A', 'B', 'C', 'D', 'E', 'F'],
        ['G', 'H', 'I', 'J', 'K', 'L'],
        ['M', 'N', 'O', 'P', 'Q', 'R'],
        ['S', 'T', 'U', 'V', 'W', 'X'],
        ['Y', 'Z', 'a', 'b', 'c', 'd'],
        ['e', 'f', 'g', 'h', 'i', 'j']
      ]
    };
  }

  render() {
    return (
      <div className="alpha-board">
        {this.state.boardData.map((row, rowIndex) => (
          <div className="alpha-row" key={rowIndex}>
            {row.map((cell, columnIndex) => (
              <div
                className={rowIndex % 2 === columnIndex % 2 ? "alpha-cell even" : "alpha-cell odd"}
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

export default AlphaBoard;
