import React, { useEffect, useState } from "react";
import axios from "axios";

const BartenderCertifications = ({ BartenderId }) => {
    const [eid, setEid] = useState(BartenderId);
    const [certification, setCertification] = useState(null);
    const [expiryDate, setExpiryDate] = useState("");
    const [certificateUrl, setCertificateUrl] = useState("");
    const [error, setError] = useState("");

    // Fetch certification data
    useEffect(() => {
        const fetchCertification = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/bartenderCertifications/${eid}`);
                setCertification(response.data);
                setExpiryDate(response.data.Expiry_Date);
                setCertificateUrl(response.data.Certificate_URL);
            } catch (err) {
                setCertification(null); // Certification not found is expected
            }
        };

        if (eid) fetchCertification();
    }, [eid]);

    // Create a new certification
    const handleCreate = async () => {
        try {
            await axios.post("http://localhost:8800/bartenderCertifications", {
                EID: eid,
                Expiry_Date: expiryDate,
                Certificate_URL: certificateUrl,
            });
            alert("Certification created successfully!");
            setCertification({ Expiry_Date: expiryDate, Certificate_URL: certificateUrl });
        } catch (err) {
            setError("Failed to create certification.");
        }
    };

    // Update an existing certification
    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:8800/bartenderCertifications/${eid}`, {
                Expiry_Date: expiryDate,
                Certificate_URL: certificateUrl,
            });
            alert("Certification updated successfully!");
            setCertification({ Expiry_Date: expiryDate, Certificate_URL: certificateUrl });
        } catch (err) {
            setError("Failed to update certification.");
        }
    };

    const isFormValid = expiryDate.trim() !== "" && certificateUrl.trim() !== "";

    return (
        <div>
            <h2>Bartender Certification</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {certification ? (
                <div>
                    <h3>Current Certification</h3>
                    <p><strong>Expiry Date:</strong> {certification.Expiry_Date}</p>
                    <p><strong>Certificate URL:</strong></p>
                    <img src={certification.Certificate_URL} alt="Bartender Certification" width="200" />

                    <hr />
                    <h3>Update Certification</h3>
                    <div>
                        <label>Expiry Date:</label>
                        <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Certificate URL:</label>
                        <input
                            type="text"
                            value={certificateUrl}
                            onChange={(e) => setCertificateUrl(e.target.value)}
                            placeholder="Enter image URL"
                        />
                    </div>
                    <button onClick={handleUpdate} disabled={!isFormValid}>
                        Update Certification
                    </button>
                </div>
            ) : (
                <div>
                    <p>No certification found for this bartender.</p>
                    <h3>Create Certification</h3>
                    <div>
                        <label>Expiry Date:</label>
                        <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Certificate URL:</label>
                        <input
                            type="text"
                            value={certificateUrl}
                            onChange={(e) => setCertificateUrl(e.target.value)}
                            placeholder="Enter image URL"
                        />
                    </div>
                    <button onClick={handleCreate} disabled={!isFormValid}>
                        Create Certification
                    </button>
                </div>
            )}
        </div>
    );
};

export default BartenderCertifications;
