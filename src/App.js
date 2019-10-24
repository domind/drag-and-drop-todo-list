import React, { Component } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { initData } from "./initData";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Column from "./column";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getListStyle = () => ({
  display: "flex",
  padding: 5,
  margin: 20,
  color: "black"
  //  overflow: "auto"
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      column: initData,
      width: window.innerWidth,
      height: window.innerHeight,
      colMinHeight: 6
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  onDragEnd = result => {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === "board") {
      let column = this.state.column;
      const columnMoved = reorder(
        this.state.column,
        result.source.index,
        result.destination.index
      );

      column = columnMoved;
      this.setState({
        column
      });
    } else {
      if (source.droppableId === destination.droppableId) {
        const column = this.state.column;
        const tasks = reorder(
          this.state.column[source.droppableId.slice(9)].tasks,
          result.source.index,
          result.destination.index
        );
        column[source.droppableId.slice(9)].tasks = tasks;
        this.setState({ tasks });
      } else {
        let column = this.state.column;

        const sourceColumn = Array.from(
          column[source.droppableId.slice(9)].tasks
        ); //source.droppableId.slice(9)
        const destColumn = Array.from(
          column[destination.droppableId.slice(9)].tasks
        );

        const [removed] = sourceColumn.splice(source.index, 1);
        destColumn.splice(destination.index, 0, removed);
        column[source.droppableId.slice(9)].tasks = sourceColumn;
        column[destination.droppableId.slice(9)].tasks = destColumn;

        this.setState({
          column
        });

        this.setState({
          colMinHeight: Math.max(
            ...this.state.column.map(column => column.tasks.length)
          )
        });
      }
    }
  };

  render() {
    const someStyle = {
      background: "SteelBlue",
      minHeight: this.state.height,
      color: "white"
    };

    return (
      <div style={someStyle}>
        <Container>
          <Row>
            <Col style={{ textAlign: "center" }}>
              <h1>Testing react-beautiful-dnd</h1>
            </Col>
          </Row>

          <Row>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable
                direction="horizontal"
                droppableId="board"
                type="COLUMN"
              >
                {(provided, snapshot) => (
                  <div>
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {this.state.column.map((column, index) => (
                        <Column
                          key={index}
                          column={column}
                          index={index}
                          colMinHeight={this.state.colMinHeight}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
