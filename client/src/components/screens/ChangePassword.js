









import React, { useState,useRef, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";
import { API_URL } from "../../utils/constants";
import axios from "axios";
import PasswordForm from "./PasswordForm";
// import {  toast } from 'react-toastify'

function Login() {
const emailRef = useRef()
const [otpForm, showForm] = useState(true)
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
//   const [otpform, setOtpform] = useState(true);

  const changePass = async () => {
    history.push('/user/changepassword')
  }

  const sendotp = async () => {
    try {
        let url = 'http://localhost:5000/user/sendemail'
        let options = {
            method: 'POST',
            url:url,
            data: {email: emailRef.current.value}
        }
        let response = await axios(options)
        let record = response.data
        // let response = await axios.post(`${API_URL}/user/sendemail`, {
        //     email:emailRef.current.value
        // }, {
        //     headers: {
        //         "Content-Type": "application/json",

        //     }
        // })
        console.log("response in changepass", response)
        console.log(record)
        if(record.statusText == 'success') {
          M.toast({ html: "OTP Sent Successfully", classes: " green" });
          showForm(false)
        }
        else {
            console.log(record.message)
          M.toast({ html: record.message, classes: "#c62828 red darken-3" });

        }
    } catch (error) {
        console.log(error)
        
    }
  }


  return (
    <div className="container">
      <div style={{ marginTop: "4rem" }} className="row">
        <div className="col s8 offset-s2">
          <Link to="/" className="btn-flat waves-effect">
            <i className="material-icons left">keyboard_backspace</i>
            Back to home
          </Link>
          <div className="col s12" style={{ paddingLeft: "11.250px" }}>
            <h4>
              <b>Change Password</b>
            </h4>
          </div>
          { otpForm ? 
            <form noValidate method="post">
            <div className="input-field col s12">
              <input
                id="email"
                type="email"
                name="email"
                // value={email}
                ref={emailRef}
                // onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email</label>
            </div>
            
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <button
                style={{
                  width: "150px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem",
                }}
                type="button"
                className="btn btn-large waves-effect hoverable #ff5252 red accent-1"
                onClick={sendotp}
              >
                Send OTP
              </button>
            </div>
          </form>
          : <PasswordForm email = {emailRef.current.value} />
          }
        </div>
      </div>
    </div>
  );
}

export default Login;
