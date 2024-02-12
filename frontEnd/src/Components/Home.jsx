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
      };
    
    axios.defaults.withCredentials = true;
    const blocks = async () => {
        try {
        const res = await axios.get("https://ccsched.onrender.com/blockCount");
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
        const res = await axios.get("https://ccsched.onrender.com/room");
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
        const res = await axios.get("https://ccsched.onrender.com/prof");
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
        const res = await axios.get("https://ccsched.onrender.com/classs"); // Update the endpoint to match the server-side route
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
        axios.get('https://ccsched.onrender.com')
        .then(res => {
            if(res.data.Status === 'Success' ){
                console.log("Auth!!!1");
                setAuth(true)
            }else{
                console.log("not authenticated!!!!");
                setAuth(false)
                navigate('/login');
            }
        }).then(err => console.log(err));
    }, [navigate])

    
  return (
    <div>
        {auth ?
               <div className="h-100">
      <div className="wrapper">
          <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <Sidebar isSidebarOpen={isSidebarOpen} />
           <div className="main-panel">
            <div className="content">
              <div className="page-inner">
              {showWelcome && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>Success!</strong> Welcome {name}
              <button type="button" className="btn-close" onClick={() => setShowWelcome(false)} aria-label="Close"></button>
            </div>
          )}
            <div className="container mt-3">
            <div className="row">
                <div className="col-md-3">
                  <div className="card" style={customCardStyle}>
                    <div className="card-body text-danger">
                    Classes
                    <hr></hr>
                    <h1>{classCount}</h1>
                    <p>
                    <a href="/specialization" className="card-link text-danger">
                        List of Classes
                    </a>
                    </p>
                    </div>
                </div>
                </div>
                <div className="col-md-3">
                <div className="card" style={customCardStyle}>
                    <div className="card-body text-danger">
                    # Professors
                    <hr></hr>
                    <h1>{prof}</h1>
                    <p>
                    <a href="/prof" className="card-link text-danger">
                        List of Professors
                    </a>
                    </p>

                    </div>
                </div>
                </div>
                <div className="col-md-3">
                <div className="card" style={customCardStyle}>
                    <div className="card-body text-danger">
                    # Blocks
                    <hr></hr>
                    <h1>{blockCount}</h1>
                    <p>
                    <a href="/block" className="card-link text-danger">
                        List of Blocks
                    </a>
                    </p>
                    </div>
                </div>
                </div>
                <div className="col-md-3">
                <div className="card" style={customCardStyle}>
                    <div className="card-body text-danger">
                    # Available Rooms
                    <hr></hr>
                    <h1>{roomCount}</h1>
                    <p>
                    <a href="/viewroom" className="card-link text-danger">
                        List of Rooms
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
        : <div>
            
            </div>}
    </div>
  )
}

export default Home