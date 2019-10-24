import React from "react";
import { Draggable } from "react-beautiful-dnd";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  // change background colour if dragging
  background: isDragging ? "Chocolate " : "PaleGoldenRod",
  color: "blue",
  boxShadow: "10px 10px 5px MidnightBlue  ",
  borderRadius: 5,
  // styles we need to apply on draggables
  ...draggableStyle
});

export default class Task extends React.Component {
  render() {
    return (
      <Draggable
        key={this.props.item.id}
        draggableId={this.props.item.id}
        index={this.props.index}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
          >
            {this.props.item.content}
          </div>
        )}
      </Draggable>
    );
  }
}
