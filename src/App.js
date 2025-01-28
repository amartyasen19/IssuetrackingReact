import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavigationBar from "./components/Navbar"; 
import AddIssueForm from "./components/AddIssueForm";  
import IssueTable from "./components/IssueTable";

const App = () => {
  return (
    <Router>
      <NavigationBar />
      <div className="container" style={{ marginTop: "20px" }}>
        <Routes>
          <Route path="/" element={<IssueTable />} />
          <Route path="/addissue" element={<AddIssueForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
