import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import styles from './AddIssueForm.module.css';  

const AddIssueForm = ({ onIssueAdded }) => {
 // const BASE_URL = "http://localhost:5000";
  const  BASE_URL="https://issuetracking-backendapp.onrender.com"
  const [serialNumber, setSerialNumber] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('');
  const [referenceCode1, setReferenceCode1] = useState('');
  const [referenceCode2, setReferenceCode2] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('serialNumber', serialNumber);
    formData.append('location', location);
    formData.append('category', category);
    formData.append('subcategory', subcategory);
    formData.append('description', description);
    formData.append('severity', severity);
    formData.append('referenceCode1', referenceCode1);
    formData.append('referenceCode2', referenceCode2);
    if (image) formData.append('image', image);

    try {
      const response = await axios.post(`${BASE_URL}/api/issues`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('Issue added successfully!');
      setAlertVariant('success');
      resetForm();

      if (onIssueAdded) {
        onIssueAdded(response.data);
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setMessage('Error adding issue!');
      setAlertVariant('danger');
    }
  };

  const resetForm = () => {
    setSerialNumber('');
    setLocation('');
    setCategory('');
    setSubcategory('');
    setDescription('');
    setSeverity('');
    setReferenceCode1('');
    setReferenceCode2('');
    setImage(null);
  };

  return (
    <div className={styles['add-issue-form-container']}>
      <h3>Add a New Issue</h3>
      {message && <Alert variant={alertVariant}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formSerialNumber">
          <Form.Label className={styles['form-label']}>Serial Number</Form.Label>
          <Form.Control
            type="number"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formLocation">
          <Form.Label className={styles['form-label']}>Location</Form.Label>
          <Form.Control
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formCategory">
          <Form.Label className={styles['form-label']}>Category</Form.Label>
          <Form.Control
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formSubcategory">
          <Form.Label className={styles['form-label']}>Subcategory</Form.Label>
          <Form.Control
            type="text"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formDescription">
          <Form.Label className={styles['form-label']}>Description</Form.Label>
          <Form.Control
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formSeverity">
          <Form.Label className={styles['form-label']}>Severity</Form.Label>
          <Form.Control
            as="select"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            required
          >
            <option value="">Select Severity</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </Form.Control>
        </Form.Group>

        {/* Move Image Field Here */}
        <Form.Group controlId="formFile">
          <Form.Label className={styles['form-label']}>Upload Image</Form.Label>
          <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
        </Form.Group>

        <Form.Group controlId="formReferenceCode1">
          <Form.Label className={styles['form-label']}>Reference Code 1</Form.Label>
          <Form.Control
            type="text"
            value={referenceCode1}
            onChange={(e) => setReferenceCode1(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formReferenceCode2">
          <Form.Label className={styles['form-label']}>Reference Code 2</Form.Label>
          <Form.Control
            type="text"
            value={referenceCode2}
            onChange={(e) => setReferenceCode2(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Issue
        </Button>
      </Form>
    </div>
  );
};

export default AddIssueForm;
