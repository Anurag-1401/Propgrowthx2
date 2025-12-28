import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

const TenantDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState("My Property");
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

  if (!owner_id) return <p>Loading owner...</p>;

  return (
    <div style={styles.container}>
      <Sidebar
        items={["My Property", "Payments", "Profile", "All Property", "Logout"]}
        onSelect={setActivePage}
      />

      <div style={styles.main}>
        {activePage === "All Property" && <AllProperties userId={owner_id} />}
        {activePage === "My Property" && <MyProperties userId={owner_id} />}
        {activePage === "Payments" && <Payments />}
        {activePage === "Profile" && <h2>Tenant Profile (Dummy)</h2>}
        {activePage === "Logout" && <Logout />}
      </div>
    </div>
  );
};

export default TenantDashboard;
const AllProperties: React.FC<{ userId: string }> = ({ userId }) => {
  const [props, setProps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:6876/api/properties/get_all")
      .then((res) => res.json())
      .then((data) => {
        setProps(data.properties || []);
        setLoading(false);
      });
  }, []);

  const handleCancel = () => {};

  const handleRent = async (propertyId: String) => {
    try {
      const res = await fetch("http://localhost:6876/api/properties/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, propId: propertyId }), // userId from auth
      });

      const data = await res.json();
      console.log(data.message);
    } catch (err) {
      console.log(err);
    }
  };
  const handleBuy = async (propertyId: string) => {
    try {
      const res = await fetch("http://localhost:6876/api/properties/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, propId: propertyId }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <p>Loading all properties...</p>;

  return (
    <div>
      <h2>All Properties</h2>

      {props.map((p) => (
        <div key={p.id} style={box}>
          <p>
            <b>Name:</b> {p.property_name}
          </p>
          <p>
            <b>Address:</b> {p.address}
          </p>
          <p>
            <b>Type:</b> {p.property_type}
          </p>
          <p>
            <b>Total Area:</b> {p.total_area}
          </p>
          <p>
            <b>Price:</b> ₹{p.prize}
          </p>
          <p>
            <b>Status:</b> {p.availability_status}
          </p>

          {p.buyer_id && (
            <>
              <button onClick={() => handleRent(p.id)}>Rent</button>
              <button onClick={() => handleBuy(p.id)}>Buy</button>
              <button onClick={handleCancel}>Cancel</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const MyProperties: React.FC<{ userId: string }> = ({ userId }) => {
  const [props, setProps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `http://localhost:6876/api/properties/get_all_prop_by_buyer?buyer_id=${userId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setProps(data.properties || []);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p>Loading my properties...</p>;

  if (props.length === 0) return <p>No property assigned to you</p>;

  return (
    <div>
      <h2>My Properties</h2>

      {props.map((p) => (
        <div key={p.id} style={box}>
          <p>
            <b>Name:</b> {p.property_name}
          </p>
          <p>
            <b>Address:</b> {p.address}
          </p>
          <p>
            <b>Rent:</b> ₹{p.monthly_rent}
          </p>
          <p>
            <b>Status:</b> {p.availability_status}
          </p>
        </div>
      ))}
    </div>
  );
};
const Payments = () => (
  <div>
    <h2>Payments</h2>
    <ul>
      <li>Jan – ₹10,000 ✅</li>
      <li>Feb – ₹10,000 ✅</li>
      <li>Mar – Pending ❌</li>
    </ul>
  </div>
);
const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
    navigate("/");
  }, [navigate]);

  return <p>Logging out...</p>;
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: "flex" },
  main: { flex: 1, padding: 30, background: "#f1f5f9" },
};

const box = {
  border: "1px solid #ccc",
  padding: 10,
  marginBottom: 10,
};
