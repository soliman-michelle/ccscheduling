import { useState } from 'react';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import 'bootstrap/dist/css/bootstrap.css';
import ViewProf from './ViewProf';

const Prof = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-100">
      <div className="class-wrapper">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className='container-fluid'>
        <div className="row">
          <div className="col-md-2">
            <Sidebar isSidebarOpen={isSidebarOpen} />
          </div>
          <div className="col-md-10 mt-5">
            <ViewProf/>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Prof;