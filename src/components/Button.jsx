import React from "react";

function Button(props) {
  return (
    <div className="col-sm-3">
      <button onClick={props.onClick} className={props.className}>
        {props.name}
      </button>
    </div>
  );
}

export default Button;
