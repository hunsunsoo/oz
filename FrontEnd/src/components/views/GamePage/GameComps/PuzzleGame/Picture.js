import React from "react";
import { useDrag } from "react-dnd";

function Picture({ id, url }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    item: { id: id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const style = {
    width: "60px",
    height: "60px",
    backgroundImage: `url(${url})`,
    backgroundSize: "cover",
    border: isDragging ? "3px solid pink" : "1px",
  };

  return <div ref={drag} style={style} />;
}

export default Picture;
