import React from "react";
import { Input } from "semantic-ui-react";
import "../styles/Home.css";

function Home() {
  return (
    <div className="homeContainer">
      <div className="homeHeader">
        <h1>Online Tutor</h1>
        <div>
          <Input placeholder="Search subject" />
        </div>
      </div>
    </div>
  );
}

export default Home;
