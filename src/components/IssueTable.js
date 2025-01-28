import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./IssueTable.css";

const IssueTable = () => {
  const BASE_URL = "https://issuetracking-backendapp.onrender.com"; // it is hosted url which is hosted in render.com
  const [issues, setIssues] = useState([]);
  const [editing, setEditing] = useState(null); // Track editing state
  const [editValue, setEditValue] = useState(""); // Track the value being edited
  const [showModal, setShowModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/issues`);
      setIssues(response.data.issues || []);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  const handleDoubleClick = (field, issue) => {
    setEditing({ field, issueId: issue._id });
    setEditValue(issue[field]);
  };

  const handleSaveEdit = async (field, issueId, newValue) => {
    try {
      await axios.put(`${BASE_URL}/api/issues/${issueId}`, {
        [field]: newValue,
      });
      fetchIssues(); // Reload issues after update
      setEditing(null); // Stop editing
    } catch (error) {
      console.error("Error updating issue:", error);
    }
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

  const handleEdit = (issue) => {
    setSelectedIssue(issue);
    setShowModal(true);
    setNewImage(null); // Reset the image on edit
    setImagePreview(null); // Reset image preview
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    
    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Set the image preview
    };
    if (file) {
      reader.readAsDataURL(file);
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

  return (
    <div className="full-screen">
      <h3 className="my-4 text-center">Issue Tracking</h3>
      <div className="table-responsive">
        <Table striped bordered hover className="issue-table">
          <thead>
            <tr>
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
                  <td
                    onDoubleClick={() =>
                      handleDoubleClick("serialNumber", issue)
                    }
                  >
                    {editing?.field === "serialNumber" &&
                    editing?.issueId === issue._id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() =>
                          handleSaveEdit("serialNumber", issue._id, editValue)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit(
                              "serialNumber",
                              issue._id,
                              editValue
                            );
                          }
                        }}
                      />
                    ) : (
                      issue.serialNumber
                    )}
                  </td>
                  <td
                    onDoubleClick={() => handleDoubleClick("location", issue)}
                  >
                    {editing?.field === "location" &&
                    editing?.issueId === issue._id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() =>
                          handleSaveEdit("location", issue._id, editValue)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit("location", issue._id, editValue);
                          }
                        }}
                      />
                    ) : (
                      issue.location
                    )}
                  </td>
                  <td
                    onDoubleClick={() => handleDoubleClick("category", issue)}
                  >
                    {editing?.field === "category" &&
                    editing?.issueId === issue._id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() =>
                          handleSaveEdit("category", issue._id, editValue)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit("category", issue._id, editValue);
                          }
                        }}
                      />
                    ) : (
                      issue.category
                    )}
                  </td>
                  <td
                    onDoubleClick={() =>
                      handleDoubleClick("subcategory", issue)
                    }
                  >
                    {editing?.field === "subcategory" &&
                    editing?.issueId === issue._id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() =>
                          handleSaveEdit("subcategory", issue._id, editValue)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit("subcategory", issue._id, editValue);
                          }
                        }}
                      />
                    ) : (
                      issue.subcategory
                    )}
                  </td>
                  <td
                    onDoubleClick={() =>
                      handleDoubleClick("description", issue)
                    }
                  >
                    {editing?.field === "description" &&
                    editing?.issueId === issue._id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() =>
                          handleSaveEdit("description", issue._id, editValue)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit("description", issue._id, editValue);
                          }
                        }}
                      />
                    ) : (
                      issue.description
                    )}
                  </td>
                  <td
                    onDoubleClick={() =>
                      handleDoubleClick("severity", issue)
                    }
                  >
                    {editing?.field === "severity" &&
                    editing?.issueId === issue._id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() =>
                          handleSaveEdit("severity", issue._id, editValue)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit("severity", issue._id, editValue);
                          }
                        }}
                      />
                    ) : (
                      issue.severity
                    )}
                  </td>
                  <td>
                  <img
                  src={`${BASE_URL}${issue.imageUrl}`} //  backend url
                  alt="Issue"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
                  </td>
                  <td
                    onDoubleClick={() =>
                      handleDoubleClick("referenceCode1", issue)
                    }
                  >
                    {editing?.field === "referenceCode1" &&
                    editing?.issueId === issue._id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() =>
                          handleSaveEdit("referenceCode1", issue._id, editValue)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit(
                              "referenceCode1",
                              issue._id,
                              editValue
                            );
                          }
                        }}
                      />
                    ) : (
                      issue.referenceCode1
                    )}
                  </td>
                  <td
                    onDoubleClick={() =>
                      handleDoubleClick("referenceCode2", issue)
                    }
                  >
                    {editing?.field === "referenceCode2" &&
                    editing?.issueId === issue._id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() =>
                          handleSaveEdit("referenceCode2", issue._id, editValue)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit(
                              "referenceCode2",
                              issue._id,
                              editValue
                            );
                          }
                        }}
                      />
                    ) : (
                      issue.referenceCode2
                    )}
                  </td>
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
                <td colSpan="10" className="text-center">
                  No issues available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

     
      {/* Modal for editing issue */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Issue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group controlId="formSerialNumber">
              <Form.Label>Serial Number</Form.Label>
              <Form.Control
                type="text"
                name="serialNumber"
                value={selectedIssue?.serialNumber || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={selectedIssue?.location || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={selectedIssue?.category || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formSubcategory">
              <Form.Label>Subcategory</Form.Label>
              <Form.Control
                type="text"
                name="subcategory"
                value={selectedIssue?.subcategory || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={selectedIssue?.description || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formSeverity">
              <Form.Label>Severity</Form.Label>
              <Form.Control
                type="text"
                name="severity"
                value={selectedIssue?.severity || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formReferenceCode1">
              <Form.Label>Reference Code 1</Form.Label>
              <Form.Control
                type="text"
                name="referenceCode1"
                value={selectedIssue?.referenceCode1 || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formReferenceCode2">
              <Form.Label>Reference Code 2</Form.Label>
              <Form.Control
                type="text"
                name="referenceCode2"
                value={selectedIssue?.referenceCode2 || ""}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Image Preview */}
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{ maxWidth: "300px", maxHeight: "300px" }}
                />
              )}
              {!imagePreview && selectedIssue?.imageUrl && (
                <img
                  src={`${BASE_URL}${selectedIssue.imageUrl}`}
                  alt="Current"
                  className="img-thumbnail"
                  style={{ maxWidth: "300px", maxHeight: "300px" }}
                />
              )}
            </Form.Group>

            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default IssueTable;
