import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import Dropzone from "react-dropzone";
// import { useDropzone } from "react-dropzone";
import axios from "axios";
import {API_URL} from './../../utils/constants'
import { Form } from "react-bootstrap";
import M from "materialize-css";
import { useParams } from "react-router-dom";

const Newupload = () => {
  const history = useHistory();
  const [file, setFile] = useState([]); // state for storing actual image
  const [term, setTerm] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const dropRef = useRef();
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false); // state to show preview only for images
  const { id } = useParams();

  const onDrop = (files) => {
    console.log("filesss first term",files)
    const [uploadedFile] = files;
    setFile(files);
    setTerm("third");
    files.forEach(file => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewSrc(fileReader.result);
      };
      fileReader.readAsDataURL(uploadedFile);
      setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
      dropRef.current.style.border = "2px dashed #e9ebeb";
    })
  };

  const updateBorder = (dragState) => {
    if (dragState === "over") {
      dropRef.current.style.border = "2px solid #000";
    } else if (dragState === "leave") {
      dropRef.current.style.border = "2px dashed #e9ebeb";
    }
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault()
    try {
        const formData = new FormData();
        file.forEach(file => formData.append('file',file))
        formData.append("term", term)
        setErrorMsg("");
        await axios.put(`${API_URL}/newupload/${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        });
        M.toast({ html: "Files uploaded Successfully", classes: " green" });
        history.push("/");

        console.log("createpost file", file)

    } catch (error) {
        console.log(error)
    }
  }
  return (
    <div>
        <div className="container post-container">
          <div style={{ marginTop: "4rem" }} className="row">
            <div className="col s10 offset-s1">
                <Link to="/" className="btn-flat waves-effect">
                    <i className="material-icons left">keyboard_backspace</i>
                    Back to home
                </Link>
                <div className="col s12" style={{ paddingLeft: "11.250px", marginBottom: "50px" }}>
                    <h4>
                    <b>Upload Third Term Files</b>
                    </h4>
                </div>
                <Form onSubmit={handleOnSubmit} >
                    {errorMsg && <p className="errorMsg">{errorMsg}</p>}
                    <div className="">
                        <Dropzone onDrop={onDrop} onDragEnter={() => updateBorder("over")} onDragLeave={() => updateBorder("leave")} >
                        {({  acceptedFiles, getRootProps, getInputProps }) => (
                        // {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps({ className: "drop-zone" })} ref={dropRef}>
                            <input {...getInputProps()} multiple/>
                            <p>Drag and drop files OR click here to select files</p>
                            {file && (
                                <div>
                                <strong>Selected file:</strong> {acceptedFiles.map(item => (<li key={item.path}>{item.path}</li>)) }
                                {/* <strong>Selected file:</strong> {file.name} */}
                                </div>
                            )}
                            </div>
                        )}
                        </Dropzone>
                    </div>
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
                            // onClick={PostDetails}
                        >
                            Post
                        </button>
                    </div>
                </Form>

            </div>

          </div>

        </div>
    </div>
  )
}

export default Newupload
