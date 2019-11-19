import React, { Component } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
//import { initData } from "./initData";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Column from "./column";
import AddColumn from "./addColumn";
import Firebase from "firebase";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const findIndex = (list, item) => {
  return list
    .map(e => {
      return e.id;
    })
    .indexOf(item);
};

const getListStyle = {
  display: "flex",
  padding: 5,
  margin: 20,
  color: "black"
};
const config = {
  apiKey: "AIzaSyCmrU0AuRpNGPRsD2-JjQ5os7gPjKGxHMo",
  authDomain: "tribal-drake-257712.firebaseapp.com",
  databaseURL: "https://tribal-drake-257712.firebaseio.com",
  projectId: "tribal-drake-257712",
  storageBucket: "tribal-drake-257712.appspot.com",
  messagingSenderId: "577742396333",
  appId: "1:577742396333:web:8a52c828c3edb5de21df24"
};
class App extends Component {
  constructor(props) {
    super(props);
    Firebase.initializeApp(config);
    this.state = {
      column: [],
      width: window.innerWidth,
      height: window.innerHeight,
      colMinHeight: 6,
      colNumber: 4,
      action: { actionName: "", actionItem: "" }
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.elementEdit = this.elementEdit.bind(this);
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    this.getUserData();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  writeUserData = () => {
    Firebase.database()
      .ref("/columns")
      .set(this.state.column);
    console.log("DATA SAVED");
  };
  getUserData = () => {
    let ref = Firebase.database().ref("/columns");
    ref.on("value", snapshot => {
      let retrived = snapshot.val();
      if (retrived === null) retrived = [];
      else {
        for (let i = 0; i < retrived.length; i++) {
          if (retrived[i].tasks === undefined) retrived[i].tasks = [];
        }
      }

      this.setState(
        { column: retrived } //() => console.log(this.state)
      );
    });
    console.log("DATA RETRIEVED");
  };
  /*------------------------------------------------------------*/
  elementEdit(id, actionToDo, text, columnId) {
    let data = this.state.column;

    let columnNo = findIndex(data, columnId);
    switch (actionToDo) {
      case "ColAdd":
        let maxColId;
        if (data.length === 0) maxColId = 0;
        else
          maxColId = Math.max.apply(
            null,
            data.map(column => {
              return parseInt(column.id.slice(3));
            })
          );
        data.push({ id: "col" + (maxColId + 1), title: "", tasks: [] });

        this.setState({
          action: {
            actionName: "ColEdit",
            actionItem: "col" + (maxColId + 1)
          }
        });
        break;
      case "ColEdit":
        data[columnNo].title = text;
        this.setState({
          column: data,
          editingCol: true,
          editingColId: columnId,
          action: { actionName: "ColEdit", actionItem: columnId }
        });
        break;
      case "ColDelete":
        data.splice(findIndex(data, columnId), 1);
        break;
      case "TaskDelete":
        const columns = this.state.column;
        const myColumn = columns[findIndex(columns, columnId)];

        myColumn.tasks.splice(findIndex(myColumn.tasks, id), 1);
        //action = false;
        break;
      case "TaskEdit":
        let taskNo = findIndex(data[columnNo].tasks, id);
        data[columnNo].tasks[taskNo].content = text;
        this.setState({ column: data });
        this.setState({
          action: { actionName: actionToDo, actionItem: id }
        });
        break;
      case "TaskAdd":
        let maxTaskId = Math.max.apply(
          null,
          data.map(columns => {
            let helpWithNoTasksCase;
            if (columns.tasks.length === 0) helpWithNoTasksCase = [0];
            else
              helpWithNoTasksCase = columns.tasks.map(task => {
                return parseInt(task.id.slice(4));
              });

            return Math.max.apply(null, helpWithNoTasksCase);
          })
        );

        data[columnNo].tasks.push({
          id: "task" + (maxTaskId + 1),
          content: ""
        });
        this.setState({
          column: data,

          action: {
            actionName: "TaskEdit",
            actionItem: "task" + (maxTaskId + 1)
          }
        });
        break;
      default:
        this.setState({ action: { actionName: "", actionItem: "" } });
        break;
    }

    this.setState({ column: data });
    this.writeUserData();
  }
  /*------------------------------------------------------------*/
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
      this.setState(
        {
          column
        },
        () => this.writeUserData()
      );
    } else {
      if (source.droppableId === destination.droppableId) {
        const column = this.state.column;
        const tasks = reorder(
          this.state.column[source.droppableId.slice(9)].tasks,
          result.source.index,
          result.destination.index
        );
        column[source.droppableId.slice(9)].tasks = tasks;
        this.setState({ tasks }, () => this.writeUserData());
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

        this.setState(
          {
            column
          },
          () => this.writeUserData()
        );

        this.setState({
          colMinHeight: Math.max(
            ...this.state.column.map(column => column.tasks.length)
          )
        });
      }
    }
  };
  /*------------------------------------------------------------*/
  render() {
    const someStyle = {
      minHeight: this.state.height,
      minWidth: this.state.colNumber * 358 + 300, // calculating screen width
      background: "SteelBlue",
      color: "white"
    };

    return (
      <div
        style={someStyle}
        onClick={() =>
          this.setState({
            editCol: false,
            editingColId: "",
            action: { actionName: "", actionItem: "" }
          })
        }
      >
        <Container style={{ margin: 0 }}>
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
                    <div ref={provided.innerRef} style={getListStyle}>
                      {this.state.column.map((column, index) => (
                        <Column
                          key={index}
                          column={column}
                          index={index}
                          colMinHeight={this.state.colMinHeight}
                          elementEdit={this.elementEdit}
                          action={this.state.action}
                        />
                      ))}
                      {provided.placeholder}
                      <AddColumn elementEdit={this.elementEdit} />
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
