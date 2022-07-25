import React from "react";
import {
  Button,
  Card,
  Divider,
  Header,
  Icon,
  Input,
  Select,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const sendNotification = async (email, tutorEmail) => {
  const res = await fetch("http://localhost:9000/notification", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, tutorEmail }),
  });

  const data = await res.json();
  if (data.status) alert("Notification sent");
  else alert(data.message);
  return data;
};

const searchTutors = async (by, query) => {
  const res = await fetch(
    "http://localhost:9000/search?q=" + query + "&by=" + by,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const data = await res.json();
  return data;
};

const getNotification = async (email) => {
  const res = await fetch("http://localhost:9000/notification?email=" + email, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
  const data = await res.json();
  return data;
};

const NotLoggedIn = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header as="h1" block textAlign="center">
        Presidio Online Tutor
      </Header>
      <div style={{ display: "grid", placeItems: "center", flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1 style={{ textAlign: "center" }}>Sign in as</h1>
          <div style={{ display: "flex" }}>
            <Button
              size="big"
              onClick={() => {
                navigate("/signin?type=student");
              }}
            >
              <span>Student</span>
            </Button>
            <Button
              size="big"
              onClick={() => {
                navigate("/signin?type=tutor");
              }}
            >
              <span>Tutor</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Login() {
  const email = localStorage.getItem("EMAIL");
  const name = localStorage.getItem("NAME");
  const type = localStorage.getItem("TYPE") ?? "student";

  const [searchValue, setSearchValue] = useState({ type: "", value: "" });
  const [notifications, setNotifications] = useState([]);
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    (async () => {
      if (email && type === "tutor") {
        const notes = await getNotification(email);
        setNotifications(notes.data);
      }
    })();
  }, []);

  if (email) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Header
          as="h2"
          icon
          textAlign="center"
          style={{ marginBottom: "100px" }}
        >
          <Icon name={type === "student" ? "student" : "user"} circular />
          <Header.Content style={{ marginTop: "10px" }}>
            Hello {name}
          </Header.Content>
          <Button
            style={{ marginTop: "10px" }}
            onClick={() => {
              localStorage.removeItem("NAME");
              localStorage.removeItem("EMAIL");
              localStorage.removeItem("TYPE");
              setTutors([]);
              setSearchValue({});
              setNotifications([]);
            }}
          >
            Sign out
          </Button>
        </Header>
        {type === "tutor" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minWidth: "300px",
              maxWidth: "500px",
            }}
          >
            <h4>Notifications</h4>
            {notifications.length === 0 ? (
              <p>No notifications yet</p>
            ) : (
              notifications.map((notification) => (
                <Card>
                  <Card.Header style={{ padding: "10px" }}>
                    {notification.student.name}
                  </Card.Header>
                  <Card.Content>{notification.message}</Card.Content>
                </Card>
              ))
            )}
          </div>
        )}

        {type === "student" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minWidth: "300px",
              maxWidth: "500px",
            }}
          >
            <h4>Search tutors by</h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <Select
                fluid
                placeholder="Search by ..."
                options={[
                  { key: "name", value: "name", text: "Name" },
                  { key: "subject", value: "subject", text: "Subject" },
                  { key: "location", value: "location", text: "Location" },
                ]}
                onChange={(e) => {
                  setSearchValue({
                    ...searchValue,
                    type: e.target.outerText.toLowerCase(),
                  });
                }}
              />
              <Input
                fluid
                name={searchValue.type}
                placeholder={searchValue.type}
                type="text"
                onChange={(e) =>
                  setSearchValue({ ...searchValue, value: e.target.value })
                }
              />
              <Button
                onClick={async () => {
                  const data = await searchTutors(
                    searchValue.type,
                    searchValue.value
                  );
                  if (!data.status) return;
                  setTutors(data.data.tutors);
                }}
              >
                Search
              </Button>
              {tutors.length === 0 ? (
                <p>No tutors found</p>
              ) : (
                tutors.map((tutor) => (
                  <Card>
                    <Card.Content>
                      <p>Name : {tutor.name}</p>
                      <p>Email : {tutor.email}</p>
                      <p>Subject : {tutor.subject}</p>
                      <Button
                        onClick={() => sendNotification(email, tutor.email)}
                      >
                        Send Request
                      </Button>
                    </Card.Content>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return <NotLoggedIn />;
}

export default Login;
