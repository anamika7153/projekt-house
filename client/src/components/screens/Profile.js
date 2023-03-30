//myprofile

import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import { API_URL } from "../../utils/constants";

function Profile() {
  const [data, setData] = useState([]);
  const [image, setImage] = useState("");
  const { state, dispatch } = useContext(UserContext);
  const [one, setOne] = useState("1");
  const [two, setTwo] = useState("2");
  const [three, setThree] = useState("3");
  const [four, setFour] = useState("4");
  const [five, setFive] = useState("5");
  const [firstterm, setFirstterm] = useState("first");
  const [secondterm, setSecondterm] = useState("second");
  const [thirdterm, setThirdterm] = useState("third");
  useEffect(() => {
    fetch(`${API_URL}/mypost`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.myposts);
      });
  }, []);
  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "projekthouse");
      data.append("cloud_name", "ddzjlkiyw");
      fetch("https://api.cloudinary.com/v1_1/ddzjlkiyw/image/upload", {
        method: "POST",
        body: data,
      })
        .then((response) => response.json()) // keep it in one line else use return res.json()
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATE_PIC", payload: result.pic });
            });
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  }, [image]);
  const updatePhoto = (file) => {
    setImage(file);
  };
  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (result._id == item._id) return result;
          else return item;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (result._id == item._id) return result;
          else return item;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (result._id == item._id) return result;
          else return item;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteFile = (postId, fileid) => {
    fetch(`/deletefile/${postId}/${fileid}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (result._id == item._id) return result;
          else return item;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id != result._id;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteComment = (postId, commentId) => {
    fetch(`/deletecomment/${postId}/${commentId}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (result._id == item._id) return result;
          else return item;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      {state ? (
        <div className="container" style={{ maxWidth: "900px" }}>
          <div
            style={{
              margin: "30px 10px",
              borderBottom: "1px solid",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div>
                <img
                  style={{
                    height: "200px",
                    width: "200px",
                    borderRadius: "50%",
                    marginRight: "15px"
                  }}
                  src={state ? state.pic : "loading.."}
                />
                <div className="file-field input-field">
                  <div className="btn" style={{ marginBottom: "1rem" }}>
                    <span>Update Profile Image</span>
                    <input
                      type="file"
                      onChange={(e) => updatePhoto(e.target.files[0])}
                    />
                  </div>
                  <div className="file-path-wrapper" style={{ width: "0" }}>
                    <input className="file-path validate" type="text" />
                  </div>
                </div>
              </div>
              <div>
                <h4>{state ? state.name : ""}</h4>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "95%",
                  }}
                >
                  <h6>{data.length} Posts</h6>
                  <h6>{state.followers.length} Followers</h6>
                  <h6>{state.following.length} Following</h6>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="gallery">
            {data.map((item) => {
              return <img className="item" src={item.photo} key={item._id} />;
            })}
          </div> */}
          <div className="home container">
            {data.map((item) => {
              return (
                <div className="card home-card" key={item._id}>
                  <h5 style={{ padding: "10px 15px" }}>
                    <Link
                      to={
                        item.postedBy._id !== state._id
                          ? `/profile/` + item.postedBy._id
                          : "/profile"
                      }
                      style={{
                        color: "black",
                      }}
                      className="namePost"
                    >
                      <img
                        src={state.pic}
                        style={{
                          height: "40px",
                          width: "40px",
                          borderRadius: "50%",
                          marginRight: "10px",
                          padding: "0",
                          marginBottom: "-15px",
                        }}
                      />
                      {item.postedBy.name}
                    </Link>{" "}
                    {item.postedBy._id == state._id ? (
                      <i
                        className="material-icons"
                        style={{ float: "right", cursor: "pointer" }}
                        onClick={(e) => deletePost(item._id)}
                      >
                        delete
                      </i>
                    ) : (
                      ""
                    )}
                  </h5>
                  <hr></hr>
                  <div style={{ paddingLeft: "25px" }}>
                    <p style={{ fontSize: "21px" }}>
                      <b>{item.title}</b>
                    </p>
                    <p style={{ fontSize: "18px" }}>{item.description}</p>
                    <b>
                      <h6 style={{ fontWeight: "900" }}>
                        <u>Members</u>
                      </h6>
                    </b>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sec</th>
                  <th>Mob. No</th>
                </tr>
              </thead>

              {item.members == one ? (
                <>
                <tbody>
                  <tr key={item._id}>
                    <td>{item.member1}</td>
                    <td>{item.sec1}</td>
                    <td>{item.mobile1}</td>
                  </tr>
                </tbody>
                </>
              ) : (
                item.members == two ? (
                  <>
                  <tbody>
                    <tr key={item._id}>
                      <td>{item.member1}</td>
                      <td>{item.sec1}</td>
                      <td>{item.mobile1}</td>
                    </tr>
                    <tr key={item._id}>
                      <td>{item.member2}</td>
                      <td>{item.sec2}</td>
                      <td>{item.mobile2}</td>
                    </tr>
                  </tbody>
                  </>
                ) : (
                  item.members == three ? (
                    <>
                        <tbody>
                          <tr key={item._id}>
                            <td>{item.member1}</td>
                            <td>{item.sec1}</td>
                            <td>{item.mobile1}</td>
                          </tr>
                          <tr key={item._id}>
                            <td>{item.member2}</td>
                            <td>{item.sec2}</td>
                            <td>{item.mobile2}</td>
                          </tr>
                          <tr key={item._id}>
                              <td>{item.member3}</td>
                              <td>{item.sec3}</td>
                              <td>{item.mobile3}</td>
                            </tr>
                        </tbody>
                      </>
                  ) : (
                    item.members == four ? (
                      <>
                          <tbody>
                            <tr key={item._id}>
                              <td>{item.member1}</td>
                              <td>{item.sec1}</td>
                              <td>{item.mobile1}</td>
                            </tr>
                            <tr key={item._id}>
                              <td>{item.member2}</td>
                              <td>{item.sec2}</td>
                              <td>{item.mobile2}</td>
                            </tr>
                            <tr key={item._id}>
                              <td>{item.member2}</td>
                              <td>{item.sec2}</td>
                              <td>{item.mobile2}</td>
                            </tr>
                            <tr key={item._id}>
                              <td>{item.member4}</td>
                              <td>{item.sec4}</td>
                              <td>{item.mobile4}</td>
                            </tr>
                          </tbody>
                         </>
                    ) : (
                      item.members == five ? (
                        <>
                            <tbody>
                              <tr key={item._id}>
                                <td>{item.member1}</td>
                                <td>{item.sec1}</td>
                                <td>{item.mobile1}</td>
                              </tr>
                              <tr key={item._id}>
                                <td>{item.member2}</td>
                                <td>{item.sec2}</td>
                                <td>{item.mobile2}</td>
                              </tr>
                              <tr key={item._id}>
                                <td>{item.member3}</td>
                                <td>{item.sec3}</td>
                                <td>{item.mobile3}</td>
                              </tr>
                              <tr key={item._id}>
                                <td>{item.member4}</td>
                                <td>{item.sec4}</td>
                                <td>{item.mobile4}</td>
                              </tr>
                              <tr key={item._id}>
                                <td>{item.member5}</td>
                                <td>{item.sec5}</td>
                                <td>{item.mobile5}</td>
                              </tr>
                            </tbody>
                            </>
                      ) : (<></>)
                    )
                  )
                )
              )}
            </table>
                  </div>
                  <div className="card-image">
                    <img src={item.photo} />
                  </div>
                  <div className="card-content">
                    {/* <i
                      className="material-icons"
                      style={{ cursor: "pointer", marginRight: "15px" }}
                    >
                      favorite_border
                    </i>
                    {item.likes.includes(state._id) ? (
                      <i
                        className="material-icons"
                        onClick={() => unlikePost(item._id)}
                        style={{ cursor: "pointer" }}
                      >
                        thumb_down
                      </i>
                    ) : (
                      <i
                        className="material-icons"
                        onClick={() => likePost(item._id)}
                        style={{ cursor: "pointer" }}
                      >
                        thumb_up
                      </i>
                    )}

                    <h6>{item.likes.length} Likes</h6> */}

                    <b>
                      <h6 style={{ fontWeight: "900" }}>
                        <u>Comments</u>
                      </h6>
                    </b>
                    {item.comments.map((comment) => {
                      return (
                        <h6 key={comment._id}>
                          <span style={{ fontWeight: "700" }}>
                            {comment.postedBy.name}
                          </span>
                          {" : "}
                          {comment.text}
                          {(item.postedBy._id == state._id ||
                            comment.postedBy._id == state._id) && (
                            <i
                              className="material-icons"
                              style={{ float: "right", cursor: "pointer" }}
                              onClick={(e) =>
                                deleteComment(item._id, comment._id)
                              }
                            >
                              delete
                            </i>
                          )}
                        </h6>
                      );
                    })}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        makeComment(e.target[0].value, item._id);
                      }}
                    >
                      <input type="text" placeholder="Add comment here" />
                    </form>
                    <div style={{display: "flex", justifyContent: "space-between", padding: "15px 0"}} >
                      <h6><b>Upload Files</b></h6>
                      <div  style={{display: "flex", }}>
                        {item.postedBy._id == state._id ? (
                          <div style={{display: "flex", justifyContent: "space-between", marginRight:"50px" }}>
                            <Link to={`/firstterm/${item._id}`} style={{ display: "flex", alignItems: "center", paddingRight: "22px" }}>
                              <i
                                className="material-icons"
                                style={{ float: "right", cursor: "pointer",marginRight: "10px" }}
                              >
                                upload_file 
                              </i>
                              <span>First Term</span>
                            </Link>
                            <Link to={`/secondterm/${item._id}`} style={{ display: "flex", alignItems: "center", paddingRight: "22px" }}>
                              <i
                                className="material-icons"
                                style={{ float: "right", cursor: "pointer",marginRight: "10px" }}
                              >
                                upload_file
                              </i>
                              <span>Second Term</span>

                            </Link>
                            <Link to={`/thirdterm/${item._id}`} style={{ display: "flex", alignItems: "center", paddingRight: "22px" }}>
                              <i
                                className="material-icons"
                                style={{ float: "right", cursor: "pointer",marginRight: "10px" }}
                              >
                                upload_file
                              </i>
                              <span>Third Term</span>
                            </Link>
                          </div>
                        ) : (
                          ""
                        ) }
                      </div>
                    </div>
                    <hr></hr>
                    <h6><span>First Term Files</span></h6>
                    {item.filee.map((f) => {
                    return (
                      <h6 key={f._id}>
                        {(f.term == firstterm ) ? (
                          <div>
                          <div style={{display: "flex", justifyContent: "space-between"}}>
                            <a href={f.url} target="_blank" rel="noopener noreferrer" download>
                              <div style={{display: "flex"}}>
                                  <span>{f.filenamee}</span>
                                  <i className="material-icons" style={{ cursor: "pointer", paddingLeft: "10px"}} >file_download</i> 
                              </div>
                            </a>
                            <div>
                              {item.postedBy._id == state._id ? (
                                <>
                                  <Link to={`/editfiles/${item._id}/${f._id}`} >
                                    <i
                                    className="material-icons"
                                    style={{ float: "right", cursor: "pointer",marginRight: "10px",  paddingLeft: "20px" }}
                                    >
                                    edit 
                                    </i>
                                  </Link>
                                  <i
                                    className="material-icons"
                                    style={{ float: "right", cursor: "pointer", }}
                                    onClick={(e) => deleteFile(item._id, f._id)}
                                  >
                                    delete
                                  </i>
                                </>
                              ) : 
                              ("")}
                            </div>
                          </div>
                        </div>
                        ) : (
                          <></>
                        )
                      }
                      </h6>
                    )
                  })}

                  <h6><span>Second Term Files</span></h6>
                  {item.filee.map((f) => {
                    return (
                      <h6 key={f._id}>
                        {(f.term == secondterm ) ? (
                          <div>
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                              <a href={f.url} target="_blank" rel="noopener noreferrer" download>
                                <div style={{display: "flex"}}>
                                    <span>{f.filenamee}</span>
                                    <i className="material-icons" style={{ cursor: "pointer", paddingLeft: "10px"}} >file_download</i> 
                                </div>
                              </a>
                              <div>
                                {item.postedBy._id == state._id ? (
                                  <>
                                    <Link to={`/editfiles/${item._id}/${f._id}`} >
                                      <i
                                      className="material-icons"
                                      style={{ float: "right", cursor: "pointer",marginRight: "10px",  paddingLeft: "20px" }}
                                      >
                                      edit 
                                      </i>
                                    </Link>
                                    <i
                                      className="material-icons"
                                      style={{ float: "right", cursor: "pointer", }}
                                      onClick={(e) => deleteFile(item._id, f._id)}
                                    >
                                      delete
                                    </i>
                                  </>
                                ) : 
                                ("")}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )
                      }
                      </h6>
                    )
                  })}
                  
                  <h6><span>Third Term Files</span></h6>
                  {item.filee.map((f) => {
                    return (
                      <h6 key={f._id}>
                        {(f.term == thirdterm ) ? (
                          <div>
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                              <a href={f.url} target="_blank" rel="noopener noreferrer" download>
                                <div style={{display: "flex"}}>
                                    <span>{f.filenamee}</span>
                                    <i className="material-icons" style={{ cursor: "pointer", paddingLeft: "10px"}} >file_download</i> 
                                </div>
                              </a>
                              <div>
                              {item.postedBy._id == state._id ? (
                                  <>
                                    <Link to={`/editfiles/${item._id}/${f._id}`} >
                                      <i
                                      className="material-icons"
                                      style={{ float: "right", cursor: "pointer",marginRight: "10px",  paddingLeft: "20px" }}
                                      >
                                      edit 
                                      </i>
                                    </Link>
                                    <i
                                      className="material-icons"
                                      style={{ float: "right", cursor: "pointer", }}
                                      onClick={(e) => deleteFile(item._id, f._id)}
                                    >
                                      delete
                                    </i>
                                  </>
                                ) : 
                                ("")}
                              </div>

                            </div>

                          </div>
                        ) : (
                          <></>
                        )
                      }
                      </h6>
                    )
                  })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <h2>Loading....</h2>
      )}
    </>
  );
}

export default Profile;
