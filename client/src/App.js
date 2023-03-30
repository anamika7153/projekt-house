import React, { useEffect, useContext, createContext, useReducer } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/screens/Home";
import Login from "./components/screens/Login";
import ChangePassword from "./components/screens/ChangePassword";
import Profile from "./components/screens/Profile";
import Register from "./components/screens/Register";
import CreateTeam from "./components/screens/CreatePost";
import { reducer, initialState } from "./reducers/userReducer";
import "./App.css";
import UserProfile from "./components/screens/UserProfile";
import SubsPosts from "./components/screens/SubsPosts";
import EditData from "./components/screens/EditData";
import Editfiles from "./components/screens/Editfiles";
import FirstTermFiles from "./components/screens/FirstTermFiles";
import SecondTermFiles from "./components/screens/SecondTermFiles";
import ThirdTermFiles from "./components/screens/ThirdTermFiles";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/login");
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/profile/:userId">
        <UserProfile />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/user/sendemail">
        <ChangePassword />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/createteam">
        <CreateTeam />
      </Route>
      <Route path="/editdata/:id">
        <EditData />
      </Route>
      <Route path="/editfiles/:postid/:id">
        <Editfiles />
      </Route>
      <Route path="/firstterm/:id">
        <FirstTermFiles />
      </Route>
      <Route path="/secondterm/:id">
        <SecondTermFiles />
      </Route>
      <Route path="/thirdterm/:id">
        <ThirdTermFiles />
      </Route>
      <Route path="/myFollowersPosts">
        <SubsPosts />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
