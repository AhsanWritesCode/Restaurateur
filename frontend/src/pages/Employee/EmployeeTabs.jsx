import React from 'react';

const EmployeeTabs = ({ activeTab, setActiveTab, employeeData }) => (
    <div className="employee-tabs">
        <button className={`tab ${activeTab === 'hours' ? 'active' : ''}`} onClick={() => setActiveTab('hours')}>Log Hours</button>
        <button className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>My Info</button>
        <button className={`tab ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>Inventory</button>
        <button className={`tab ${activeTab === 'orderMenu' ? 'active' : ''}`} onClick={() => setActiveTab('orderMenu')}>Server Order</button>
        <button className={`tab ${activeTab === 'viewTables' ? 'active' : ''}`} onClick={() => setActiveTab('viewTables')}>View Tables</button>
        <button className={`tab ${activeTab === 'bartenderWindow' ? 'active' : ''}`} onClick={() => setActiveTab('bartenderWindow')}>Bartender Window</button>
        <button className={`tab ${activeTab === 'cookWindow' ? 'active' : ''}`} onClick={() => setActiveTab('cookWindow')}>Cook Window</button>

        {(employeeData?.position === 'Admin' || employeeData?.position === 'Manager') && (
            <>
                <button className={`tab ${activeTab === 'managerTools' ? 'active' : ''}`} onClick={() => setActiveTab('managerTools')}>Manager Tools</button>
                <button className={`tab ${activeTab === 'editReservations' ? 'active' : ''}`} onClick={() => setActiveTab('editReservations')}>Edit Reservations</button>
                <button className={`tab ${activeTab === 'parkingManagement' ? 'active' : ''}`} onClick={() => setActiveTab('parkingManagement')}>Parking Management</button> {/* New tab */}
            </>
        )}
    </div>
);

export default EmployeeTabs;
