import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit,faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { grid} from "./styleConst";


const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  // change background colour if dragging
  background: isDragging ? "rgba(238, 232, 170,0.7) " : "rgb(238, 232, 170, 0.95)",
  color: "blue",
  boxShadow: "10px 10px 5px MidnightBlue  ",
  borderRadius: 5,
  // styles we need to apply on draggables
  ...draggableStyle
});

export default class Task extends React.Component {
  constructor(props) {
    super(props);

    this.openEdit = this.openEdit.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }
deleteTask(e){
  e.stopPropagation();
  this.props.elementEdit(this.props.item.id, "TaskDelete", this.props.item.content);
}
  openEdit(e) {
    e.stopPropagation();
    this.props.elementEdit(this.props.item.id, "TaskEdit", this.props.item.content);
  }

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
            onClick={() => this.props.elementEdit("", false)}
          >
            {" "}
            {this.props.action.actionName==="TaskEdit" &&
            this.props.action.actionItem === this.props.item.id ? (
              <div>
                <input
                  defaultValue={this.props.item.content}
                  onChange={e =>
                    this.props.elementEdit(
                      this.props.item.id,
                      this.props.action.actionName,
                      e.target.value
                    )
                  }
                  onClick={e => {
                    e.stopPropagation();
                  }}
                />
              </div>
            ) : (
              <Row>
                 <Col sm={2} >
                  <FontAwesomeIcon
                    id={this.props.item.id}
                    onClick={this.openEdit}
                    icon={faEdit}
                  />
                </Col>
                <Col
                  sm={8}
                  style={{
                    overflow: "hidden",
                    width: 100,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                   // border:"solid",
                  }}
                >
                  {this.props.item.content + " "}
                </Col>
                <Col sm={2} >
                  <FontAwesomeIcon
                    id={this.props.item.id}
                    onClick={this.deleteTask}
                    icon={faTrashAlt}
                  />
                </Col>
              </Row>
            )}
          </div>
        )}
      </Draggable>
    );
  }
}
