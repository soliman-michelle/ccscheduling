import axios from 'axios';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ReactPaginate from 'react-paginate';
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
  const [currentPage, setCurrentPage] = useState(0); //start - my
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const blockItems = block.slice(indexOfFirstItem, indexOfLastItem); //end

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
      const res = await axios.get("http://localhost:8081/block");
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
      await axios.put(`http://localhost:8081/block/${blockId}/update`, updatedBlockData);
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
      await axios.delete(`http://localhost:8081/block/${blockId}/delete`);

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
  

  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected); //this
  };

  return (
    <div>
      <style>
        {`

@media (min-width: 768px) {
  .container{
    width:100%;
  }
}

.container header .filterEntries {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filterEntries .entries {
  color: #000000;
}

.filterEntries.entries select, .filterEntries .filter input {
  padding: 7px 10px;
  border: 1px solid #000000;
  color: #ffffff;
  background: #ffffff;
  border-radius: 5px;
  outline: none;
  transition: 0.3s;
  cursor: pointer;
}

.filterEntries .entries select{
  padding: 5px 10px;
}

.filterEntries .filter {
  display: flex;
  align-items: center;
}

.filter label {
  color:#ffffff;
  margin-right: 5px;
}

.filter input:focus{
  border-color: rgb(255, 0, 162);
}
        .custom-table th,
        .custom-table td{
          border: 4px
          solid #ffff;
        }

        @media (max-width: 768px) {
          .custom-table {
            overflow-x: auto;
            white-space: nowrap; /* Prevent line breaks */
          }
        }
        


        .content .card{
          padding: 20px;
          padding-top: 30px;
          margin-left: 10px;
          margin-right:10px;
          margin-top: 20px;
          font-size: 14px;
          border-radius: 10px;
          background-image: url('/cover.png');
          background-size: 100%;
          background-position: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          color: #ffffff;
}
        `}
      </style>
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

<div className = "content">
      <div className = "card">
        <h1>BLOCK</h1>
      </div>
      </div>
      <section className="home-section pt-2">
        <div className='container-fluid'>
          <div className='row'>
            <header>
            <div className='filterEntries'>
              <AddBlock
                show={showAddBlockModal}
                handleClose={toggleAddBlockModal}
                handleAdd={handleAddblock}
              />
            <div className="entries">
              Show {' '}    
              <select name="" id="table_size" onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              </select> entries
            </div>
            </div>
            </header>
            <div className="card-body">
            <div className='col-md-12 col-md-12 ps-2 pe-2 overflow-auto'>
              <table className='custom-table table table-striped table-hover .table-responsive mt-2'>
                <thead>
                  <tr className = "custom-tr table-primary border-dark">
                    <th>No.</th>
                    <th>Program</th>
                    <th>1st</th>
                    <th>2nd</th>
                    <th>3rd</th>
                    <th>4th</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {block.map((blockItem, id) => (
                  <tr key={blockItem.id}>
                    <td className = "course-info">{id + 1 + currentPage * itemsPerPage}</td>
                    <td  className = "course-info">{blockItem.program}</td>
                    <td className = "course-info">{blockItem.firstYear}</td>
                    <td className = "course-info">{blockItem.secondYear}</td>
                    <td className = "course-info">{blockItem.thirdYear}</td>
                    <td className = "course-info">{blockItem.fourthYear}</td>
                    <td className = "course-info">{blockItem.total}</td>
                    <td>
                      <button
                        onClick={() => toggleEditBlockModal(blockItem)}
                        className="custom-button btn btn-primary"
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

            <footer>
              <span className="showEntries">
  Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, block.length)} of {block.length} entries
</span>
              <ReactPaginate
                previousLabel={'< previous'}
                nextLabel={'next >'}
                breakLabel={'...'}
                pageCount={Math.ceil(block.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={'pagination-container'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
      />
      </footer>
      
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