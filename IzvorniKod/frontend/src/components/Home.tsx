import {ChangeEvent, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Ad from "./Ad.tsx";
import "./Home.css";

interface Advertisement {
    adId: number;
    petName: string;
    username: string;
    species: string;
    color: string;
    age: number;
    shelterName: string;
    imageLink: string;
}

interface HomeProps {
    isLoggedIn: boolean;
    userData: {
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        shelterName: string;
    } | null;
}

function Home({isLoggedIn, userData}: HomeProps) {
    document.title = "Nestali ljubimci";

    const [originalAdvertisements, setOriginalAdvertisements] = useState<Advertisement[]>([]);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [changeMode, setChangeMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState("option1");

    const [showCheckboxes1, setShowCheckboxes1] = useState(true);
    const [showCheckboxes2, setShowCheckboxes2] = useState(false);
    const [selectedCheckboxesData1, setSelectedCheckboxesData1] = useState<Array<Advertisement[]>>([]);
    const [selectedCheckboxesData2, setSelectedCheckboxesData2] = useState<Array<Advertisement[]>>([]);
    const [checkboxesCount1, setCheckboxesCount1] = useState(0);
    const [checkboxesCount2, setCheckboxesCount2] = useState(0);

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

            const matchesSearch = String(propertyValue).toLowerCase().includes(searchLower);

            if (!matchesSearch) {
                return false;
            }

            if (showCheckboxes1 && selectedCheckboxesData1.length > 0) {
                return selectedCheckboxesData1.some((checkboxData) => {
                    if (Array.isArray(checkboxData)) {
                        return checkboxData.some((checkboxAd) => checkboxAd.adId === advertisement.adId);
                    }
                    return false;
                });
            }

            if (showCheckboxes2 && selectedCheckboxesData2.length > 0) {
                return selectedCheckboxesData2.some((checkboxData) => {
                    if (Array.isArray(checkboxData)) {
                        return checkboxData.some((checkboxAd) => checkboxAd.adId === advertisement.adId);
                    }
                    return false;
                });
            }

            return true;
        });

        if (showCheckboxes1 && selectedCheckboxesData1.length === 0) {
            // Set the checkbox as checked
            const checkbox = document.getElementById('checkbox4') as HTMLInputElement;
            if (checkbox) {
                checkbox.checked = true;

                // Fetch the corresponding category data
                handleAdTypeChangeCheckbox1({target: {value: checkbox.value, checked: true}}, 4);
            }
        }

        setAdvertisements(filteredAdvertisements);
    }, [searchCategory, originalAdvertisements, searchTerm, showCheckboxes1, showCheckboxes2, selectedCheckboxesData1, selectedCheckboxesData2]);

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

    const handleAdTypeChange = async (e: { target: { value: string; }; }) => {

        setOriginalAdvertisements([]);
        setAdvertisements([]);
        setCheckboxesCount1(0);
        setCheckboxesCount2(0);
        setSelectedCheckboxesData1([]);
        setSelectedCheckboxesData2([]);

        if (e.target.value === 'tipOglas1') {
            setShowCheckboxes1(true);
            setShowCheckboxes2(false);

            if (checkboxesCount1 === 0) {
                setOriginalAdvertisements([]);
                setAdvertisements([]);
            }

        } else if (e.target.value === 'tipOglas2' && isLoggedIn) {
            setShowCheckboxes1(false);
            setShowCheckboxes2(true);

            if (checkboxesCount2 === 0) {
                setOriginalAdvertisements([]);
                setAdvertisements([]);
            }
        } else {
            setShowCheckboxes2(false);
            alert('Morate se registrirati i prijaviti kako biste mogli koristiti ovu kategoriju!');
            window.location.reload();
        }
    };

    const handleAdTypeChangeCheckbox1 = async (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const checkboxValue = e.target.value;
        const isCheckboxChecked = e.target.checked;

        setCheckboxesCount1((prevCount) => (isCheckboxChecked ? prevCount + 1 : prevCount - 1));

        try {
            const data = await fetch(`/api/advertisements?category=${checkboxValue}`).then((response) => response.json());

            setSelectedCheckboxesData1((prevData) => {
                const newData = [...prevData];
                newData[index] = isCheckboxChecked ? data : [];

                const allData = newData.flatMap((checkboxData) => (checkboxData ? [...checkboxData] : []));

                const filteredData = applySearchFilter(allData, searchTerm);

                setOriginalAdvertisements(filteredData);
                setAdvertisements(filteredData);
                return newData;
            });
        } catch (error) {
            console.error(`Error fetching data for checkbox ${checkboxValue}:`, error);
        }
    };

    const handleAdTypeChangeCheckbox2 = async (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const checkboxValue = e.target.value;
        const isCheckboxChecked = e.target.checked;

        setCheckboxesCount2((prevCount) => (isCheckboxChecked ? prevCount + 1 : prevCount - 1));

        try {
            const data = await fetch(`/api/advertisements?category=${checkboxValue}`).then((response) => response.json());

            setSelectedCheckboxesData2((prevData) => {
                const newData = [...prevData];
                newData[index] = isCheckboxChecked ? data : [];

                const allData = newData.flatMap((checkboxData) => (checkboxData ? [...checkboxData] : []));

                const filteredData = applySearchFilter(allData, searchTerm);

                setOriginalAdvertisements(filteredData);
                setAdvertisements(filteredData);
                return newData;
            });
        } catch (error) {
            console.error(`Error fetching data for checkbox ${checkboxValue}:`, error);
        }
    };

    const applySearchFilter = (data, searchTerm) => {
        const category = categoryMapping[searchCategory];
        if (!category) {
            console.error("Invalid search category");
            return data;
        }

        return data.filter((advertisement) => {
            if (searchCategory === "option5" && advertisement.shelterName === null) {
                return false;
            }

            const propertyValue = advertisement[category];
            const searchLower = searchTerm.toLowerCase();

            if (propertyValue === null) {
                return false;
            }

            return String(propertyValue).toLowerCase().includes(searchLower);
        });
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
                        {showCheckboxes1 && (
                            <div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="checkbox4"
                                        value="LJUBIMAC_JE_NESTAO_I_ZA_NJIM_SE_TRAGA"
                                        onChange={(e) => handleAdTypeChangeCheckbox1(e, 4)}
                                    />
                                    <label className="form-check-label" htmlFor="checkbox4">
                                        Nestali ljubimci
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="checkbox5"
                                        value="U_SKLONISTU"
                                        onChange={(e) => handleAdTypeChangeCheckbox1(e, 5)}
                                    />
                                    <label className="form-check-label" htmlFor="checkbox5">
                                        U skloništu
                                    </label>
                                </div>
                            </div>
                        )}
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
                        {showCheckboxes2 && (
                            <div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="checkbox1"
                                        value="LJUBIMAC_JE_SRETNO_PRONAĐEN"
                                        onChange={(e) => handleAdTypeChangeCheckbox2(e, 1)}
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
                                        onChange={(e) => handleAdTypeChangeCheckbox2(e, 2)}
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
                                        onChange={(e) => handleAdTypeChangeCheckbox2(e, 3)}
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
                                    <Link to="/addAd" className="adButton btn me-2">
                                        Dodajte oglas
                                    </Link>
                                    <button className="adButton btn me-2"
                                            onClick={toggleChangeMode}>{changeMode ? "Završite izmjenu" : "Izmijenite oglas"}</button>
                                    <button className="adButton btn me-2" onClick={toggleDeleteMode}>
                                        {deleteMode ? "Završite brisanje" : "Izbrišite oglas"}
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    )}
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {advertisements.map((advertisement) => (
                            <Col key={advertisement.adId}>
                                <Ad
                                    id={advertisement.adId}
                                    title={advertisement.petName}
                                    species={advertisement.species}
                                    color={advertisement.color}
                                    age={advertisement.age}
                                    shelterName={advertisement.shelterName}
                                    loggedInUsername={userData?.username || ""}
                                    username={advertisement.username}
                                    imageLink={advertisement.imageLink}
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