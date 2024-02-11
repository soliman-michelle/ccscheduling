import axios from 'axios';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AddBlock from './AddBlock';
import DeleteBlock from './DeleteBlock';
import EditBlock from './EditBlock';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ViewBlock = () => {
  const [block, setBlock] = useState([]);
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [showEditBlockModal, setShowEditBlockModal] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [showEditErrorAlert, setShowEditErrorAlert] = useState(false);

  const toggleAddBlockModal = () => {
    setShowAddBlockModal(!showAddBlockModal); 
  };

  const toggleEditBlockModal = (block) => {
    setSelectedBlock(block);
    setShowEditBlockModal(true);
  };

  const toggleModalDelete = () => {
    setShowModalDelete(!showModalDelete);
  };

  const handleAddblock = (newBlock) => {
    setBlock([...block, newBlock]);
    fetchData();
  };

   // Function to handle edit success alert
const handleEditSuccess = () => {
  setShowEditSuccessAlert(true);
  setTimeout(() => {
    setShowEditSuccessAlert(false);
  }, 8000);
};

// Function to handle edit error alert
const handleEditError = () => {
  setShowEditErrorAlert(true);
  // Handle error scenario as needed
};
  const fetchData = async () => {
    try {
      const res = await axios.get("https://ccsched.onrender.com/block");
      setBlock(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditBlock = async (blockId, updatedBlockData) => {
    try {
      await axios.put(`https://ccsched.onrender.com/block/${blockId}/update`, updatedBlockData);
      fetchData(); // Refresh data after updating
      handleEditSuccess(); // Show success alert
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      handleEditError(); // Show error alert

    }
  };

  const handleDeleteBlock = async (blockId) => {
    try {
      await axios.delete(`https://ccsched.onrender.com/block/${blockId}/delete`);

      if(selectedBlock && selectedBlock.id === blockId){
        setShowEditBlockModal(false);
        setSelectedBlock(null);
      }

      setBlock((prevblock) => prevblock.filter((blockItem) => blockItem.id !== blockId));
        
        setShowDeleteSuccessAlert(true);
        setTimeout(() => {
          setShowDeleteSuccessAlert(false);
        }, 8000); // Hide alert after 3 seconds
    } catch (error) {
      console.error(`Error deleting block with ID ${blockId}:`, error);
    }
  };
  

  return (
    <div>
       {/* Alert for successful edit */}
       {showEditSuccessAlert && selectedBlock && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Success!</strong> Departamental Block for <strong>{selectedBlock.program}</strong> updated successfully!
          <button type="button" className="btn-close" onClick={() => setShowEditSuccessAlert(false)} aria-label="Close"></button>
        </div>
      )}

      {/* Alert for edit error */}
      {showEditErrorAlert && selectedBlock &&(
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error!</strong> Failed to update  Departamental Block for <strong>{selectedBlock.program}</strong>.
          <button type="button" className="btn-close" onClick={() => setShowEditErrorAlert(false)} aria-label="Close"></button>
        </div>
      )}

      {/* Alert for successful deletion */}
      {showDeleteSuccessAlert && selectedBlock && (
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Success!</strong> Departamental Block for <strong>{selectedBlock.program}</strong> deleted successfully!
        <button type="button" className="btn-close" onClick={() => setShowDeleteSuccessAlert(false)} aria-label="Close"></button>
      </div>
    )}

      <section className="home-section">
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <AddBlock
                show={showAddBlockModal}
                handleClose={toggleAddBlockModal}
                handleAdd={handleAddblock}
              />

              <table className='table table-bordered'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Program</th>
                    <th>1st</th>
                    <th>2nd</th>
                    <th>3rd</th>
                    <th>4th</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                {block.map((blockItem, id) => (
                  <tr key={blockItem.id}>
                    <td>{id + 1}</td>
                    <td>{blockItem.program}</td>
                    <td>{blockItem.firstYear}</td>
                    <td>{blockItem.secondYear}</td>
                    <td>{blockItem.thirdYear}</td>
                    <td>{blockItem.fourthYear}</td>
                    <td>{blockItem.total}</td>
                    <td>
                      <button
                        onClick={() => toggleEditBlockModal(blockItem)}
                        className="btn btn-primary"
                      >
                        <FontAwesomeIcon icon={faPen}/>
                      </button>
                      <DeleteBlock
                        key={blockItem.id} // Assign a unique key here
                        show={showModalDelete}
                        handleClose={toggleModalDelete}
                        handleDelete={() => handleDeleteBlock(blockItem.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      {showEditBlockModal && (
  <EditBlock
    show={showEditBlockModal}
    handleClose={() => setShowEditBlockModal(false)}
    selectedBlock={selectedBlock} 
    onEdit={handleEditBlock}
  />
)}

    </div>
  );
}

export default ViewBlock;