import React, { useState } from "react";
import { Link } from "react-router-dom";

interface CardProps {
  id: number;
  title: string;
  content: string;
}

const Oglas: React.FC<CardProps> = ({ id, title, content }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    border: `2px solid ${isHovered ? "black" : "#ccc"}`,
    borderRadius: "8px",
    margin: "10px",
    padding: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    transition: "border 0.3s",
  };

  const titleStyle = {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "8px",
  };

  const contentStyle = {
    fontSize: "1rem",
    color: "#555",
  };

  return (
    <Link
      to={`/${id}`}
      style={{ textDecoration: "none", color: "inherit" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card" style={cardStyle}>
        <div className="card-body">
          <h5 className="card-title" style={titleStyle}>
            {title}
          </h5>
          <p className="card-text" style={contentStyle}>
            {content}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Oglas;
