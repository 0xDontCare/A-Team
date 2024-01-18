import {SetStateAction, useState, useRef, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useNavigate} from "react-router-dom";
import {MapContainer, TileLayer, Marker, useMapEvents} from 'react-leaflet';
import {Dropdown} from "react-bootstrap";
import "./AddAdChangeAd.css";
import "leaflet/dist/leaflet.css";

interface HomeProps {
    userData: {
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        shelterName: string;
    } | null;
}

function AddAd({userData}: HomeProps) {
    document.title = "Dodajte oglas";
    const navigate = useNavigate();

    const [adCategory, setAdCategory] = useState("LJUBIMAC_JE_NESTAO_I_ZA_NJIM_SE_TRAGA");
    const [adSpecies, setAdSpecies] = useState("");
    const [adBreed, setAdBreed] = useState("");
    const [adName, setAdName] = useState("");
    const [disappearanceLocationLat, setDisappearanceLocationLat] = useState<number | null>(null);
    const [disappearanceLocationLng, setDisappearanceLocationLng] = useState<number | null>(null);
    const [adDateTime, setAdDateTime] = useState("");
    const [adColor, setAdColor] = useState("");
    const [adAge, setAdAge] = useState("");
    const [adDescription, setAdDescription] = useState("");
    const [adPhoto1, setAdPhoto1] = useState(null);
    const [adPhoto2, setAdPhoto2] = useState(null);
    const [adPhoto3, setAdPhoto3] = useState(null);

    const [ageError, setAgeError] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    const [mapCenter, setMapCenter] = useState<[number, number]>([44.5, 16.0]);
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);

    const handleCategoryChange = (eventKey: string | null) => {
        if (eventKey !== null) {
            let newCategory;

            if (eventKey === 'category1') {
                newCategory = "LJUBIMAC_JE_NESTAO_I_ZA_NJIM_SE_TRAGA";
            } else if (eventKey === 'category2') {
                newCategory = "U_SKLONISTU";
            }

            setAdCategory(newCategory);
        }
    };

    useEffect(() => {
    }, [adCategory]);

    const handleSpeciesChange = (e: { target: { value: SetStateAction<string>; }; }) => setAdSpecies(e.target.value);
    const handleBreedChange = (e: { target: { value: SetStateAction<string>; }; }) => setAdBreed(e.target.value);
    const handleNameChange = (e: { target: { value: SetStateAction<string>; }; }) => setAdName(e.target.value);
    const handleDateTimeChange = (e: { target: { value: SetStateAction<string>; }; }) => setAdDateTime(e.target.value);
    const handleColorChange = (e: { target: { value: SetStateAction<string>; }; }) => setAdColor(e.target.value);
    const handleAgeChange = (e: { target: { value: SetStateAction<string>; }; }) => setAdAge(e.target.value);
    const handleDescriptionChange = (e: {
        target: { value: SetStateAction<string>; };
    }) => setAdDescription(e.target.value);
    const handlePhoto1Change = (e: { target: { files: SetStateAction<null>[]; }; }) => setAdPhoto1(e.target.files[0]);
    const handlePhoto2Change = (e: { target: { files: SetStateAction<null>[]; }; }) => setAdPhoto2(e.target.files[0]);
    const handlePhoto3Change = (e: { target: { files: SetStateAction<null>[]; }; }) => setAdPhoto3(e.target.files[0]);

    const resetFormFields = () => {
        setAdSpecies("");
        setAdBreed("");
        setAdName("");
        setDisappearanceLocationLat(null);
        setDisappearanceLocationLng(null);
        setAdDateTime("");
        setAdColor("");
        setAdAge("");
        setAdDescription("");
        setAdPhoto1(null);
        setAdPhoto2(null);
        setAdPhoto3(null);
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const requiredFields = [
            adSpecies,
            adBreed,
            adName,
            adDateTime,
            adColor,
            adAge,
            adDescription,
        ];

        if (requiredFields.some((field) => field === null || field === "")) {
            setAgeError("");
            setFormError("Niste unijeli podatke u sva zadana polja!");

            if (errorRef.current) {
                errorRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }

            return;
        }

        const ageRegex = /^\d+$/;
        if (!ageRegex.test(adAge)) {
            setFormError("");
            setAgeError("Starost mora sadržavati samo brojeve bez slova!");

            return;
        }

        if (disappearanceLocationLat === null || disappearanceLocationLng === null) {
            setAgeError("");
            setFormError("Odaberite lokaciju nestanka ljubimca na karti!");

            if (errorRef.current) {
                errorRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }

            return;
        }

        if (!adPhoto1 && !adPhoto2 && !adPhoto3) {
            setAgeError("");
            setFormError("Učitajte barem jednu fotografiju!");

            if (errorRef.current) {
                errorRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }

            return;
        }

        try {
            const formData = new FormData();
            formData.append("category", adCategory);
            formData.append("species", adSpecies);
            formData.append("breed", adBreed);
            formData.append("petName", adName);
            formData.append("disappearanceDateTime", adDateTime);
            formData.append("disappearanceLocationLat", disappearanceLocationLat.toString());
            formData.append("disappearanceLocationLng", disappearanceLocationLng.toString());
            formData.append("color", adColor);
            formData.append("age", adAge);
            formData.append("petDescription", adDescription);
            formData.append("images", adPhoto1);
            formData.append("images", adPhoto2);
            formData.append("images", adPhoto3);

            const options = {
                method: "POST",
                body: formData,
            };

            const res = await fetch("/api/advertisements", options);
            if (res.status === 200) {
                alert("Oglas uspješno dodan!");
                resetFormFields();
                navigate("/");
            } else {
                alert("Oglas nije uspješno dodan!");
            }

            setAgeError("");
            setFormError("");
        } catch (err) {
            console.error(err);
            alert("Pogreška pri dodavanju oglasa!");
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    function MapClickHandler() {
        const map = useMapEvents({
            click: (e) => {
                const lat = e.latlng.lat;
                const lng = e.latlng.lng;

                setMarkerPosition([lat, lng]);
                setDisappearanceLocationLat(lat);
                setDisappearanceLocationLng(lng);

                setMapCenter([lat, lng]);
            },
        });

        return markerPosition ? <Marker position={markerPosition}></Marker> : null;
    }

    return (
        <Container>
            <div className="card p-5 mt-4" style={{border: "1px solid #ccc", borderRadius: "5px"}}>
                {formError && (
                    <div ref={errorRef} className="alert alert-danger">
                        {formError}
                    </div>
                )}
                <Form onSubmit={handleSubmit}>
                    {userData?.shelterName !== null && (
                        <Form.Group className="mb-3" controlId="adPetCategory">
                            <Form.Label className="label-addAdBigger">Kategorija oglasa</Form.Label>
                            <Dropdown onSelect={(eventKey) => handleCategoryChange(eventKey)}>
                                <Dropdown.Toggle variant="light" id="dropdown-category">
                                    {adCategory === 'LJUBIMAC_JE_NESTAO_I_ZA_NJIM_SE_TRAGA' && 'Ljubimac je nestao i za njim se traga'}
                                    {adCategory === 'U_SKLONISTU' && 'U skloništu'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="category1">Ljubimac je nestao i za njim se
                                        traga</Dropdown.Item>
                                    <Dropdown.Item eventKey="category2">U skloništu</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3" controlId="adPet">
                        <Form.Label className="label-addAdBigger">Ljubimac</Form.Label>
                        <Form.Control type="text" placeholder="Upišite ljubimca" onChange={handleSpeciesChange}
                                      value={adSpecies}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adSpecies">
                        <Form.Label className="label-addAdBigger">Vrsta ljubimca</Form.Label>
                        <Form.Control type="text" placeholder="Upišite vrstu ljubimca" onChange={handleBreedChange}
                                      value={adBreed}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adName">
                        <Form.Label className="label-addAdBigger">Ime ljubimca</Form.Label>
                        <Form.Control type="text" placeholder="Upišite ime ljubimca" onChange={handleNameChange}
                                      value={adName}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adDateTime">
                        <Form.Label
                            className="label-addAdBigger">{adCategory === "U_SKLONISTU" ? 'Odaberite datum i vrijeme pronalaska ljubimca' : 'Odaberite datum i vrijeme nestanka ljubimca'}</Form.Label>
                        <Form.Control type="datetime-local" onChange={handleDateTimeChange} value={adDateTime}/>
                    </Form.Group>
                    <span
                        className="label-addAdBigger">{adCategory === "U_SKLONISTU" ? 'Lokacija skloništa' : 'Lokacija nestanka ljubimca'}</span>
                    <Form.Group className="mb-3 rounded-border" controlId="adLocation">
                        <div style={{border: '2px solid black', borderRadius: '10px', overflow: 'hidden'}}>
                            <MapContainer center={mapCenter} zoom={7} minZoom={7}>
                                <MapClickHandler/>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            </MapContainer>
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adColor">
                        <Form.Label className="label-addAdBigger">Boja ljubimca</Form.Label>
                        <Form.Control type="text" placeholder="Upišite boju ljubimca" onChange={handleColorChange}
                                      value={adColor}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adAge">
                        <Form.Label className="label-addAdBigger">Starost ljubimca</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite starost ljubimca"
                            onChange={handleAgeChange}
                            value={adAge}
                            isInvalid={ageError !== ""}
                        />
                        <Form.Control.Feedback type="invalid">{ageError}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adDescription">
                        <Form.Label className="label-addAdBigger">Opis ljubimca</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Opišite ljubimca"
                                      onChange={handleDescriptionChange} value={adDescription}/>
                    </Form.Group>
                    <span className="label-addAdBigger">Odaberite slike koje želite dodati(prva slika koju dodate u nizu će biti naslovna slika):</span>
                    <Form.Group className="mb-3" controlId="adPhoto1">
                        <Form.Label className="label-addAdBigger">1. slika ljubimca</Form.Label>
                        <Form.Control type="file" onChange={handlePhoto1Change}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adPhoto2">
                        <Form.Label className="label-addAdBigger">2. slika ljubimca</Form.Label>
                        <Form.Control type="file" onChange={handlePhoto2Change}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adPhoto3">
                        <Form.Label className="label-addAdBigger">3. slika ljubimca</Form.Label>
                        <Form.Control type="file" onChange={handlePhoto3Change}/>
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Dodajte oglas
                    </Button>
                    <Button variant="secondary" className="ms-2" onClick={handleCancel}>
                        Odustanite
                    </Button>
                </Form>
            </div>
        </Container>
    );
}

export default AddAd;