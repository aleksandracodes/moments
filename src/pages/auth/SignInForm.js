import React, { useState } from "react";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

function SignInForm() {
  // 1. destructure the useState hook with signInData and setSignInData
  const [signInData, setSignInData] = useState({
    // 2. set the default value to an object with two properties username and password, and set their values to an empty string
    username: "",
    password: "",
  });
  // 3. destructure username and password from signInData
  const { username, password } = signInData;

  // 9. useState hook with an empty object, where we will store all the errors
  const [errors, setErrors] = useState({});

  const history = useHistory();

  // 7. create a form submit handler, which will be an async function called handleSubmit with an event parameter
  const handleSubmit = async (event) => {
    event.preventDefault(); // call event.preventDefault() so that the page doesn’t refresh
    try {
      await axios.post("/dj-rest-auth/login/", signInData); // create a try-catch block, we’ll use axios to post all the signInData to the /dj-rest-auth/login/ endpoint
      history.push("/"); // redirect the user to the home page after successfully logging in
    } catch (err) {
      setErrors(err.response?.data); // 10. handle errors
    }
  };

  // 5. create an onChange handler function called handleChange, to handle the SignInData and update the state using a computed property name and dot notation
  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Row className={styles.Row}>
      <Col className="my-auto p-0 p-md-2" md={6}>
        <Container className={`${appStyles.Content} p-4 `}>
          <h1 className={styles.Header}>sign in</h1>

          {/* 8. add an onSubmit prop and pass it the handleSubmit function */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                className={styles.Input}
                type="text"
                placeholder="Username"
                name="username"
                value={username} // 4. add the value prop to each Form.Control element using the destructured username and password variables
                onChange={handleChange} // 6. add the onChange prop to each Form.Control component, and set it to the handleChange function
              />
            </Form.Group>

            {/* 11. Display error messages for each input field */}
            {errors.username?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Form.Group controlId="password">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleChange}
              />
            </Form.Group>

            {errors.password?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Button
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
              type="submit"
            >
              Sign In
            </Button>

            {/* Alert for non-field errors */}
            {errors.non_field_errors?.map((message, idx) => (
              <Alert variant="warning" key={idx} className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
        </Container>
        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signup">
            Don't have an account? <span>Sign up now!</span>
          </Link>
        </Container>
      </Col>
      <Col
        md={6}
        className={`my-auto d-none d-md-block p-2 ${styles.SignInCol}`}
      >
        <Image
          className={`${appStyles.FillerImage}`}
          src={"https://codeinstitute.s3.amazonaws.com/AdvancedReact/hero.jpg"}
        />
      </Col>
    </Row>
  );
}

export default SignInForm;
