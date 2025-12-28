import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

const OwnerDashboard: React.FC = () => {
  const [owner_id, setOwner_id] = useState<string | null>(null);
  const token = sessionStorage.getItem("token");

  const getAccess = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:6876/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unauthorized");
      }

      setOwner_id(data?.user.id);
    } catch (err) {
      console.error("Auth error", err);
    }
  };

  useEffect(() => {
    getAccess();
  }, [token]);

  const [activePage, setActivePage] = useState("Upload Property");

  if (!owner_id) return <p>Loading owner...</p>;

  return (
    <div style={styles.container}>
      <Sidebar
        items={["Upload Property", "Transactions", "All Properties", "Logout"]}
        onSelect={setActivePage}
      />

      <div style={styles.main}>
        {activePage === "Upload Property" && (
          <UploadProperty ownerId={owner_id} />
        )}
        {/* {activePage === "Transactions" && <Transactions ownerId={owner_id} />} */}
        {activePage === "All Properties" && (
          <AllProperties ownerId={owner_id} />
        )}
        {activePage === "Logout" && <Logout />}
      </div>
    </div>
  );
};

export default OwnerDashboard;

const UploadProperty: React.FC<{ ownerId: string }> = ({ ownerId }) => {
  const [property_name, setPropertyName] = useState("");
  const [address, setAddress] = useState("");
  const [prize, setPrize] = useState("");
  const [property_type, setPropertyType] = useState("");
  const [total_area, setTotalArea] = useState("");
  const [water_available, setWaterAvailable] = useState(false);
  const [electricity_available, setElectricityAvailable] = useState(false);
  const [availability_status, setAvailabilityStatus] = useState("");
  const [monthly_rent, setMonthlyRent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:6876/api/properties/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: ownerId,
          property_name,
          address,
          prize: Number(prize),
          property_type,
          total_area: Number(total_area),
          water_available,
          electricity_available,
          availability_status,
          monthly_rent: Number(monthly_rent),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage("✅ Property uploaded successfully");

      // reset
      setPropertyName("");
      setAddress("");
      setPrize("");
      setPropertyType("");
      setTotalArea("");
      setWaterAvailable(false);
      setElectricityAvailable(false);
      setAvailabilityStatus("");
      setMonthlyRent("");
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Property (Land)</h2>

      <input
        type="text"
        placeholder="Property Name"
        value={property_name}
        onChange={(e) => setPropertyName(e.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="Price"
        value={prize}
        onChange={(e) => setPrize(e.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="Property Type (Residential / Commercial / Agri)"
        value={property_type}
        onChange={(e) => setPropertyType(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="Total Area"
        value={total_area}
        onChange={(e) => setTotalArea(e.target.value)}
      />
      <br />

      <label>
        <input
          type="checkbox"
          checked={water_available}
          onChange={(e) => setWaterAvailable(e.target.checked)}
        />
        Water Available
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={electricity_available}
          onChange={(e) => setElectricityAvailable(e.target.checked)}
        />
        Electricity Available
      </label>
      <br />

      <input
        type="text"
        placeholder="Availability Status (Available / Sold)"
        value={availability_status}
        onChange={(e) => setAvailabilityStatus(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="Monthly Rent (optional)"
        value={monthly_rent}
        onChange={(e) => setMonthlyRent(e.target.value)}
      />
      <br />

      <br />
      <br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Property"}
      </button>

      <br />
      {message && <p>{message}</p>}
    </div>
  );
};

// const Transactions: React.FC = () => {
//   return (
//     <div>
//       <h2>Transactions</h2>
//       <ul>
//         <li>Tenant A - ₹10,000</li>
//         <li>Tenant B - ₹18,000 </li>
//         <li>Tenant C - ₹25,000 </li>
//       </ul>
//     </div>
//   );
// };

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
    navigate("/");
  }, [navigate]);

  return <p>Logging out...</p>;
};

const AllProperties: React.FC<{ ownerId: string }> = ({ ownerId }) => {
  const [prop, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(
          `http://localhost:6876/api/properties/get_all_prop_by_owner?owner_id=${ownerId}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setProperties(data.properties || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [ownerId]);

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>❌ {error}</p>;

  return (
    <div>
      <h2>All Properties</h2>

      {prop.length === 0 && <p>No properties found</p>}

      {prop.map((p) => (
        <div
          key={p.id}
          style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
        >
          <p>
            <b>Property Name:</b> {p.property_name}
          </p>
          <p>
            <b>Address:</b> {p.address}
          </p>
          <p>
            <b>Property Type:</b> {p.property_type}
          </p>
          <p>
            <b>Total Area:</b> {p.total_area} sq.ft
          </p>
          <p>
            <b>Price:</b> ₹{p.prize}
          </p>

          <p>
            <b>Water Available:</b> {p.water_available ? "Yes" : "No"}
          </p>

          <p>
            <b>Electricity Available:</b>{" "}
            {p.electricity_available ? "Yes" : "No"}
          </p>

          <p>
            <b>Availability Status:</b> {p.availability_status}
          </p>

          {p.monthly_rent && (
            <p>
              <b>Monthly Rent:</b> ₹{p.monthly_rent}
            </p>
          )}

          <p>
            <b>Created At:</b> {new Date(p.created_at).toLocaleDateString()}
          </p>
          {p.buyer_id && <p>done</p>}
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
