import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./IssueTable.css";

const IssueTable = () => {
  //const BASE_URL = "http://localhost:5000";
 const  BASE_URL="https://issuetracking-backendapp.onrender.com"
  const [issues, setIssues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/issues`);
      if (response.data && Array.isArray(response.data.issues)) {
        setIssues(response.data.issues);
      } else {
        console.error(
          'Expected an array in "issues" property, but received:',
          response.data
        );
        setIssues([]);
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  const handleEdit = (issue) => {
    setSelectedIssue(issue);
    setShowModal(true);
    setNewImage(null); // Reset the image on edit
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      try {
        await axios.delete(`${BASE_URL}/api/issues/${id}`);
        fetchIssues();
      } catch (error) {
        console.error("Error deleting issue:", error);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("serialNumber", selectedIssue.serialNumber);
    formData.append("location", selectedIssue.location);
    formData.append("category", selectedIssue.category);
    formData.append("subcategory", selectedIssue.subcategory);
    formData.append("description", selectedIssue.description);
    formData.append("severity", selectedIssue.severity);
    formData.append("referenceCode1", selectedIssue.referenceCode1);
    formData.append("referenceCode2", selectedIssue.referenceCode2);

    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      await axios.put(`${BASE_URL}/api/issues/${selectedIssue._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchIssues();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating issue:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedIssue((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  return (
    <div className="full-screen">
      <h3 className="my-4 text-center">Issue Tracking</h3>
      <div className="table-responsive">
        <Table striped bordered hover className="issue-table">
          <thead>
            <tr>
              <th>Checkbox</th>
              <th>S/N</th>
              <th>Location</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Description</th>
              <th>Severity</th>
              <th>Image Preview</th>
              <th>Reference Code 1</th>
              <th>Reference Code 2</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.length > 0 ? (
              issues.map((issue) => (
                <tr key={issue._id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{issue.serialNumber}</td>
                  <td>{issue.location}</td>
                  <td>{issue.category}</td>
                  <td>{issue.subcategory}</td>
                  <td>{issue.description}</td>
                  <td>{issue.severity}</td>
                  <td>
                    <img
                      src={`${BASE_URL}${issue.imageUrl}`}
                      alt="Issue Thumbnail"
                      className="img-thumbnail"
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                  </td>
                  <td>{issue.referenceCode1}</td>
                  <td>{issue.referenceCode2}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEdit(issue)}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(issue._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No issues available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {selectedIssue && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Issue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSave}>
              <Form.Group controlId="formSerialNumber">
                <Form.Label>Serial Number</Form.Label>
                <Form.Control
                  type="number"
                  name="serialNumber"
                  value={selectedIssue.serialNumber}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={selectedIssue.location}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={selectedIssue.category}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formSubcategory">
                <Form.Label>Subcategory</Form.Label>
                <Form.Control
                  type="text"
                  name="subcategory"
                  value={selectedIssue.subcategory}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={selectedIssue.description}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formSeverity">
                <Form.Label>Severity</Form.Label>
                <Form.Control
                  type="text"
                  name="severity"
                  value={selectedIssue.severity}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formReferenceCode1">
                <Form.Label>Reference Code 1</Form.Label>
                <Form.Control
                  type="text"
                  name="referenceCode1"
                  value={selectedIssue.referenceCode1}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formReferenceCode2">
                <Form.Label>Reference Code 2</Form.Label>
                <Form.Control
                  type="text"
                  name="referenceCode2"
                  value={selectedIssue.referenceCode2}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formImage">
                <Form.Label>Current Image</Form.Label>
                <img
                  src={`${BASE_URL}${selectedIssue.imageUrl}`}
                  alt="Current"
                  className="img-thumbnail"
                  style={{ maxWidth: "300px", maxHeight: "300px" }}
                />
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default IssueTable;

/*import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./IssueTable.module.css"; // Import custom CSS for additional styling

const IssueTable = () => {
  const [issues, setIssues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/issues");
      if (response.data && Array.isArray(response.data.issues)) {
        setIssues(response.data.issues);
      } else {
        console.error(
          'Expected an array in "issues" property, but received:',
          response.data
        );
        setIssues([]);
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  const handleEdit = (issue) => {
    setSelectedIssue(issue);
    setShowModal(true);
    setNewImage(null); // Reset the image on edit
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      try {
        await axios.delete(`http://localhost:5000/api/issues/${id}`);
        fetchIssues();
      } catch (error) {
        console.error("Error deleting issue:", error);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("serialNumber", selectedIssue.serialNumber);
    formData.append("location", selectedIssue.location);
    formData.append("category", selectedIssue.category);
    formData.append("subcategory", selectedIssue.subcategory);
    formData.append("description", selectedIssue.description);
    formData.append("severity", selectedIssue.severity);
    formData.append("referenceCode1", selectedIssue.referenceCode1);
    formData.append("referenceCode2", selectedIssue.referenceCode2);

    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      await axios.put(
        `http://localhost:5000/api/issues/${selectedIssue._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchIssues();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating issue:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedIssue((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  return (
    <div className="container mt-4">
      <h3 className="my-4 text-center">Issue Tracking</h3>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Checkbox</th>
              <th>S/N</th>
              <th>Location</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Description</th>
              <th>Severity</th>
              <th>Image Preview</th>
              <th>Reference Code 1</th>
              <th>Reference Code 2</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.length > 0 ? (
              issues.map((issue) => (
                <tr key={issue._id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{issue.serialNumber}</td>
                  <td>{issue.location}</td>
                  <td>{issue.category}</td>
                  <td>{issue.subcategory}</td>
                  <td>{issue.description}</td>
                  <td>{issue.severity}</td>
                  <td>
                    <img
                      src={`http://localhost:5000${issue.imageUrl}`}
                      alt="Issue Thumbnail"
                      className="img-thumbnail"
                    />
                  </td>
                  <td>{issue.referenceCode1}</td>
                  <td>{issue.referenceCode2}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEdit(issue)}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(issue._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No issues available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {selectedIssue && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Issue</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSave}>
              <Form.Group controlId="formSerialNumber">
                <Form.Label>Serial Number</Form.Label>
                <Form.Control
                  type="number"
                  name="serialNumber"
                  value={selectedIssue.serialNumber}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={selectedIssue.location}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={selectedIssue.category}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formSubcategory">
                <Form.Label>Subcategory</Form.Label>
                <Form.Control
                  type="text"
                  name="subcategory"
                  value={selectedIssue.subcategory}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={selectedIssue.description}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formSeverity">
                <Form.Label>Severity</Form.Label>
                <Form.Control
                  type="text"
                  name="severity"
                  value={selectedIssue.severity}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formReferenceCode1">
                <Form.Label>Reference Code 1</Form.Label>
                <Form.Control
                  type="text"
                  name="referenceCode1"
                  value={selectedIssue.referenceCode1}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formReferenceCode2">
                <Form.Label>Reference Code 2</Form.Label>
                <Form.Control
                  type="text"
                  name="referenceCode2"
                  value={selectedIssue.referenceCode2}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formImage">
                <Form.Label>Current Image</Form.Label>
                <img
                  src={`http://localhost:5000${selectedIssue.imageUrl}`}
                  alt="Current"
                  className="img-thumbnail"
                  style={{ maxWidth: "100px" }}
                />
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default IssueTable;*/
