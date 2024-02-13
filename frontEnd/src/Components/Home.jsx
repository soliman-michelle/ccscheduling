import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar";
import Header from "./Header";

const Home = () => {
    const [auth, setAuth] = useState(false);
    const [roomCount, setRoomCount] = useState(0);
    const [prof, setProf] = useState(0);
    const [classCount, setClassCount] = useState(0);
    const [blockCount, setBlockCount] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showWelcome, setShowWelcome] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };
    
      const customCardStyle = {
        height: '250px', // Use single quotes for '70px'
        textAlign: 'center',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      };
    
    axios.defaults.withCredentials = true;
    const blocks = async () => {
        try {
        const res = await axios.get("http://localhost:8081/blockCount");
        console.log("Block data:", res.data);
    
        if (res.data && typeof res.data === 'object') {
            const receivedBlock = res.data.blockCount || 0; 
            console.log("Received block count:", receivedBlock);
    
            setBlockCount(receivedBlock);
        } else {
            setBlockCount(0); 
        }
        } catch (err) {
        console.error(err);
        }
    };
    
    useEffect(() => {
        blocks();
    }, []);

    const fetchData = async () => {
        try {
        const res = await axios.get("http://localhost:8081/room");
        console.log("Room data:", res.data);
    
        if (res.data && typeof res.data === 'object') {
            const receivedRoomCount = res.data.roomCount || 0; // Get the count from the array length
            console.log("Received room count:", receivedRoomCount);
    
            setRoomCount(receivedRoomCount);
        } else {
            setRoomCount(0); // Set default value if count isn't available or data structure is different
        }
        } catch (err) {
        console.error(err);
        }
    };
    
    const fetchDatas = async () => {
        try {
        const res = await axios.get("http://localhost:8081/prof");
        console.log("Prof data:", res.data);
    
        if (res.data && typeof res.data === 'object') {
            const receivedProfCount = res.data.prof || 0; // Get the count from the array length
            console.log("Received prof count:", receivedProfCount);
    
            setProf(receivedProfCount);
        } else {
            setProf(0); // Set default value if count isn't available or data structure is different
        }
        } catch (err) {
        console.error(err);
        }
    };
    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    
        if (!token) {
          navigate('/login'); // Redirect to login if no token found
        }
      }, [navigate]);
    const fetchClassesCount = async () => {
        try {
        const res = await axios.get("http://localhost:8081/classs"); // Update the endpoint to match the server-side route
        console.log("Classes data:", res.data);
    
        if (res.data && typeof res.data === 'object') {
            const receivedClassCount = res.data.classCount || 0; // Access the count property from the object
            console.log("Received classes:", receivedClassCount);
    
            setClassCount(receivedClassCount);
        } else {
            setClassCount(0); // Set default value if count isn't available or data structure is different
        }
        } catch (err) {
        console.error(err);
        }
    };
    
    useEffect(() => {
        fetchClassesCount();
        fetchData();
        fetchDatas();
    }, []);
    useEffect(() => {
        axios.get('http://localhost:8081')
        .then(res => {
            if(res.data.Status === 'Success' ){
                setAuth(true)
            }else{
                setAuth(false)
                navigate('/login');
            }
        }).then(err => console.log(err));
    }, [navigate])

    
  return (
    <div>

<style>
        {`

@media (min-width: 768px) {
  .main{
    width:100%;
  }
}
`}

</style>
{auth ?
    <div className="h-100">
      <div className="wrapper">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className = "main">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>

          
           <div className="main-panel">
            <div className="content">
              <div className="page-inner">
              {showWelcome && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>Success!</strong> Welcome {name}
              <button type="button" className="btn-close" onClick={() => setShowWelcome(false)} aria-label="Close"></button>
            </div>
          )}


<div className = "home section pt-2">
<div className="container">
            <div className="row">
                <div className = "card card-body m-2 p-5 mt-3 mb-5 text-center text-danger" style = {{backgroundImage: "url('/home.png')", backgroundSize: 'cover', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)'}}>
            <h3><b><i>WELCOME TO CCS SCHEDULING MANAGEMENT SYSTEM</i></b></h3>
            </div>
                <div className="custom-card col-md-3 mb-3">
                  <div className="card " style={customCardStyle}>
                    <div className="card-body text-danger" style = {{backgroundImage: "url('/design.png')", backgroundSize: 'cover'}}>
                    <h5><b>Classes</b></h5>
                    <hr></hr>
                    <h1>{classCount}</h1>
                    <p>
                    <a href="/specialization" className="card-link text-danger">
                        <u>List of Classes</u>
                    </a>
                    </p>
                    </div>
                </div>
                </div>

            <div className="custom-card col-md-3 mb-3">
                <div className="card" style={customCardStyle}>
                    <div className="card-body text-danger" style = {{backgroundImage: "url('/design.png')", backgroundSize: 'cover'}}>
                    <h5><b>Professors</b></h5>
                    <hr></hr>
                    <h1>{prof}</h1>
                    <p>
                    <a href="/prof" className="card-link text-danger">
                        <u>List of Professors</u>
                    </a>
                    </p>

                    </div>
                </div>
                </div>
                <div className="custom-card col-md-3 mb-3">
                <div className="card" style={customCardStyle}>
                    <div className="card-body text-danger" style = {{backgroundImage: "url('/design.png')", backgroundSize: 'cover'}}>
                    <h5><b>Blocks</b></h5>
                    <hr></hr>
                    <h1>{blockCount}</h1>
                    <p>
                    <a href="/block" className="card-link text-danger">
                    <u>List of Blocks</u>
                    </a>
                    </p>
                    </div>
                </div>
                </div>
                <div className="custom-card col-md-3 mb-3">
                <div className="card" style={customCardStyle}>
                    <div className="card-body text-danger" style = {{backgroundImage: "url('/design.png')", backgroundSize: 'cover'}}>
                    <h5><b>Available Rooms</b></h5>
                    <hr></hr>
                    <h1>{roomCount}</h1>
                    <p>
                    <a href="/viewroom" className="card-link text-danger">
                        <u>List of Rooms</u>
                    </a>
                    </p>
                    </div>
                </div>
                </div>
                </div>
                </div>
</div>




              </div>
            </div>
           </div>
      </div>
      </div>
    </div>
        : <div>
            
            </div>}
    </div>
  )
}

export default Home