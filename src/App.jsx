import React, { useEffect, useContext } from "react";
// Pages
import ForgotPassword from "./pages/ForgotPassword";
import Gaming from "./pages/Gaming";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import Me from "./pages/Me";
import ChangePassword from "./pages/ChangePassword";
// Components
import GlobalTheme from "./Globals/GlobalTheme";
import { getLastSave } from "./components/gameSlice";
import { HeartsSm } from "./img/suitsIcons";
// Context
import AuthContext from "./AuthContext";
// Styling
import styled from "styled-components";
import GlobalStyles from "./Globals/GlobalStyles";
import { ThemeProvider } from "styled-components";
// Router
import { Switch, Route, useLocation } from "react-router-dom";
// Animation
import { AnimatePresence } from "framer-motion";
// Redux
import { useDispatch } from "react-redux";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    // NOTE: getting last save
    if (user) {
      dispatch(getLastSave(user.currentScore));
    } else {
      const getLocalBank = Number(localStorage.getItem("localBank"));
      const localBank = getLocalBank < 1 ? 1000 : getLocalBank;

      dispatch(getLastSave(localBank));
    }
  }, [dispatch, user]);

  return (
    <ThemeProvider theme={GlobalTheme}>
      <GlobalStyles />
      <AuthorTag>
        <HeartsSm />
        Made by John Daniel Semine
      </AuthorTag>
      <AnimatePresence mode="wait">
        <Switch location={location} key={location.pathname}>
          <Route exact path="/" component={Home} />
          <Route exact path="/gamin" component={Gaming} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/leaderboard" component={Leaderboard} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/me" component={Me} />
          <Route exact path="/change-password" component={ChangePassword} />
          <Route
            exact
            path="/reset-password/:resetToken"
            component={ResetPassword}
          />
          <Route exact path="/signup" component={Signup} />
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
    </ThemeProvider>
  );
}

const AuthorTag = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;

  display: flex;
  align-items: center;

  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  padding: 0.5rem 1rem;

  svg {
    height: 1.6rem;
    width: 1.6rem;
    margin-right: 1rem;
  }
`;

export default App;
