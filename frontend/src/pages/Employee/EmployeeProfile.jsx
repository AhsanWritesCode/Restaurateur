import React, { useState } from 'react';
import axios from 'axios';

const EmployeeProfile = ({ employeeData, setEmployeeData, handleUpdate }) => {

    return (
        <div className="profile-section">
            <h2>Your Information</h2>
            <form className="profile-form" onSubmit={handleUpdate}>
                {/* Name Field */}
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={employeeData.name}
                        onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })}
                    />
                </div>

                {/* Email Field */}
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={employeeData.email}
                        onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })}
                    />
                </div>

                {/* Position Field (read-only) */}
                <div className="form-group">
                    <label>Position:</label>
                    <input
                        type="text"
                        value={employeeData.position}
                        readOnly
                    />
                </div>

                {/* Phone Number Field */}
                <div className="form-group">
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        value={employeeData.phoneNumber}
                        onChange={(e) => setEmployeeData({ ...employeeData, phoneNumber: e.target.value })}
                    />
                </div>

                {/* Optional New Password Field */}
                <div className="form-group">
                    <label>Change Password:</label>
                    <input
                        type="password"
                        placeholder="New Password (leave blank to keep current)"
                        value={employeeData.password || ""}
                        onChange={(e) => setEmployeeData({ ...employeeData, password: e.target.value })}
                    />
                </div>

                {/* Submit Button */}
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default EmployeeProfile;
