import React from "react";
import Button from "react-bootstrap/Button";
import {grid,colWidth} from "./styleConst"
//const grid = 8;
const addColStyle = {
  padding: grid * 2,
  margin: 10,
  boxShadow: "10px 10px 5px MidnightBlue  ",
  backgroundColor: "rgba(100, 149, 237,1)",
  color: "white",
  width: colWidth,
  minHeight: 40
};

class AddColumn extends React.Component {
  constructor(props) {
    super(props);

    this.clickAdd = this.clickAdd.bind(this);
  }
  clickAdd(e) {
    e.stopPropagation();
this.props.elementEdit("","ColAdd")
  }
  render() {
    return (
      <div>
        <Button style={addColStyle} onClick={this.clickAdd}>
          + Add column
        </Button>
      </div>
    );
  }
}
export default AddColumn;
