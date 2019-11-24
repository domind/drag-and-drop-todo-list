import React, { Component } from "react";
import { Col, Row, Form, Button, Container } from "react-bootstrap";

const INITIAL_STATE = {
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { email, passwordOne } = this.state;
    this.props.firebaseProps
      .createUserWithEmailAndPassword(email, passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      })
      .then(() => {
        if (this.state.error === null) this.props.history.push("/home");
      });
    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === "" || email === "";

    return (
      <div className='myStyle'>
        <Container>
          <Row>
            <Col sm={4}>
              <br />
              <p>You can create your account here</p>
              <form onSubmit={this.onSubmit}>
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
                    name="passwordOne"
                    onChange={this.onChange}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="passwordTwo"
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
                      Sign Up
                    </Button>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <br />
                    {error && <p>{error.message}</p>}
                  </Col>
                </Row>
              </form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
export default SignUpForm;
