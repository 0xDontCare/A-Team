import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Oglas.css";

interface CardProps {
    id: number;
    title: string;
    content: string;
    username: string;
    loggedInUsername: string;
    showDeleteButton: boolean;
}

const Oglas: React.FC<CardProps> = ({ id, title , showDeleteButton }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = () => {
        // Handle delete logic here
        setIsDeleting(!isDeleting);
    };

    return (
        <div>
            <Link to={`/${id}`}>
                <div className={`card cardContainer ${isDeleting ? "deleting" : ""}`}>
                    <div className="card-body cardBody">
                        <h5 className="card-title cardTitle">Oglas {id}</h5>
                        <p className="card-text cardText">{title}</p>
                    </div>
                </div>
            </Link>
            {showDeleteButton && (
                <div className="d-grid w-80 mx-auto mt-2">
                    <button
                        className="btn btn-danger"
                        onClick={handleDeleteClick}
                    >
                        Izbrišite oglas
                    </button>
                </div>
            )}
        </div>
    );
};

export default Oglas;