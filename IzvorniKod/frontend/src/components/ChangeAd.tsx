import {SetStateAction, useState, useRef, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useNavigate, useParams} from "react-router-dom";
import "./AddAdChangeAd.css";
import "leaflet/dist/leaflet.css";
import {MapContainer, Marker, TileLayer, useMapEvents} from "react-leaflet";

function ChangeAd() {
    document.title = 'Izmijenite oglas';
    const navigate = useNavigate();
    const {id} = useParams();

    const [changeSpecies, setChangeSpecies] = useState("");
    const [changeBreed, setChangeBreed] = useState("");
    const [changeName, setChangeName] = useState("");
    const [changeDisappearanceLocationLat, setChangeDisappearanceLocationLat] = useState<number | null>(null);
    const [changeDisappearanceLocationLng, setChangeDisappearanceLocationLng] = useState<number | null>(null);
    const [changeDateTime, setChangeDateTime] = useState("");
    const [changeColor, setChangeColor] = useState("");
    const [changeAge, setChangeAge] = useState("");
    const [changeDescription, setChangeDescription] = useState("");
    const [changePhoto1, setChangePhoto1] = useState(null);
    const [changePhoto2, setChangePhoto2] = useState(null);
    const [changePhoto3, setChangePhoto3] = useState(null);

    const [selectedImages, setSelectedImages] = useState([]);
    const [card, setCard] = useState(null);
    const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

    const [ageError, setAgeError] = useState("");
    const [formError, setFormError] = useState("");
    const errorRef = useRef<HTMLDivElement | null>(null);

    const [mapCenter, setMapCenter] = useState<[number, number]>([44.5, 16.0]);
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);

    const handleSpeciesChange = (e: {
        target: { value: SetStateAction<string>; };
    }) => setChangeSpecies(e.target.value);
    const handleBreedChange = (e: {
        target: { value: SetStateAction<string>; };
    }) => setChangeBreed(e.target.value);
    const handleNameChange = (e: { target: { value: SetStateAction<string>; }; }) => setChangeName(e.target.value);
    const handleDateTimeChange = (e: {
        target: { value: SetStateAction<string>; };
    }) => setChangeDateTime(e.target.value);
    const handleColorChange = (e: { target: { value: SetStateAction<string>; }; }) => setChangeColor(e.target.value);
    const handleAgeChange = (e: { target: { value: SetStateAction<string>; }; }) => setChangeAge(e.target.value);
    const handleDescriptionChange = (e: {
        target: { value: SetStateAction<string>; };
    }) => setChangeDescription(e.target.value);
    const handlePhoto1Change = (e: {
        target: { files: SetStateAction<null>[]; };
    }) => setChangePhoto1(e.target.files[0]);
    const handlePhoto2Change = (e: {
        target: { files: SetStateAction<null>[]; };
    }) => setChangePhoto2(e.target.files[0]);
    const handlePhoto3Change = (e: {
        target: { files: SetStateAction<null>[]; };
    }) => setChangePhoto3(e.target.files[0]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/advertisements/${id}`);
                const data = await response.json();

                setCard(data);

                setChangeSpecies(data.species);
                setChangeBreed(data.breed);
                setChangeName(data.petName);
                setChangeDisappearanceLocationLat(data.disappearanceLocationLat);
                setChangeDisappearanceLocationLng(data.disappearanceLocationLng);
                setChangeDateTime(data.disappearanceDateTime);
                setChangeColor(data.color);
                setChangeAge(data.age);
                setChangeDescription(data.petDescription);

            } catch (error) {
                console.error("Error fetching advertisement data:", error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (card && card.disappearanceLocationLat && card.disappearanceLocationLng) {
            const lat = parseFloat(card.disappearanceLocationLat);
            const lng = parseFloat(card.disappearanceLocationLng);
            setMarkerPosition([lat, lng]);
            setMapCenter([lat, lng]);
        }
    }, [card]);

    const handleImageCheckboxChange = (e) => {
        const imageName = e.target.name;

        setImagesToDelete((prevImagesToDelete) => {
            if (prevImagesToDelete.includes(imageName)) {
                return prevImagesToDelete.filter((img) => img !== imageName);
            } else {
                setSelectedImages((prevSelectedImages) =>
                    prevSelectedImages.filter((img) => img !== imageName)
                );
                return [...prevImagesToDelete, imageName];
            }
        });
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        const requiredFields = [
            changeSpecies,
            changeBreed,
            changeName,
            changeDateTime,
            changeColor,
            changeAge,
            changeDescription,
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
        if (!ageRegex.test(changeAge)) {
            setFormError("");
            setAgeError("Starost mora sadržavati samo brojeve bez slova!");

            return;
        }

        if (changeDisappearanceLocationLat === null || changeDisappearanceLocationLng === null) {
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

        const totalImagesAfterChanges = (card?.images?.length || 0) + selectedImages.length - imagesToDelete.length;
        const newImagesCount = [changePhoto1, changePhoto2, changePhoto3].filter(photo => photo !== null).length;
        const totalImages = totalImagesAfterChanges + newImagesCount;

        if (totalImages < 1 || totalImages > 3) {
            setAgeError("");
            setFormError("Morate imati barem jednu i najviše tri slike.");

            if (errorRef.current) {
                errorRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }

            return;
        }

        try {
            const formData = new FormData();
            formData.append("species", changeSpecies);
            formData.append("breed", changeBreed);
            formData.append("petName", changeName);
            formData.append("disappearanceDateTime", changeDateTime);
            formData.append("disappearanceLocationLat", changeDisappearanceLocationLat.toString());
            formData.append("disappearanceLocationLng", changeDisappearanceLocationLng.toString());
            formData.append("color", changeColor);
            formData.append("age", changeAge);
            formData.append("petDescription", changeDescription);

            [...selectedImages, changePhoto1, changePhoto2, changePhoto3]
                .filter((photo) => photo !== null)
                .forEach((photo, index) => {
                    formData.append(`images[${index}]`, photo);
                });

            imagesToDelete.forEach((imageName, index) => {
                formData.append(`imagesToDelete[${index}]`, imageName);
            });

            const options = {
                method: "PUT",
                body: formData,
            };

            const res = await fetch(`/api/advertisements/${id}`, options);

            if (res.status === 200) {
                alert("Oglas uspješno promijenjen!");
                navigate('/');
            } else {
                alert("Oglas nije uspješno promijenjen!");
            }

            setAgeError("");
            setFormError("");
        } catch (err) {
            console.error(err);
            alert("Pogreška pri izmjeni oglasa!");
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
                setChangeDisappearanceLocationLat(lat);
                setChangeDisappearanceLocationLng(lng);

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
                                      value={changeSpecies}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adSpecies">
                        <Form.Label>Vrsta ljubimca</Form.Label>
                        <Form.Control type="text" placeholder="Upišite vrstu ljubimca" onChange={handleBreedChange}
                                      value={changeBreed}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adName">
                        <Form.Label>Ime ljubimca</Form.Label>
                        <Form.Control type="text" placeholder="Upišite ime ljubimca" onChange={handleNameChange}
                                      value={changeName}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adDateTime">
                        <Form.Label>Odaberite datum i vrijeme nestanka ljubimca</Form.Label>
                        <Form.Control type="datetime-local" onChange={handleDateTimeChange} value={changeDateTime}/>
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
                                      value={changeColor}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adAge">
                        <Form.Label>Starost ljubimca</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Upišite starost ljubimca"
                            onChange={handleAgeChange}
                            value={changeAge}
                            isInvalid={ageError !== ""}
                        />
                        <Form.Control.Feedback type="invalid">{ageError}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adDescription">
                        <Form.Label>Opis ljubimca</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Opišite ljubimca"
                                      onChange={handleDescriptionChange} value={changeDescription}/>
                    </Form.Group>
                    Odaberite slike koje želite izbrisati:
                    <Form.Group className="mb-3" controlId="imageCheckboxes">
                        {card && card.images && (
                            <div className="row">
                                {card.images.map((image, index) => (
                                    <div key={index} className="col-md-4 mb-3">
                                        <div className="custom-control custom-checkbox image-checkbox">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id={`image${index + 1}`}
                                                name={`${image}`}
                                                onChange={handleImageCheckboxChange}
                                            />
                                            <div
                                                className="img-container"
                                                style={{
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    paddingBottom: '100%',
                                                }}
                                            >
                                                <img
                                                    src={`/api/images/${image}`}
                                                    alt={`Image ${index + 1}`}
                                                    className="img-fluid"
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Form.Group>
                    Odaberite slike koje želite dodati:
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
                        Pohranite promjene
                    </Button>
                    <Button variant="secondary" className="ms-2" onClick={handleCancel}>
                        Odustanite
                    </Button>
                </Form>
            </div>
        </Container>
    );
}

export default ChangeAd;