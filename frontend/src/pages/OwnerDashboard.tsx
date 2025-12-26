import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const OWNER_ID = "fa1bb811-b855-4db6-a60d-3446b917efb0"; // for testing only

const OwnerDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState("Upload Property");

  return (
    <div style={styles.container}>
      <Sidebar
        items={["Upload Property", "Transactions", "All Properties"]}
        onSelect={setActivePage}
      />

      <div style={styles.main}>
        {activePage === "Upload Property" && <UploadProperty />}
        {activePage === "Transactions" && <Transactions />}
        {activePage === "All Properties" && <AllProperties />}
      </div>
    </div>
  );
};

export default OwnerDashboard;

const UploadProperty: React.FC = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:6876/api/properties/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner_id: OWNER_ID,
          name,
          address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload property");
      }

      setMessage("✅ Property uploaded successfully");
      setName("");
      setAddress("");
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Property</h2>

      <input
        placeholder="Property Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />

      <input
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={styles.input}
      />

      <button style={styles.button} onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Property"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

const Transactions: React.FC = () => {
  return (
    <div>
      <h2>Transactions</h2>
      <ul>
        <li>Tenant A - ₹10,000</li>
        <li>Tenant B - ₹18,000 </li>
        <li>Tenant C - ₹25,000 </li>
      </ul>
    </div>
  );
};

const AllProperties: React.FC = () => {
  const [prop, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(
          `http://localhost:6876/api/properties/get_all_prop_by_owner?owner_id=${OWNER_ID}`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch properties");
        }

        setProperties(data?.properties || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>❌ {error}</p>;

  return (
    <div>
      <h2>All Properties</h2>

      {prop.length === 0 && <p>No properties found</p>}

      {prop.map((prop) => (
        <div key={prop.id} style={styles.card}>
          🏠 <b>{prop.name}</b>
          <br />
          📍 {prop.address}
        </div>
      ))}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    minHeight: "100vh",
  },
  main: {
    flex: 1,
    padding: "30px",
    background: "#f8fafc",
  },
  input: {
    display: "block",
    width: "300px",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
  card: {
    padding: "15px",
    marginBottom: "10px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
};
