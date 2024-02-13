import { useState } from 'react';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import 'bootstrap/dist/css/bootstrap.css';
import ViewSchedule from './ViewSchedule';
import ManualSched from './ManualSched';
import SummerGenetic from './SummerGenetic';

const Schedule = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('autoGenerate');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="h-100">
    <div className="wrapper">
    <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className = "main">
    <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />


        <div className='container-fluid'>
          <div className="row">
            <div className="col-md-1">
            </div>
            <div className="col-md-10 mt-5">
              <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'autoGenerate' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleTabChange('autoGenerate');}}
                href="/schedule/"
              >
                Class
              </a>  
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'manual' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleTabChange('manual');}}
                href="/schedule/manual/"
              >
                Summer
              </a>
            </li>
              </ul>

              {activeTab === 'autoGenerate' ? (
                <div>
                  <ViewSchedule/>
                </div>
              ) : (
                <div>
                  <SummerGenetic/>
               </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Schedule;
