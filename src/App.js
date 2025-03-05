import React from "react";
import data from "./data";
import Questions from "./components/Questions/Questions";

function App() {
  const loaddata=[...data];
  return (
    <div className="cont">
      <div className="header">
        <h1>Header</h1>
      </div>
      <div className="q"><Questions dta={loaddata}/></div>
      <hr/>
    </div>
  );
}

export default App;
