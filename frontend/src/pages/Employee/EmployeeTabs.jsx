import React from 'react';

const EmployeeTabs = ({ activeTab, setActiveTab, employeeData }) => (
    <div className="employee-tabs">
        <button className={`tab ${activeTab === 'hours' ? 'active' : ''}`} onClick={() => setActiveTab('hours')}>Log Hours</button>
        <button className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>My Info</button>
        <button className={`tab ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>Inventory</button>
        <button className={`tab ${activeTab === 'viewTables' ? 'active' : ''}`} onClick={() => setActiveTab('viewTables')}>View Tables</button>
        
        {(employeeData?.position === 'Admin' || employeeData?.position === 'Manager') && (
            <button className={`tab ${activeTab === 'managerTools' ? 'active' : ''}`} onClick={() => setActiveTab('managerTools')}>
                Manager Tools
            </button>
        )}
    </div>
);

export default EmployeeTabs;
