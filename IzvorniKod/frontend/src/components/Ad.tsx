import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./Ad.css";

interface CardProps {
    id: number;
    title: string;
    species: string;
    color: string;
    age: number;
    shelterName: string | null;
    loggedInUsername: string;
    username: string;
    imageLink: string;
    showDeleteButton: boolean;
    onDelete: (id: number) => void;
    showChangeButton: boolean;
    onChange: (id: number) => void;
}

const Ad: React.FC<CardProps> = ({
                                     id,
                                     title,
                                     species,
                                     color,
                                     age,
                                     shelterName,
                                     loggedInUsername,
                                     username,
                                     showDeleteButton,
                                     imageLink,
                                     onDelete,
                                     showChangeButton
                                 }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isChanging] = useState(false);
    const [isCardFlipped, setIsCardFlipped] = useState(false);

    const navigate = useNavigate();

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
                onDelete(id);
            } else {
                console.error("Failed to delete advertisement");
            }
        } catch (error) {
            console.error("Error deleting advertisement:", error);
        }
    };

    const handleChangeClick = () => {
        navigate(`/changeAd/${id}`);
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsCardFlipped(!isCardFlipped);
    };

    return (
        <div>
            <Link to={`/${id}`}>
                <div className={`card cardContainer ${isCardFlipped ? "flipped" : ""}`}>
                    <div className="card-body cardBody">
                        {!isCardFlipped && (
                            <div className="flip-card-front">
                                <h5 className="card-title cardTitle">{title}</h5>
                                <img
                                    src={`/api/images/${imageLink}`}
                                    alt={`Ad ${id}`}
                                    className="card-img-top border border-dark border-2 rounded"
                                    style={{
                                        width: '100%',
                                        height: '225px',
                                        marginTop: '20px'
                                    }}
                                />
                            </div>
                        )}
                        {isCardFlipped && (
                            <div className="flip-card-back">
                                <p className="card-text cardText">Vrsta : <span className="textDetails">{species}</span>
                                </p>
                                <p className="card-text cardText">Boja : <span className="textDetails">{color}</span>
                                </p>
                                <p className="card-text cardText">Starost : <span className="textDetails">{age}</span>
                                </p>
                                {shelterName !== null ? (
                                    <p className="card-text cardText additional-info">
                                        Ime skloništa : <span className="textDetails">{shelterName}</span>
                                    </p>
                                ) : (
                                    <p className="card-text cardText additional-info">
                                        Korisničko ime : <span className="textDetails">{loggedInUsername}</span>
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    <button
                        className="btn btn-success mt-3"
                        style={{marginLeft: "15px", marginRight: "15px"}}
                        onClick={handleButtonClick}
                    >
                        {isCardFlipped ? "Povratak" : "Detalji"}
                    </button>

                </div>
            </Link>
            {showDeleteButton && loggedInUsername === username && (
                <div className="d-grid w-50 mx-auto mt-2">
                    <button
                        className="btn btn-danger"
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Završite brisanje" : "Izbrišite oglas"}
                    </button>
                </div>
            )}
            {showChangeButton && loggedInUsername === username && (
                <div className="d-grid w-50 mx-auto mt-2">
                    <button
                        className="btn btn-primary"
                        onClick={handleChangeClick}
                        disabled={isChanging}
                    >
                        {isChanging ? "Završite izmjenu" : "Izmijenite oglas"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Ad;