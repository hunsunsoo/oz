import React, {useState, useEffect} from "react";
import "./CalBoard.css";

const NumberBoard = ({ boardData }) => {
  return (
    <div className="number-board">
      {boardData.map((row, rowIndex) => (
        <div className="number-row" key={rowIndex}>
          {row.map((cell, columnIndex) => (
            <div
              className={rowIndex % 2 === columnIndex % 2 ? "number-cell even" : "number-cell odd"}
              key={columnIndex} >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const AlphaBoard = ( {onCellClick, boardData, sel11, sel12, sel21, sel22, sel41, sel42, client, roundId, helperState, helperSubmit, myRole } ) => {
  
  useEffect(() => {
    if (helperSubmit === 1) {
      sendAidSelectedCells();
    }
  }, [helperSubmit]);

  // 조력자 선택 알파벳 pub
  const sendAidSelectedCells = async () => {
    try {
      if (!client) {
        console.log('웹소켓이 연결중이 아닙니다. 메시지 보내기 실패');
        return;
      }

      if(myRole === 1){ // 도로시만 보냄
        let selectedCells = [];
        let defaultCell = 'a';

        if (sel11 !== '.') {
          selectedCells.push(sel11);
          defaultCell = sel11;
        } else{
          selectedCells.push(defaultCell);
        }

        if (sel12 !== '.') {
          selectedCells.push(sel12);
          defaultCell = sel12;
        } else{
          selectedCells.push(defaultCell);
        }

        if (sel21 !== '.') {
          selectedCells.push(sel21);
          defaultCell = sel21;
        } else{
          selectedCells.push(defaultCell);
        }

        if (sel22 !== '.') {
          selectedCells.push(sel22);
          defaultCell = sel22;
        } else{
          selectedCells.push(defaultCell);
        }

        if (sel41 !== '.') {
          selectedCells.push(sel41);
          defaultCell = sel12;
        } else{
          selectedCells.push(defaultCell);
        }

        if (sel42 !== '.') {
          selectedCells.push(sel42);
          defaultCell = sel42;
        } else{
          selectedCells.push(defaultCell);
        }

        console.log("egwagwae");
        console.log(selectedCells);

        const message = {
          "selectedNums": selectedCells,
        };

        client.send(`/pub/calculation/helpersubmit/${roundId}`, {}, JSON.stringify(message));
      };
    } catch (error) {
      console.log('Error sending message:', error);
    }
  }

  const checkSelected = (cell) => {
    if(cell === sel11){
      return true;
    } else if(cell === sel12){
      return true;
    } else if(cell === sel21){
      return true;
    } else if(cell === sel22){
      return true;
    } else if(cell === sel41){
      return true;
    } else if(cell === sel42){
      return true;
    } else {
      return false;
    }
  };

  console.log(sel11, sel12, sel21, sel22, sel41, sel42)

  return (
    <div className="alpha-board">
      {boardData.map((row, rowIndex) => (
        <div className="alpha-row" key={rowIndex}>
          {row.map((cell, columnIndex) => (
            <div
              className={rowIndex % 2 === columnIndex % 2 ? "alpha-cell even" : "alpha-cell odd"}
              key={columnIndex}
              onClick={() => onCellClick(cell)}
              style={{
                // Apply red border style to selected cells
                outline: checkSelected(cell) ? "2px solid red" : "none",
                outlineOffset: "-2px" }} >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const AlphaBoardH = ( { onHandleCellClick, boardData, client, roundId, head } ) => {

  const cellClick = (row, col) => {
    if(head === 0 || head === 2 || head === 4){
      onHandleCellClick(row, col);
    } else {
      console.log("기호를 골라라 or 다 골랐 잖아")
    }
  };

  return (
    <div className="alpha-board">
      {boardData.map((row, rowIndex) => (
        <div className="alpha-row" key={rowIndex}>
          {row.map((cell, columnIndex) => (
            <div
              className={rowIndex % 2 === columnIndex % 2 ? "alpha-cell even" : "alpha-cell odd"}
              key={columnIndex}
              onClick={() => cellClick(rowIndex, columnIndex)} >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const MathBoard = ({ onHandleCellClick, head}) => {
    const boardData = [
      ["+", "-"],
      ["x", "/"]
    ];

    const cellClick = (cell) => {
      if(head === 1 || head === 3){
        onHandleCellClick(cell);
      } else {
        console.log("숫자를 골라라 or 다골랐잖아")
      }
    };
  
    return (
      <div className="math-board">
        {boardData.map((row, rowIndex) => (
          <div className="math-row" key={rowIndex}>
            {row.map((cell, columnIndex) => (
              <div
                className={rowIndex % 2 === columnIndex % 2 ? "math-cell even" : "math-cell odd"}
                key={columnIndex}
                onClick={() => cellClick(cell)}>
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

const AnsBoard = ({ tableData, head }) => {
  
  return (
    <div className="ans-board">
      {tableData.map((row, rowIndex) => (
      <div className="ans-row" key={rowIndex}>
        {row.map((cell, columnIndex) => (
          <div
            className={columnIndex % 2 === 0 ? "ans-cell even" : "ans-cell odd"}
            key={columnIndex}
            style={{
              // Apply red border style to selected cells
              outline: head === columnIndex ? "2px solid red" : "none",
              outlineOffset: "-2px"
            }} >
            {cell}
          </div>
        ))}
      </div>
      ))}
    </div>
  );
};


export { NumberBoard, AlphaBoard, AlphaBoardH, MathBoard, AnsBoard };
