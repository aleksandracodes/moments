import React, { useEffect, useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import { useHistory, useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function PostEditForm() {

  const [errors, setErrors] = useState({});

  const [postData, setPostData] = useState({
      title: "",
      content: "",
      image: "",
  });

  const {title, content, image} = postData;

  const imageInput = useRef(null);

  const history = useHistory()

  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/${id}/`);
        const { title, content, image, is_owner } = data;  // destructure the data we received back from the API

        is_owner ? setPostData({ title, content, image }) : history.push("/");  // only allow the post owner to access the edit post page in the first place
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [history, id]);

  const handleChange = (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeImage = (e) => {
      if (e.target.files.length) {
          URL.revokeObjectURL(image);
          setPostData({
              ...postData,
              image: URL.createObjectURL(e.target.files[0]),
          });
      }
  };

  const handleSubmit = async (e) => {
      e.preventDefault()
      const formData = new FormData();

      formData.append('title', title)
      formData.append('content', content)

      // So we first need to check if the imageInput element has a file in it, before we try to 
      // append it to the formData. If it doesn't, the original file will stay in place in our API
      if (image.Input?.current?.files[0]) {
      formData.append('image', imageInput.current.files[0])
      }

      // change post to a put() method, so we can update an existing post instead of creating a new one
      // and we’ll pass our post id into the API request string so it knows which post to update. 
      try {
          await axiosReq.put(`/posts/${id}/`, formData);
          history.push(`/posts/${id}`)  // use the id to redirect the user back to the post they just edited

      } catch(err) {
        console.log(err)
        if (err.response?.status !== 401) {
            setErrors(err.response?.data)
        }
      }
  }

  const textFields = (
    <div className="text-center">
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                name="title"
                value={title}
                onChange={handleChange}
              />
            </Form.Group>

            {errors.title?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={6} 
                name="content" 
                value={content}
                onChange={handleChange}
              />
            </Form.Group>
    
            {errors.content?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        // take our user back to the previous page in their browser history
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        save
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              <figure>
                <Image className={appStyles.Image} src={image} rounded />
              </figure>
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
              </div>

              <Form.File
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default PostEditForm;