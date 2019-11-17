import React from "react";
import Button from "react-bootstrap/Button";

const grid = 8;
const addTaskStyle = {
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  boxShadow: "10px 10px 5px MidnightBlue  ",
  backgroundColor: "rgb(238, 232, 170, 0.95)",
 // color: "green"
 color: "blue",
};

class AddTask extends React.Component {
  constructor(props) {
    super(props);

    this.clickAdd = this.clickAdd.bind(this);
  }
  clickAdd(e) {
    e.stopPropagation();
this.props.elementEdit("", "TaskAdd")
  }
  render() {
    return (
      <div>
        <Button style={addTaskStyle} onClick={this.clickAdd}>
          + Add task
        </Button>
      </div>
    );
  }
}
export default AddTask;
