import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Oglas from "./Oglas.tsx";
import "./Home.css";

interface Advertisement {
    adId: number;
    petName: string;
    username: string;
    species: string;
    color: string;
    age: number;
    shelterName: string;
}

interface HomeProps {
    isLoggedIn: boolean;
    userData: {
        username: string;
    };
}

function Home({isLoggedIn, userData}: HomeProps) {
    const [originalAdvertisements, setOriginalAdvertisements] = useState<Advertisement[]>([]);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("option1");

    document.title = "Nestali ljubimci";

    useEffect(() => {
        fetch("/api/advertisements")
            .then((response) => response.json())
            .then((data) => {
                setOriginalAdvertisements(data);
                setAdvertisements(data);
            })
            .catch((error) => {
                console.error("Error fetching advertisement data:", error);
            });
    }, []);

    const categoryMapping: Record<string, keyof Advertisement> = {
        option1: "petName",
        option2: "species",
        option3: "color",
        option4: "age",
        option5: "shelterName",
    };

    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);
    };

    useEffect(() => {
        const category = categoryMapping[searchCategory];
        if (!category) {
            console.error("Invalid search category");
            return;
        }

        const filteredAdvertisements = originalAdvertisements.filter((advertisement) => {
            if (searchCategory === 'option5' && advertisement.shelterName === null) {
                return false;
            }

            const propertyValue = advertisement[category];
            const searchLower = searchTerm.toLowerCase();

            if (propertyValue === null) {
                return false;
            }

            return String(propertyValue).toLowerCase().includes(searchLower);
        });

        setAdvertisements(filteredAdvertisements);
    }, [searchCategory, originalAdvertisements, searchTerm]);


    const toggleDeleteMode = () => {
        setDeleteMode(!deleteMode);
    };

    const handleDelete = (deletedAdId: number) => {
        setAdvertisements((prevAds) =>
            prevAds.filter((ad) => ad.adId !== deletedAdId)
        );
    };

    return (
        <Container>
            <Row className="mb-3">
                <Col className="text-dg-end d-flex align-items-center">
                    <div className="me-2 mt-3">
                        <input
                            type="text"
                            placeholder="Pretražite oglase"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="form-control-lg my-2"
                        />
                    </div>
                    <div className="container-fluid no-right-margin">
                        <div className="row">
                            <div className="col-12">
                                <div
                                    className="btnContainer mt-3 p-3 rounded border border-dark border-2 d-flex justify-content-between">
                                    {['option1', 'option2', 'option3', 'option4', 'option5'].map((option) => (
                                        <div className="form-check form-check-inline" key={option}>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="exampleRadios"
                                                id={`exampleRadio${option}`}
                                                value={option}
                                                checked={searchCategory === option}
                                                onChange={() => setSearchCategory(option)}
                                            />
                                            <label className="form-check-label" htmlFor={`exampleRadio${option}`}>
                                                {option === 'option1' ? 'Naziv ljubimca' :
                                                    option === 'option2' ? 'Vrsta' :
                                                        option === 'option3' ? 'Boja' :
                                                            option === 'option4' ? 'Starost' :
                                                                option === 'option5' ? 'Naziv skloništa' : ''}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            {isLoggedIn && (
                <Row className="mb-3">
                    <Col className="text-center">
                        <div className="btnContainer mt-3 p-3 rounded border border-dark border-2">
                            <Link to="/addAd" className="oglasBtn btn me-2">
                                Dodajte oglas
                            </Link>
                            <button className="oglasBtn btn me-2">Izmijenite oglas</button>
                            <button className="oglasBtn btn me-2" onClick={toggleDeleteMode}>
                                {deleteMode ? "Završite brisanje" : "Izbrišite oglas"}
                            </button>
                        </div>
                    </Col>
                </Row>
            )}
            <Row xs={1} md={2} lg={4} className="g-4">
                {advertisements.map((advertisement) => (
                    <Col key={advertisement.adId}>
                        <Oglas
                            id={advertisement.adId}
                            title={advertisement.petName}
                            loggedInUsername={userData?.username || ""}
                            username={advertisement.username}
                            showDeleteButton={deleteMode}
                            onDelete={handleDelete}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Home;