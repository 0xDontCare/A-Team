import {SetStateAction, useState, useRef} from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useNavigate} from "react-router-dom";
import {MapContainer, TileLayer, Marker, useMapEvents} from 'react-leaflet';
import "./AddAdChangeAd.css";
import "leaflet/dist/leaflet.css";

function AddAd() {
    document.title = "Dodajte oglas";
    const navigate = useNavigate();

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
                    <Form.Group className="mb-3" controlId="adPet">
                        <Form.Label>Ljubimac</Form.Label>
                        <Form.Control type="text" placeholder="Upišite ljubimca" onChange={handleSpeciesChange}
                                      value={adSpecies}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adSpecies">
                        <Form.Label>Vrsta ljubimca</Form.Label>
                        <Form.Control type="text" placeholder="Upišite vrstu ljubimca" onChange={handleBreedChange}
                                      value={adBreed}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adName">
                        <Form.Label>Ime ljubimca</Form.Label>
                        <Form.Control type="text" placeholder="Upišite ime ljubimca" onChange={handleNameChange}
                                      value={adName}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adDateTime">
                        <Form.Label>Odaberite datum i vrijeme nestanka ljubimca</Form.Label>
                        <Form.Control type="datetime-local" onChange={handleDateTimeChange} value={adDateTime}/>
                    </Form.Group>
                    Lokacija nestanka ljubimca
                    <Form.Group className="mb-3" controlId="adLocation">
                        <MapContainer center={mapCenter} zoom={7} minZoom={7}>
                            <MapClickHandler/>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </MapContainer>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adColor">
                        <Form.Label>Boja ljubimca</Form.Label>
                        <Form.Control type="text" placeholder="Upišite boju ljubimca" onChange={handleColorChange}
                                      value={adColor}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adAge">
                        <Form.Label>Starost ljubimca</Form.Label>
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
                        <Form.Label>Opis ljubimca</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Opišite ljubimca"
                                      onChange={handleDescriptionChange} value={adDescription}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adPhoto1">
                        <Form.Label>1. slika ljubimca</Form.Label>
                        <Form.Control type="file" onChange={handlePhoto1Change}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adPhoto2">
                        <Form.Label>2. slika ljubimca</Form.Label>
                        <Form.Control type="file" onChange={handlePhoto2Change}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adPhoto3">
                        <Form.Label>3. slika ljubimca</Form.Label>
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