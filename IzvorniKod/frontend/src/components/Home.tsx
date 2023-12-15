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
}

interface HomeProps {
    isLoggedIn: boolean;
    userData: {
        username: string;
    };
}

function Home({ isLoggedIn, userData }: HomeProps) {
    const [originalAdvertisements, setOriginalAdvertisements] = useState<Advertisement[]>([]);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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

    const handleSearch = (searchTerm: string) => {
        setSearchTerm(searchTerm);

        const filteredAdvertisements = originalAdvertisements.filter((advertisement) =>
            advertisement.petName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setAdvertisements(filteredAdvertisements);
    };

    const toggleDeleteMode = () => {
        setDeleteMode(!deleteMode);
    };

    const handleDelete = (deletedAdId: number) => {
        // Update the state to remove the deleted advertisement
        setAdvertisements((prevAds) =>
            prevAds.filter((ad) => ad.adId !== deletedAdId)
        );
    };

    return (
        <Container>
            <Row className="mb-0">
                <Col className="text-dg-end">
                    <div className="d-flex align-items-center">
                        <input
                            type="text"
                            placeholder="Pretražite oglase"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="form-control-lg me-2 my-2"
                        />
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