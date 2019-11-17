import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./task";
import AddTask from "./addTask";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { grid, colWidth } from "./styleConst";

const columnStyle = {
  fontWeight: "bold",
  fontSize: "x-large",
  color: "white ",
  textAlign: "center"
};

export default class Column extends React.Component {

  /*------------------------------------------------------------*/
  elementEdit = (takskEdited, actionToDo, text) => {
   this.props.elementEdit(takskEdited, actionToDo, text, this.props.column.id);
  };
  /*------------------------------------------------------------*/

  deleteCol = () => {
    this.props.elementEdit( "", "ColDelete","" ,this.props.column.id);
  };
  editCol = e => {
    e.stopPropagation();
    let text = this.props.column.title;
    this.props.elementEdit("", "ColEdit", text, this.props.column.id);
  };
  /*------------------------------------------------------------*/
  render() {
    const getItemStyle = (isDragging, draggableStyle) => ({
      // some basic styles to make the items look a bit nicer
      border: "solid DarkSlateBlue   ",
      userSelect: "none",
      padding: grid * 2,
      margin: 10,
      boxShadow: "10px 10px 5px MidnightBlue  ",
      // change background opacity if dragging
      background: isDragging
        ? " rgba(100, 149, 237,0.5)"
        : "  rgba(100, 149, 237,1)  ",
      borderRadius: 5,

      height: 65 * (this.props.column.tasks.length + 1) + 80,
      // styles we need to apply on draggables
      ...draggableStyle
    });

    const getListStyle2 = {
      padding: grid,
      width: colWidth,
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
            onClick={() => this.props.elementEdit("", false)}
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
                  <div style={columnStyle}>
                    <Row>
                      {this.props.action.actionName==="ColEdit" &&
                      this.props.action.actionItem === this.props.column.id ? (
                        <input
                          defaultValue={this.props.column.title}
                          onChange={e =>
                            this.props.elementEdit(
                              "",
                              "ColEdit",
                              e.target.value,
                              this.props.column.id
                            )
                          }
                          onClick={e => {
                            e.stopPropagation();
                          }}
                        ></input>
                      ) : (
                        <>
                          <Col sm={2}>
                            <FontAwesomeIcon
                              onClick={this.editCol}
                              icon={faEdit}
                            />
                          </Col>
                          <Col sm={8}>
                            {this.props.column.title
                              ? this.props.column.title
                              : '""'}
                          </Col>
                          <Col sm={2}>
                            <FontAwesomeIcon
                              onClick={this.deleteCol}
                              icon={faTrashAlt}
                            />
                          </Col>
                        </>
                      )}
                    </Row>
                  </div>

                  <div ref={provided.innerRef} style={getListStyle2}>
                    {this.props.column.tasks.map((item, index) => (
                      <Task
                        key={index}
                        item={item}
                        index={index}
                        elementEdit={this.elementEdit}
                        action={this.props.action}
                      />
                    ))}
                    {provided.placeholder}
                    <AddTask elementEdit={this.elementEdit} />
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
