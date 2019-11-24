import React, { Component } from "react";
import { Col, Row, Button, Container } from "react-bootstrap";

class Landing extends Component {


  render() {
    return (
      <div className='myStyle'>
        <Container>
          <Row>
            <p></p>
          </Row>
          {this.props.user === "" || this.props.user === null ? (
            <div>
              <Row>
                <Col sm={6}>
                  <h3>This is Trello like ToDo project</h3>
                  <p>
                    You can create account with e-mail and password, or sign in
                    with your google account to view and edit your personal
                    board
                  </p>
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <p>Create your account </p>
                </Col>
                <Col sm={3}>
                  <Button onClick={() => this.props.history.push("/signup")}>
                    Sign up
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <p>Sign in to existing account</p>
                </Col>
                <Col sm={3}>
                  <Button onClick={() => this.props.history.push("/signin")}>
                    Sign in
                  </Button>
                </Col>
              </Row>
            </div>
          ) : (
            <div>
              <Row>
          <p>You are logged as: {this.props.user}</p>
              </Row>
              <Row>
                
                <Col sm={3}>
                  <Button onClick={() => this.props.history.push("/home")}>
                    My board
                  </Button>
                </Col>
              </Row>
              <Row>
                <p></p>
              </Row>
              <Row>
                <Col sm={3}>
                  <Button onClick={this.props.firebaseProps.signOut}>
                    Sign out
                  </Button>
                </Col>
              </Row>
            </div>
          )}
        </Container>
      </div>
    );
  }
}
export default Landing;
