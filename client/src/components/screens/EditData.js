import React, { useState, useRef , useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Dropzone from "react-dropzone";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import M from "materialize-css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../utils/constants";

function EditPost() {
  const history = useHistory();
  const { id } = useParams();
  const [postdata, setPostdata] = useState((
    {
        "title":"",
        "description":"",
        "members": "",
        "member1":"",
        "sec1":"",        
        "mobile1":"",
        "member2":"",
        "sec2":"",        
        "mobile2":"",
        "member3":"",
        "sec3":"",        
        "mobile3":"",
        "member4":"",
        "sec4" :"",        
        "mobile4":"",
        "member5" :"",
        "sec5" :"",        
        "mobile5" :""
    }
  ))

  const handleChange = (e) => {
    setPostdata({...postdata,[e.target.name]: e.target.value})
  }
  let {title,description,members,member1,sec1,mobile1,member2,sec2,mobile2,member3,sec3,mobile3,member4,sec4,mobile4,member5,sec5,mobile5} = postdata

  useEffect (() => {
    loaddata()
  },[])

  const loaddata = async() => {
    const result = await axios.get(`${API_URL}/edit/` +id)
    setPostdata(result.data)
    console.log("result.data",result.data)
  }

  const submitForm = async(e) => {
    e.preventDefault();
    await axios.put(`${API_URL}/updatedata/${id}`, postdata)
    M.toast({ html: "Data updated Successfully", classes: " green" });
    history.push("/");
    // .then((result) => {
    //   console.log("result",result)
    // }).catch((err)=> {
    //   console.log(err)
    // })
  }
  const [errorMsg, setErrorMsg] = useState("");

  return (
    <div className="container post-container">
      <div style={{ marginTop: "4rem" }} className="row">
        <div className="col s10 offset-s1">
          <Link to="/" className="btn-flat waves-effect">
            <i className="material-icons left">keyboard_backspace</i>
            Back to home
          </Link>
          <div className="col s12" style={{ paddingLeft: "11.250px" }}>
            <h4>
              <b>Edit Team Details</b>
            </h4>
          </div>

          <Form onSubmit={e => submitForm(e)} >
            {errorMsg && <p className="errorMsg">{errorMsg}</p>}
            <Row >
              <Col style={{width: "100%"}}>
                <Form.Group controlId="title">
                  <Form.Control type="text" name="title" placeholder="Enter title" value={title} onChange={e => handleChange(e)}/>
                </Form.Group>
              </Col>
            </Row>
            <Row className="quarter-div">
          <Col style={{ width: "70%"}}>
            <Form.Group controlId="description">
              <Form.Control
                type="text"
                name="description"
                // value={state.description || ""}
                value={description}
                placeholder="Enter description"
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </Col>
          <Col style={{width: "30%"}}>
            <Form.Group controlId="members">
              <Form.Control
                type="number"
                name="members"
                value={members }
                placeholder="Total Members"
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="half-div">
          <div className="half-div-child">
            <Form.Group controlId="member1">
              <Form.Control
                type="text"
                name="member1"
                value={member1 }
                placeholder="Member1"
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </div>
          <div >
            <Form.Group controlId="sec1">
              <Form.Control
                type="text"
                name="sec1"
                value={sec1 }
                placeholder="Sec / Roll No"
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </div>
          <div className="half-div-child">
            <Form.Group controlId="mobile1">
              <Form.Control
                type="number"
                name="mobile1"
                value={mobile1 }
                placeholder="Mob No"
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </div>
        </Row>
        
        <Row className="half-div">
          <div className="half-div-child">
            <Form.Group controlId="member2">
              <Form.Control
                type="text"
                name="member2"
                value={member2 }
                placeholder="Member2"
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </div>
          <div >
            <Form.Group controlId="sec2">
              <Form.Control
                type="text"
                name="sec2"
                value={sec2 }
                placeholder="Sec / Roll No"
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </div>
          <div className="half-div-child">
            <Form.Group controlId="mobile2">
              <Form.Control
                type="number"
                name="mobile2"
                value={mobile2 }
                placeholder="Mob No"
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </div>
        </Row>
        <Row className="half-div">
          <div className="half-div-child">
            <Form.Group controlId="member3">
              <Form.Control
                type="text"
                name="member3"
                value={member3 }
                placeholder="Member3"
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </div>
          <div >
            <Form.Group controlId="sec3">
              <Form.Control
                type="text"
                name="sec3"
                value={sec3 }
                placeholder="Sec / Roll No"
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </div>
          <div className="half-div-child">
            <Form.Group controlId="mobile3">
              <Form.Control
                type="number"
                name="mobile3"
                value={mobile3 }
                placeholder="Mob No"
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </div>
        </Row>
        <Row className="half-div">
          <div className="half-div-child">
            <Form.Group controlId="member4">
              <Form.Control
                type="text"
                name="member4"
                value={member4 }
                placeholder="Member4"
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </div>
          <div >
            <Form.Group controlId="sec4">
              <Form.Control
                type="text"
                name="sec4"
                value={sec4 }
                placeholder="Sec / Roll No"
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </div>
          <div className="half-div-child">
            <Form.Group controlId="mobile4">
              <Form.Control
                type="number"
                name="mobile4"
                value={mobile4 }
                placeholder="Mob No"
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </div>
        </Row>
        <Row className="half-div">
          <div className="half-div-child">
            <Form.Group controlId="member5">
              <Form.Control
                type="text"
                name="member5"
                value={member5 }
                placeholder="Member5"
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </div>
          <div >
            <Form.Group controlId="sec5">
              <Form.Control
                type="text"
                name="sec5"
                value={sec5 }
                placeholder="Sec / Roll No"
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </div>
          <div className="half-div-child">
            <Form.Group controlId="mobile5">
              <Form.Control
                type="number"
                name="mobile5"
                value={mobile5 }
                placeholder="Mob No"
                onChange={e => handleChange(e)}
              />
            </Form.Group>
          </div>
        </Row>
              
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <button
                style={{
                  width: "150px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem",
                }}
                type="submit"
                className="btn btn-large waves-effect hoverable #ff5252 red accent-1"
              >
                Post
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default EditPost;

