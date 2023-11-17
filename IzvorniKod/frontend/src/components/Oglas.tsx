import React, {useState} from "react";
import {Link} from "react-router-dom";
import "./Oglas.css";

interface CardProps {
    id: number;
    title: string;
    content: string;
}

const Oglas: React.FC<CardProps> = ({id, title}) => {
    return (
        <Link to={`/${id}`}>
            <div className="card cardContainer">
                <div className="card-body cardBody">
                    <h5 className="card-title cardTitle">Oglas {id}</h5>
                    <p className="card-text cardText">{title}</p>
                </div>
            </div>
        </Link>
    );
};

export default Oglas;