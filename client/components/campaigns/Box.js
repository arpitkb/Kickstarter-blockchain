import React from "react";

const Box = (props) => {
  return (
    <div className='box d-flex flex-column justify-content-center align-items-center'>
      <div className='mb-2'>{props.value}</div>
      <div style={{ fontSize: "1.12rem", fontWeight: "600" }}>
        {props.attribute}
      </div>
    </div>
  );
};

export default Box;
