import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const TenantDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState("My Property");

  const renderContent = () => {
    switch (activePage) {
      case "My Property":
        return <h2>My Rented Property (Dummy)</h2>;

      case "Payments":
        return (
          <ul>
            <li>Jan Rent - ₹10,000 ✅</li>
            <li>Feb Rent - ₹10,000 ✅</li>
            <li>Mar Rent - Pending ❌</li>
          </ul>
        );

      case "Profile":
        return <h2>Tenant Profile (Dummy)</h2>;

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar
        items={["My Property", "Payments", "Profile"]}
        onSelect={setActivePage}
      />

      <div style={styles.main}>{renderContent()}</div>
    </div>
  );
};

export default TenantDashboard;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
  },
  main: {
    flex: 1,
    padding: "30px",
    background: "#f1f5f9",
  },
};
