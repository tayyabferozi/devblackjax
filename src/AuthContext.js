import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
// Config
import { API_URL } from "./config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("pending");
  const [error, setError] = useState(null);
  const [lastBet, setLastBet] = useState(0);

  // For triggering update user score save
  const [gamePlayed, setGamePlayed] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const req = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await req.json();

      if (data.status === "success") {
        // Setting cookies
        Cookies.set("jwt", data.token, {
          expires: 90,
          secure: process.env.NODE_ENV !== "development",
        });
        setUser(data.data.user);
        setError(null);
      } else {
        setError(
          "Login failed. Email or password may be incorrect, please try again"
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const signup = async (email, password, username, color) => {
    const req = await fetch(`${API_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        username,
        color,
      }),
    });

    const data = await req.json();

    if (data.status === "success") {
      // Setting cookies
      Cookies.set("jwt", data.token, {
        expires: 90,
        secure: process.env.NODE_ENV !== "development",
      });
      setUser(data.data.user);
      setError(null);
    } else {
      setError(data.message.replaceAll("`", ""));
    }
  };

  const logout = async () => {
    const token = Cookies.get("jwt");

    await fetch(`${API_URL}/users/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    Cookies.remove("jwt");
    setUser(null);
  };

  // TODO: Be sure to update the BLACKJAX_URL env in the heroku app to the live app and that's not in production
  const forgotPasswordHandler = async (email) => {
    const req = await fetch(`${API_URL}/users/forgotPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    const data = await req.json();

    if (data.status === "success") {
      // User should receive an email with a link to /ResetPasswordPage/:token
      setError("");
      return true;
    } else {
      setError(data.message);
      return false;
    }
  };

  const resetPasswordHandler = async (token, password) => {
    const req = await fetch(`${API_URL}/users/resetPassword/${token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
      }),
    });

    const data = await req.json();

    if (data.status === "success") {
      Cookies.set("jwt", data.token, {
        expires: 90,
        secure: process.env.NODE_ENV !== "development",
      });

      setUser(data.data.user);
      setError(null);
      return true;
    } else {
      setError(data.message);
      return false;
    }
  };

  const changePasswordHandler = async (currentPassword, newPassword) => {
    const token = Cookies.get("jwt");

    const res = await fetch(`${API_URL}/users/updatePassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const data = await res.json();

    if (data.status === "success") {
      logout();
    } else {
      setError(data.message);
    }
  };

  const checkUserLoggedIn = async () => {
    const token = Cookies.get("jwt");

    if (!token) return setUser(null);

    const res = await fetch(`${API_URL}/users/isLoggedIn`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.status === "success") {
      setUser(data.data.user);
    } else setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        error,
        setError,
        gamePlayed,
        setGamePlayed,
        lastBet,
        setLastBet,

        login,
        signup,
        logout,
        forgotPasswordHandler,
        resetPasswordHandler,
        changePasswordHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
