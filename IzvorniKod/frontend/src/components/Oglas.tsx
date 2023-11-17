import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Oglas.css";

interface CardProps {
  id: number;
  title: string;
  content: string;
}

const Oglas: React.FC<CardProps> = ({ id, title }) => {
  return (
    <Link to={`/${id}`}>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Oglas {id}</h5>
          <p className="card-text">{title}</p>
        </div>
      </div>
    </Link>
  );
};

export default Oglas;
