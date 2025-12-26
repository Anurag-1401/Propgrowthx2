import React from "react";

interface SidebarProps {
  items: string[];
  onSelect: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ items, onSelect }) => {
  return (
    <div style={styles.sidebar}>
      <h3>Menu</h3>
      {items.map((item) => (
        <button key={item} style={styles.button} onClick={() => onSelect(item)}>
          {item}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: "220px",
    padding: "20px",
    background: "#1e293b",
    color: "#fff",
    minHeight: "100vh",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    border: "none",
    borderRadius: "6px",
    background: "#334155",
    color: "#fff",
    cursor: "pointer",
  },
};
