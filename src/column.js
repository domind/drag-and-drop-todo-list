import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./task";

const grid = 8;

const columnStyle = {
  fontWeight: "bold",
  fontSize: "x-large",
  color: "PaleGoldenRod ",
  textAlign: "center"
};

export default class Column extends React.Component {
  render() {
    const getItemStyle = (isDragging, draggableStyle) => ({
      // some basic styles to make the items look a bit nicer
      border: "solid DarkSlateBlue   ",

      userSelect: "none",
      padding: grid * 2,
      margin: 10,
      boxShadow: "10px 10px 5px MidnightBlue  ",
      // change background colour if dragging
      background: isDragging ? "PowderBlue " : " CornflowerBlue ",
      borderRadius: 5,
      // styles we need to apply on draggables
      height: 65 * this.props.column.tasks.length + 100,

      ...draggableStyle
    });

    const getListStyle2 = {
      // background: isDraggingOver ? "lightblue" : "lightgrey",
      padding: grid,
      //  border : "solid",
      width: 200,
      minHeight: 40
    };
    return (
      <Draggable
        key={this.props.column.id}
        draggableId={this.props.column.id}
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
            <Droppable droppableId={"droppable" + this.props.index}>
              {(provided, snapshot) => (
                <div>
                  <div style={columnStyle}>{this.props.column.title}</div>

                  <div ref={provided.innerRef} style={getListStyle2}>
                    {this.props.column.tasks.map((item, index) => (
                      <Task key={index} item={item} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        )}
      </Draggable>
    );
  }
}
