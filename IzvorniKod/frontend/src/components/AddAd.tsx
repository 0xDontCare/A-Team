import {SetStateAction, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useNavigate} from "react-router-dom";

function AddAd() {
    document.title = "Dodajte oglas";
    const navigate = useNavigate();

    const [adPet, setAdPet] = useState("");
    const [adSpecies, setAdSpecies] = useState("");
    const [adName, setAdName] = useState("");
    const [adLocation, setAdLocation] = useState("");
    const [adDateTime, setAdDateTime] = useState("");
    const [adColor, setAdColor] = useState("");
    const [adAge, setAdAge] = useState("");
    const [adDescription, setAdDescription] = useState("");
    const [adPhoto1, setAdPhoto1] = useState(null);
    const [adPhoto2, setAdPhoto2] = useState(null);
    const [adPhoto3, setAdPhoto3] = useState(null);

    const handlePetChange = (e: { target: { value: SetStateAction<string>; }; }) => setAdPet(e.target.value);
    const handleSpeciesChange = (e: { target: { value: SetStateAction<string>; }; }) => setAdSpecies(e.target.value);
    const handleNameChange = (e: { target: { value: SetStateAction<string>; }; }) => setAdName(e.target.value);
    const handleLocationChange = (e: { target: { value: SetStateAction<string>; }; }) => setAdLocation(e.target.value);
    const handleDateTimeChange = (e: { target: { value: SetStateAction<string>; }; }) => setAdDateTime(e.target.value);
    const handleColorChange = (e: { target: { value: SetStateAction<string>; }; }) => setAdColor(e.target.value);
    const handleAgeChange = (e: { target: { value: SetStateAction<string>; }; }) => setAdAge(e.target.value);
    const handleDescriptionChange = (e: { target: { value: SetStateAction<string>; }; }) => setAdDescription(e.target.value);
    const handlePhoto1Change = (e: { target: { files: SetStateAction<null>[]; }; }) => setAdPhoto1(e.target.files[0]);
    const handlePhoto2Change = (e: { target: { files: SetStateAction<null>[]; }; }) => setAdPhoto2(e.target.files[0]);
    const handlePhoto3Change = (e: { target: { files: SetStateAction<null>[]; }; }) => setAdPhoto3(e.target.files[0]);

    const resetFormFields = () => {
        setAdPet("");
        setAdSpecies("");
        setAdName("");
        setAdLocation("");
        setAdDateTime("");
        setAdColor("");
        setAdAge("");
        setAdDescription("");
        setAdPhoto1(null);
        setAdPhoto2(null);
        setAdPhoto3(null);
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("species", adSpecies);
            formData.append("petName", adName);
            formData.append("disappearanceDateTime", adDateTime);
            formData.append("disappearanceLocation", adLocation);
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

            const res = await fetch("/api/advertisements", options)
            if (res.status === 200) {
                alert("Oglas uspješno dodan!");
                resetFormFields();
                navigate('/');
            } else {
                alert("Oglas nije uspješno dodan!");
            }
        } catch (err) {
            console.error(err);
            alert("Error while adding ad!");
        }
    };

    return (
        <Container>
            <div className="card p-5 mt-4" style={{border: "1px solid #ccc", borderRadius: "5px"}}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="adPet">
                        <Form.Label>Ljubimac</Form.Label>
                        <Form.Control type="text" placeholder="Upišite ljubimca" onChange={handlePetChange}
                                      value={adPet}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adSpecies">
                        <Form.Label>Vrsta ljubimca</Form.Label>
                        <Form.Control type="text" placeholder="Upišite vrstu ljubimca" onChange={handleSpeciesChange}
                                      value={adSpecies}/>
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
                    <Form.Group className="mb-3" controlId="adLocation">
                        <Form.Label>Lokacija nestanka ljubimca</Form.Label>
                        <Form.Control type="text" placeholder="Upišite lokaciju nestanka ljubimca"
                                      onChange={handleLocationChange}
                                      value={adLocation}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adColor">
                        <Form.Label>Boja ljubimca</Form.Label>
                        <Form.Control type="text" placeholder="Upišite boju ljubimca" onChange={handleColorChange}
                                      value={adColor}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="adAge">
                        <Form.Label>Starost ljubimca</Form.Label>
                        <Form.Control type="text" placeholder="Upišite starost ljubimca" onChange={handleAgeChange}
                                      value={adAge}/>
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
                </Form>
            </div>
        </Container>
    );
}

export default AddAd;