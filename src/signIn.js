import React, { Component } from "react";
import { Col, Row, Form, Button, Container } from "react-bootstrap";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;

    this.props.firebaseProps
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ email: "", password: "", error: null });
        this.props.history.push("/home");
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  handleClick(signin) {
    signin().then(() => this.props.history.push("/home"));
  }

  render() {
    const { user } = this.props.firebaseProps;

    const isInvalid = this.state.password === "" || this.state.email === "";


    return (
      <div className='myStyle'>
        <Container>
          {user === "" || user === null ? (
            <Row>
              <Col sm={4}>
                <br />
                <p>
                  You can login here with created account, or with your google
                  account
                </p>

                <Form onSubmit={this.onSubmit}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      onChange={this.onChange}
                    />
                    <Form.Text className="text-muted">email</Form.Text>
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      name="password"
                      onChange={this.onChange}
                    />
                  </Form.Group>

                  <Row>
                    <Col>
                      <Button
                        variant="warning"
                        disabled={isInvalid}
                        type="submit"
                      >
                        Login
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        variant="info"
                        onClick={() =>
                          this.props.resetPassword(this.state.email)
                        }
                      >
                        Password reset
                      </Button>
                    </Col>
                  </Row>
                </Form>
                <p>{this.state.error && <p>{this.state.error.message}</p>}</p>
                <Row>
                  <Col>
                    <Button
                      variant="success"
                      onClick={() =>
                        this.handleClick(
                          this.props.firebaseProps.signInWithGoogle
                        )
                      }
                    >
                      Sign in with Google
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col>
                <br />
                <Row>
                  <p>
                    You are already logged in as: <b> {this.props.user}</b>
                  </p>
                </Row>{" "}
                <Row>
                  <Button
                    variant="info"
                    onClick={this.props.firebaseProps.signOut}
                  >
                    Sign out
                  </Button>
                </Row>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    );
  }
}

export default SignIn;
