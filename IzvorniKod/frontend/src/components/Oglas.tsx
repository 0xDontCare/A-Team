import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Oglas.css";

interface CardProps {
    id: number;
    title: string;
    loggedInUsername: string;
    username: string;
    showDeleteButton: boolean;
    onDelete: (id: number) => void;
}

const Oglas: React.FC<CardProps> = ({
                                        id,
                                        title,
                                        loggedInUsername,
                                        username,
                                        showDeleteButton,
                                        onDelete,
                                    }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = async () => {
        try {
            const response = await fetch(`/api/advertisements/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setIsDeleting(true);
                onDelete(id); // Call the onDelete callback to update the state locally
            } else {
                console.error("Failed to delete advertisement");
            }
        } catch (error) {
            console.error("Error deleting advertisement:", error);
        }
    };

    return (
        <div>
            <Link to={`/${id}`}>
                <div className={`card cardContainer`}>
                    <div className="card-body cardBody">
                        <h5 className="card-title cardTitle">Oglas {id}</h5>
                        <p className="card-text cardText">{title}</p>
                    </div>
                </div>
            </Link>
            {showDeleteButton && loggedInUsername === username && (
                <div className="d-grid w-50 mx-auto mt-2">
                    <button
                        className="btn btn-danger"
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Brisanje..." : "Izbrišite oglas"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Oglas;
