import React from 'react';

const EmployeeTabs = ({ activeTab, setActiveTab, employeeData }) => (
    <div className="employee-tabs">
        <button className={`tab ${activeTab === 'hours' ? 'active' : ''}`} onClick={() => setActiveTab('hours')}>Log Hours</button>
        <button className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>My Info</button>
        <button className={`tab ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>Inventory</button>
        <button className={`tab ${activeTab === 'viewReservations' ? 'active' : ''}`} onClick={() => setActiveTab('viewTables')}>View Tables</button>
        <button className={`tab ${activeTab === 'editReservations' ? 'active' : ''}`} onClick={() => setActiveTab('editReservations')}>Edit Reservations</button>

        {(employeeData?.position === 'Server' ||  employeeData?.position === 'Admin' || employeeData?.position === 'Manager') && (
            <>
                <button className={`tab ${activeTab === 'orderMenu' ? 'active' : ''}`} onClick={() => setActiveTab('orderMenu')}>Create Order</button>
            </>
        )}

        {(employeeData?.position === 'Cook'|| employeeData?.position === 'Admin' || employeeData?.position === 'Manager') && (
            <>
                <button className={`tab ${activeTab === 'cookWindow' ? 'active' : ''}`} onClick={() => setActiveTab('cookWindow')}>Cook Window</button>
            </>
        )}

        {(employeeData?.position === 'Bartender') && (
            <>
        <button className={`tab ${activeTab === 'BartenderCertifications' ? 'active' : ''}`} onClick={() => setActiveTab('BartenderCertifications')}>BartenderCertifications</button>

            </>
        )}

        {(employeeData?.position === 'Bartender'|| employeeData?.position === 'Admin' || employeeData?.position === 'Manager') && (
            <>
        <button className={`tab ${activeTab === 'bartenderWindow' ? 'active' : ''}`} onClick={() => setActiveTab('bartenderWindow')}>Bartender Window</button>
            </>
        )}


        {(employeeData?.position === 'Admin' || employeeData?.position === 'Manager') && (
            <>
                <button className={`tab ${activeTab === 'CustomerHistory' ? 'active' : ''}`} onClick={() => setActiveTab('CustomerHistory')}>Customer History</button>
                <button className={`tab ${activeTab === 'managerTools' ? 'active' : ''}`} onClick={() => setActiveTab('managerTools')}>Add or Remove an Employee</button>
                <button className={`tab ${activeTab === 'parkingManagement' ? 'active' : ''}`} onClick={() => setActiveTab('parkingManagement')}>Parking Management</button> {/* New tab */}
            </>
        )}
    </div>
);

export default EmployeeTabs;
