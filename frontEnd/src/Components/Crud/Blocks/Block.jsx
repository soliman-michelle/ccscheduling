import { useState } from 'react';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import 'bootstrap/dist/css/bootstrap.css';
import ViewBlock from './ViewBlock';

const Block = () => {
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
        <div className = "container">
            <ViewBlock/>
          </div>
        </div>
        </div>
      </div>
  );
};

export default Block;