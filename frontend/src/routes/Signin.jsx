import React, { useState, useEffect } from "react";
import { Card, Input, Button, Header } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const formDetails = {
  email: "",
  password: "",
};

function Signin() {
  const search = useLocation().search;
  const type = new URLSearchParams(search).get("type") ?? "student";

  const [signinForm, setSigninForm] = useState(formDetails);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("EMAIL");
    if (email) navigate("/");
  }, []);

  const handleClick = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:9000/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ ...signinForm, type }),
    });
    const data = await res.json();
    if (data.status) {
      localStorage.setItem("NAME", data.data.name);
      localStorage.setItem("EMAIL", data.data.email);
      localStorage.setItem("TYPE", type);
      navigate("/");
    } else {
      alert(data.message);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Card style={{ width: "400px", paddingTop: "20px" }} centered>
        <Header textAlign="center">
          {"Sign In - " + type.charAt(0).toUpperCase() + type.substring(1)}
        </Header>
        <Card.Content style={{ margin: "auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Input
              name="email"
              placeholder="email"
              style={{ margin: "10px", width: "280px" }}
              type="email"
              onChange={(e) =>
                setSigninForm({
                  ...signinForm,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <Input
              name="password"
              placeholder="password"
              style={{ margin: "10px", width: "280px" }}
              type="password"
              onChange={(e) =>
                setSigninForm({
                  ...signinForm,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <Button
              primary
              loading={loading}
              style={{ margin: "10px", width: "280px" }}
              onClick={handleClick}
            >
              Log In
            </Button>
          </div>
        </Card.Content>
      </Card>
      <Card style={{ width: "400px" }}>
        <Card.Content>
          <p>
            Don't have an account? then{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                navigate("/signup?type=" + type);
              }}
            >
              Signup
            </span>
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}

export default Signin;
