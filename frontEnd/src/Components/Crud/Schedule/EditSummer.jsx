import { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const EditSummer = ({ show, handleClose, selectedSummer }) => {
    const [editedSummer, setEditedSummer] = useState(selectedSummer);
    const [professors, setProfessors] = useState([]);
    const [slot, setSlot] = useState('');
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchSummerDetails = async () => {
            try {
                const response = await axios.get(`https://ccsched.onrender.com/manual/summer/${selectedSummer.id}`);
                setEditedSummer(response.data);
            } catch (error) {
                console.error('Error fetching summer class details:', error);
            }
        };

        fetchSummerDetails();
    }, [selectedSummer.id]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('https://ccsched.onrender.com/manual/courses');
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses: ', error);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        // Fetch professors
        const fetchProfessors = async () => {
            try {
                const response = await axios.get(`https://ccsched.onrender.com/manual/professors`);
                setProfessors(response.data);
            } catch (error) {
                console.error('Error fetching professors:', error);
            }
        };

        fetchProfessors();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // Add logic to handle form submission
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Summer Class</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="card card-body mb-3 animated fadeInUp">
                    <Form onSubmit={handleFormSubmit}>
                    <Form.Group controlId="professor">
                            <Form.Label>Professor</Form.Label>
                            <Form.Control as="select" value={editedSummer.professor_id} onChange={(e) => setEditedSummer({ ...editedSummer, professor_id: e.target.value })}>
                                <option value="">Select Professor</option>
                                {professors.map((professor, index) => (
                                    <option key={index} value={professor.User_id}>
                                        {professor.fname} {professor.lname}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="course">
                            <Form.Label>Course</Form.Label>
                            <Form.Control type="text" value={editedSummer.course_code} disabled />
                        </Form.Group>
                       
                        <Form.Group controlId="slot">
                            <Form.Label>Slot</Form.Label>
                            <Form.Control type="number" value={editedSummer.slot} onChange={(e) => setEditedSummer({ ...editedSummer, slot: e.target.value })} />
                        </Form.Group>
                        <Button variant="primary" type="submit">Save Changes</Button>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default EditSummer;
