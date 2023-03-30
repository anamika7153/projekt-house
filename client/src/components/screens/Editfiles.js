
import React, { useState, useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import axios from "axios";
import M from "materialize-css";
import Dropzone from "react-dropzone";
import { API_URL } from "../../utils/constants";
import { useParams } from "react-router-dom";

const Editfl = () => {
  const history = useHistory();
  const [file, setFile] = useState([]); // state for storing actual image
  const [previewSrc, setPreviewSrc] = useState(""); // state for storing previewImage
  const [errorMsg, setErrorMsg] = useState("");
  const { postid, id } = useParams();
  
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false); // state to show preview only for images
  const dropRef = useRef(); // React ref for managing the hover state of droppable area

  const onDrop = (file) => {
    const [uploadedFile] = file;
    setFile(uploadedFile);
    console.log("ondrop",file)

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
    setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
    dropRef.current.style.border = "2px dashed #e9ebeb";
  };

  const updateBorder = (dragState) => {
    if (dragState === "over") {
      dropRef.current.style.border = "2px solid #000";
    } else if (dragState === "leave") {
      dropRef.current.style.border = "2px dashed #e9ebeb";
    }
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("file",file)

          const formData = new FormData();
          formData.append("file", file);

          setErrorMsg("");
          await axios.put(`${API_URL}/editfiles/${postid}/${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
          }
          )
          .then((result) => {
            console.log("result",result)
          }).catch((err)=> {
            console.log(err)
          })
          M.toast({ html: "file updated Successfully", classes: " green" });
          history.push("/");
    } catch (error) {
      error.response && setErrorMsg(error.response.data);
    }
  };

  return (
    <React.Fragment>
      <Container>
      <div style={{marginTop: "4rem"}} className="row">
          <Form className="search-form" onSubmit={handleOnSubmit}>
            <div className="upload-section">
              <Dropzone
                  onDrop={onDrop}
                  onDragEnter={() => updateBorder("over")}
                  onDragLeave={() => updateBorder("leave")}
                >
                  {({ acceptedFiles, getRootProps, getInputProps }) => (
                    <div {...getRootProps({ className: "drop-zone" })} ref={dropRef}>
                      <input {...getInputProps()} />
                      <p>Drag and drop synopsis OR click here to select a file</p>
                      {file && (
                        <div>
                          <strong>Selected file:</strong> {acceptedFiles.map(item => (<li key={item.path}>{item.path}</li>)) }
                        </div>
                      )}
                    </div>
                  )}
                </Dropzone>
                {previewSrc ? (
                  isPreviewAvailable ? (
                    <div className="image-preview">
                      <img className="preview-image" src={previewSrc} alt="Preview" />
                    </div>
                  ) : (
                    <div className="preview-message">
                      <p>No preview available for this file</p>
                    </div>
                  )
                ) : (
                  <div className="preview-message">
                    <p>Image preview will be shown here after selection</p>
                  </div>
                )}
            </div>
            <div style={{marginTop: "20px",}} className="col">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
      </div>
      
      </Container>
    </React.Fragment>
  )
}

export default Editfl
