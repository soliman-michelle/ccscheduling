import React, { useState } from 'react';
import Header from '../../Header';
import Sidebar from '../../Sidebar';
import 'bootstrap/dist/css/bootstrap.css';
import ViewSchedule from './ViewSchedule';
import ManualSched from './ManualSched';

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
      <div className="class-wrapper">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <div className='container-fluid'>
          <div className="row">
            <div className="col-md-2">
              <Sidebar isSidebarOpen={isSidebarOpen} />
            </div>
            <div className="col-md-10 mt-5">
              <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'autoGenerate' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleTabChange('autoGenerate');}}
                href="/schedule/"
              >
                Auto Generate
              </a>  
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'manual' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleTabChange('manual');}}
                href="/schedule/manual/"
              >
                Manual
              </a>
            </li>
              </ul>

              {activeTab === 'autoGenerate' ? (
                <div>
                  <ViewSchedule/>
                </div>
              ) : (
                <div>
                  <ManualSched/>
               </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
