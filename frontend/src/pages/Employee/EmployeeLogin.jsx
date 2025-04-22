import React from 'react';

const EmployeeLogin = ({ loginData, setLoginData, handleLogin }) => (
    <div className="login-section">
        <h2 className="login-title">Employee Sign In</h2>
        <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
                <label>Employee ID:</label>
                <input type="text" placeholder="Enter your ID" required 
                    value={loginData.employeeId} 
                    onChange={(e) => setLoginData({ ...loginData, employeeId: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label>Password:</label>
                <input type="password" placeholder="Enter your password" required 
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
            </div>
            <button type="submit" className="login-button">Sign In</button>
        </form>
    </div>
);

export default EmployeeLogin;
