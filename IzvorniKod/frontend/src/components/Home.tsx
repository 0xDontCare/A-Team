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
    const [changeMode, setChangeMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("option1");

    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);

    document.title = "Nestali ljubimci";

    useEffect(() => {
        fetch("/api/advertisements?category=LJUBIMAC_JE_NESTAO_I_ZA_NJIM_SE_TRAGA")
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

    const toggleChangeMode = () => {
        setChangeMode(!changeMode);
    };

    const handleDelete = (deletedAdId: number) => {
        setAdvertisements((prevAds) =>
            prevAds.filter((ad) => ad.adId !== deletedAdId)
        );
    };

    const handleChange = (changeAdId: number) => {
        setAdvertisements((prevAds) =>
            prevAds.filter((ad) => ad.adId !== changeAdId)
        );
    };

    const handleAdTypeChange = async (e) => {
        if (e.target.value === 'tipOglas1') {
            setShowCheckboxes(false);
            try {
                setOriginalAdvertisements([]);
                setAdvertisements([]);
                const response = await fetch("/api/advertisements?category=LJUBIMAC_JE_NESTAO_I_ZA_NJIM_SE_TRAGA");
                const data = await response.json();
                setOriginalAdvertisements(data);
                setAdvertisements(data);
            } catch (error) {
                console.error("Error fetching advertisement data:", error);
            }
        } else if (e.target.value === 'tipOglas2' && isLoggedIn) {
            setShowCheckboxes(false);

            const allCheckboxValues = [
                "LJUBIMAC_JE_SRETNO_PRONAĐEN",
                "LJUBIMAC_NIJE_PRONAĐEN_I_ZA_NJIM_SE_VIŠE_AKTIVNO_NE_TRAGA",
                "LJUBIMAC_JE_PRONAĐEN_U_NESRETNIM_OKOLNOSTIMA",
            ];

            setSelectedCheckboxes(allCheckboxValues);

            try {
                const data1 = await fetch("/api/advertisements?category=LJUBIMAC_JE_SRETNO_PRONAĐEN").then(response => response.json());
                const data2 = await fetch("/api/advertisements?category=LJUBIMAC_NIJE_PRONAĐEN_I_ZA_NJIM_SE_VIŠE_AKTIVNO_NE_TRAGA").then(response => response.json());
                const data3 = await fetch("/api/advertisements?category=LJUBIMAC_JE_PRONAĐEN_U_NESRETNIM_OKOLNOSTIMA").then(response => response.json());

                const allData = [...data1, ...data2, ...data3];

                setOriginalAdvertisements(allData);
                setAdvertisements(allData);
            } catch (error) {
                console.error("Error fetching advertisement data:", error);
            }
        } else {
            setShowCheckboxes(false);
            alert('Morate se registrirati i prijaviti kako biste mogli koristiti ovu kategoriju!');
            window.location.reload();
        }
    };


    return (
        <Container>
            <Row>
                <Col xs={12} md={2}>
                    <div
                        className="btnContainer mt-3 p-4 rounded border border-dark border-2 d-flex flex-column align-items-start">
                        <h2 className="mb-3 fs-5 fs-md-3">Odaberite tip oglasa:</h2>
                        <div className="form-check mb-3 fs-md-3">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="adType"
                                id="adType1"
                                value="tipOglas1"
                                defaultChecked
                                onChange={handleAdTypeChange}
                            />
                            <label className="form-check-label" htmlFor="adType1">
                                Aktivni oglasi
                            </label>
                        </div>
                        <div className="form-check mb-3 fs-md-3">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="adType"
                                id="adType2"
                                value="tipOglas2"
                                onChange={handleAdTypeChange}
                            />
                            <label className="form-check-label" htmlFor="adType2">
                                Neaktivni oglasi
                            </label>
                        </div>
                        {showCheckboxes && (
                            <div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="checkbox1"
                                        value="LJUBIMAC_JE_SRETNO_PRONAĐEN"
                                        defaultChecked
                                        onChange={handleAdTypeChange}
                                    />
                                    <label className="form-check-label" htmlFor="checkbox1">
                                        Ljubimac je sretno pronađen
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="checkbox2"
                                        value="LJUBIMAC_NIJE_PRONAĐEN_I_ZA_NJIM_SE_VIŠE_AKTIVNO_NE_TRAGA"
                                        defaultChecked
                                        onChange={handleAdTypeChange}
                                    />
                                    <label className="form-check-label" htmlFor="checkbox2">
                                        Ljubimac nije pronađen, ali se za njim više aktivno ne traga
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="checkbox3"
                                        value="LJUBIMAC_JE_PRONAĐEN_U_NESRETNIM_OKOLNOSTIMA"
                                        defaultChecked
                                        onChange={handleAdTypeChange}
                                    />
                                    <label className="form-check-label" htmlFor="checkbox3">
                                        Ljubimac je pronađen uz nesretne okolnosti
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </Col>
                <Col xs={12} md={10}>
                    <Row className="mb-3">
                        <Col className="text-dg-end d-flex align-items-center">
                            <div className="me-2 mt-3">
                                <input
                                    type="text"
                                    placeholder="Pretražite oglase"
                                    id="searchBarByCategories"
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="form-control-lg my-2"
                                />
                            </div>
                            <div className="container-fluid no-right-margin">
                                <div className="row">
                                    <div className="col-12">
                                        <div
                                            className="btnContainer mt-3 p-3 rounded border border-dark border-2 d-flex flex-column flex-md-row justify-content-between">
                                            {['option1', 'option2', 'option3', 'option4', 'option5'].map((option) => (
                                                <div className="form-check form-check-inline mb-2" key={option}>
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="exampleRadios"
                                                        id={`exampleRadio${option}`}
                                                        value={option}
                                                        checked={searchCategory === option}
                                                        onChange={() => setSearchCategory(option)}
                                                    />
                                                    <label className="form-check-label"
                                                           htmlFor={`exampleRadio${option}`}>
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
                                    <button className="oglasBtn btn me-2"
                                            onClick={toggleChangeMode}>{changeMode ? "Završite izmjenu" : "Izmijenite oglas"}</button>
                                    <button className="oglasBtn btn me-2" onClick={toggleDeleteMode}>
                                        {deleteMode ? "Završite brisanje" : "Izbrišite oglas"}
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    )}
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {advertisements.map((advertisement) => (
                            <Col key={advertisement.adId}>
                                <Oglas
                                    id={advertisement.adId}
                                    title={advertisement.petName}
                                    species={advertisement.species}
                                    color={advertisement.color}
                                    age={advertisement.age}
                                    shelterName={advertisement.shelterName}
                                    loggedInUsername={userData?.username || ""}
                                    username={advertisement.username}
                                    showDeleteButton={deleteMode}
                                    onDelete={handleDelete}
                                    showChangeButton={changeMode}
                                    onChange={handleChange}
                                />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;