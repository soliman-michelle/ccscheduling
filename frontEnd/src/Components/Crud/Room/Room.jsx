import { useState } from 'react';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import 'bootstrap/dist/css/bootstrap.css';
import ViewRoom from './ViewRoom';

const Room = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-100">
    <div className="wrapper">
    <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className = "main">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>
          <div className="container">
            <ViewRoom/>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Room;