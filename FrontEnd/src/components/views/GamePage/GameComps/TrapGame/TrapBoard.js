import React, {useState} from "react";
import "./TrapBoard.css"

const MiroRed = ({boardData}) => {
    const PicStyle = {
      width: 'auto',
      height: '70%',
      borderRadius: '50%',
      objectFit: 'cover',
    }
  
    return (
      <div className="miro-red">
        {boardData.map((row, rowIndex) => (
          <div className="miro-red-row" key={rowIndex}>
            {row.map((value, columnIndex) => (
              <div
                className={`cell ${Math.floor(value / 10) === 1 ? "miro-red-cell" : "miro-gray-cell"}`}
                // style={{ backgroundColor: color === 1 ? 'red' : '#979797' }}
                key={columnIndex}
              >
                {value % 10 === 1 ? (<img src="image/game/trapGame/start.png" style={PicStyle} />) : (null)}
                {value % 10 === 2 ? (<img src="image/game/trapGame/finish.png" style={PicStyle} />) : (null)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  const MiroGreen = ({boardData}) => {
    const PicStyle = {
      width: 'auto',
      height: '70%',
      borderRadius: '50%',
      objectFit: 'cover',
    }
  
    return (
      <div className="miro-green">
        {boardData.map((row, rowIndex) => (
          <div className="miro-green-row" key={rowIndex}>
            {row.map((value, columnIndex) => (
              <div
                className={`cell ${Math.floor(value / 10) === 2 ? "miro-green-cell" : "miro-gray-cell"}`}
                key={columnIndex}
              >
                {value % 10 === 3 ? (<img src="image/game/trapGame/bomb.png" style={PicStyle} />) : (null)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  const MiroBlue = ({boardData}) => {
    const PicStyle = {
      width: 'auto',
      height: '70%',
      borderRadius: '50%',
      objectFit: 'cover',
    }
  
    return (
      <div className="miro-blue">
        {boardData.map((row, rowIndex) => (
          <div className="miro-blue-row" key={rowIndex}>
            {row.map((value, columnIndex) => (
              <div
                className={`cell ${Math.floor(value / 10) === 3 ? "miro-blue-cell" : "miro-gray-cell"}`}
                key={columnIndex}
              >
                {value % 10 === 4 ? (<img src="image/game/trapGame/ghost.png" alt="Profile" style={PicStyle} />) : (null)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  export { MiroRed, MiroGreen, MiroBlue };