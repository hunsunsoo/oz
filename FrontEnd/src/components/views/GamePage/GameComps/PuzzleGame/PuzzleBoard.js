import React from "react";
import { useDrop } from "react-dnd";
import Picture from "./Picture";
import style from "./PuzzleGame.module.css";

const Board = ({ index, picture, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "image",
    drop: (item) => onDrop(index, item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        width: "60px",
        height: "60px",
        border: "2px solid black",
        display: "inline-block",
        margin: "10px",
        backgroundColor: isOver ? "rgba(0, 255, 0, 0.2)" : "white",
      }}
    >
      {picture && <Picture url={picture.url} id={picture.id} />}
    </div>
  );
};

export default Board;
