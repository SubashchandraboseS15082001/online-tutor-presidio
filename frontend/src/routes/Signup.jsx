import React, { useState, useEffect } from "react";
import { Card, Input, Button, Header } from "semantic-ui-react";
import { useNavigate, useLocation } from "react-router-dom";

function Signup() {
  const search = useLocation().search;
  const type = new URLSearchParams(search).get("type") ?? "student";

  const [signupForm, setSignupForm] = useState({ type });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("EMAIL");
    if (email) navigate("/");
  }, []);

  const handleClick = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:9000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(signupForm),
    });
    const data = await res.json();
    if (data.status) {
      localStorage.setItem("EMAIL", data.data.email);
      localStorage.setItem("NAME", data.data.name);
      localStorage.setItem("TYPE", type);
      navigate("/");
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
      <Card style={{ width: "400px", paddingTop: "20px" }}>
        <Header textAlign="center">
          {"Sign Up - " + type.charAt(0).toUpperCase() + type.substring(1)}
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
              name="name"
              placeholder="name"
              style={{ margin: "10px", width: "280px" }}
              type="text"
              onChange={(e) =>
                setSignupForm({
                  ...signupForm,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <Input
              name="email"
              placeholder="email"
              style={{ margin: "10px", width: "280px" }}
              type="email"
              onChange={(e) =>
                setSignupForm({
                  ...signupForm,
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
                setSignupForm({
                  ...signupForm,
                  [e.target.name]: e.target.value,
                })
              }
            />
            {type === "tutor" && (
              <>
                <Input
                  name="location"
                  placeholder="location"
                  style={{ margin: "10px", width: "280px" }}
                  type="text"
                  onChange={(e) =>
                    setSignupForm({
                      ...signupForm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <Input
                  name="subject"
                  placeholder="subject"
                  style={{ margin: "10px", width: "280px" }}
                  type="text"
                  onChange={(e) =>
                    setSignupForm({
                      ...signupForm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </>
            )}
            <Button
              primary
              loading={loading}
              style={{ margin: "10px", width: "280px" }}
              onClick={handleClick}
            >
              Sign up
            </Button>
          </div>
        </Card.Content>
      </Card>
      <Card style={{ width: "400px" }}>
        <Card.Content>
          <p>
            Already have an account? then{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                navigate("/signin");
              }}
            >
              Signin
            </span>
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}

export default Signup;
