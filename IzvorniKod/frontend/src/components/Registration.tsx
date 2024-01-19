import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "./Registration.css";

function Registration() {
    document.title = "Registracija";

    const navigate = useNavigate();

    const [userType, setUserType] = useState("regular");

    const [userName, setUserName] = useState("");
    const [userSurname, setUserSurname] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhoneNumber, setUserPhoneNumber] = useState("");
    const [userUsername, setUserUsername] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userError, setUserError] = useState("");

    const [shelterName, setShelterName] = useState("");
    const [shelterEmail, setShelterEmail] = useState("");
    const [shelterPhoneNumber, setShelterPhoneNumber] = useState("");
    const [shelterUsername, setShelterUsername] = useState("");
    const [shelterPassword, setShelterPassword] = useState("");
    const [shelterError, setShelterError] = useState("");

    const [showPasswordUser, setShowPasswordUser] = useState(false);
    const [showPasswordShelter, setShowPasswordShelter] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phoneNumber: string) => {
        const phoneRegex =
            /^(?:\+?1[-. ]?)?\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})$/;
        return phoneRegex.test(phoneNumber);
    };

    const saveRegularUser = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if (!userName || !userSurname || !userEmail || !userPhoneNumber || !userPassword) {
            setUserError("Niste upisali podatke u sva zadana polja!");
            return;
        }

        if (!validateEmail(userEmail)) {
            setUserError("E-pošta nije u dobrom formatu!");
            return;
        }

        if (!validatePhoneNumber(userPhoneNumber)) {
            setUserError("Broj telefona mora sadržavati samo 10 brojeva bez slova!");
            return;
        }

        try {
            await axios.post("/api/register", {
                firstName: userName,
                lastName: userSurname,
                email: userEmail,
                phoneNumber: userPhoneNumber,
                username: userUsername,
                password: userPassword,
            });

            alert("Uspješno ste se registrirali!");
            resetFormFields();
            navigate("/");
        } catch (err) {
            alert(err.response.data);
        }
    };

    const saveShelterUser = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if (
            !shelterName ||
            !shelterEmail ||
            !shelterPhoneNumber ||
            !shelterPassword
        ) {
            setShelterError("Niste upisali podatke u sva zadana polja!");
            return;
        }

        if (!validateEmail(shelterEmail)) {
            setShelterError("E-pošta nije u dobrom formatu!");
            return;
        }

        if (!validatePhoneNumber(shelterPhoneNumber)) {
            setShelterError(
                "Broj telefona mora sadržavati samo 10 brojeva bez slova!"
            );
            return;
        }

        try {
            await axios.post("/api/register", {
                shelterName: shelterName,
                email: shelterEmail,
                phoneNumber: shelterPhoneNumber,
                username: shelterUsername,
                password: shelterPassword,
            });

            alert("Uspješno ste se registrirali kao sklonište!");
            resetFormFields();
            navigate("/");
        } catch (err) {
            alert(err.response.data);
        }
    };

    const resetFormFields = () => {
        setUserName("");
        setUserSurname("");
        setUserEmail("");
        setUserPhoneNumber("");
        setUserUsername("");
        setUserPassword("");
        setUserError("");

        setShelterName("");
        setShelterEmail("");
        setShelterPhoneNumber("");
        setShelterUsername("");
        setShelterPassword("");
        setShelterError("");
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div>
            <div className="container mt-4">
                <div className="card p-5">
                    {userType === "regular" ? (
                        <div>
                            {userError && <div className="alert alert-danger">{userError}</div>}
                        </div>
                    ) : (
                        <div>
                            {shelterError && (
                                <div className="alert alert-danger">{shelterError}</div>
                            )}
                        </div>
                    )}

                    <div className="d-flex align-items-center justify-content-start">
                        <h2 style={{marginRight: "20px"}}>
                            Odaberite vrstu registracije:
                        </h2>
                    </div>
                    <br/>
                    <div className="d-flex align-items-center">
                        <div className="form-check form-check-inline" style={{marginLeft: 5}}>
                            <input
                                type="radio"
                                id="regularniKorisnik"
                                name="userType"
                                value="regular"
                                className="form-check-input label-registrationBigger"
                                defaultChecked={userType === "regular"}
                                onChange={() => setUserType("regular")}
                            />
                            <label htmlFor="regularniKorisnik" className="form-check-label label-registrationBigger">
                                Korisnik
                            </label>
                        </div>
                        <div
                            className="form-check form-check-inline"
                            style={{marginLeft: 15}}
                        >
                            <input
                                type="radio"
                                id="sklonisteKorisnik"
                                name="userType"
                                value="premium"
                                className="form-check-input label-registrationBigger"
                                defaultChecked={userType !== "regular"}
                                onChange={() => setUserType("premium")}
                            />
                            <label htmlFor="sklonisteKorisnik" className="form-check-label label-registrationBigger">
                                Sklonište
                            </label>
                        </div>
                    </div>

                    <br/>

                    {userType === "regular" && (
                        <form>
                            <div className="form-group mb-2">
                                <label htmlFor="ime" className="label-registrationBigger">Ime</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="ime"
                                    placeholder="Upišite ime"
                                    value={userName}
                                    onChange={(event) => {
                                        setUserName(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="prezime" className="label-registrationBigger">Prezime</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="prezime"
                                    placeholder="Upišite prezime"
                                    value={userSurname}
                                    onChange={(event) => {
                                        setUserSurname(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="email" className="label-registrationBigger">E-pošta</label>
                                <input
                                    autoComplete="off"
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Upišite e-poštu"
                                    value={userEmail}
                                    onChange={(event) => {
                                        setUserEmail(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="brojTelefona" className="label-registrationBigger">Broj telefona</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="brojTelefona"
                                    placeholder="Upišite broj telefona"
                                    value={userPhoneNumber}
                                    onChange={(event) => {
                                        setUserPhoneNumber(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="username" className="label-registrationBigger">Korisničko ime</label>
                                <input
                                    autoComplete="off"
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    placeholder="Stvorite korisničko ime"
                                    value={userUsername}
                                    onChange={(event) => {
                                        setUserUsername(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="lozinkaKorisnika" className="label-registrationBigger">Lozinka</label>
                                <input
                                    type={showPasswordUser ? "text" : "password"}
                                    className="form-control"
                                    id="lozinkaKorisnika"
                                    placeholder="Stvorite lozinku"
                                    value={userPassword}
                                    onChange={(event) => {
                                        setUserPassword(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-check mt-2">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckUser"
                                       onChange={() => setShowPasswordUser(!showPasswordUser)}/>
                                <label className="form-check-label" htmlFor="flexCheckUser">
                                    Prikažite lozinku
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success mt-4"
                                onClick={saveRegularUser}
                            >
                                Registrirajte se
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary mt-4"
                                style={{marginLeft: '10px'}}
                                onClick={handleCancel}
                            >
                                Odustanite
                            </button>
                        </form>
                    )}

                    {userType === "premium" && (
                        <form>
                            <div className="form-group mb-2">
                                <label htmlFor="imeSklonista" className="label-registrationBigger">Ime skloništa</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="imeSklonista"
                                    placeholder="Upišite ime skloništa"
                                    value={shelterName}
                                    onChange={(event) => {
                                        setShelterName(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="emailSklonista" className="label-registrationBigger">E-pošta</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="emailSklonista"
                                    placeholder="Upišite e-poštu"
                                    value={shelterEmail}
                                    onChange={(event) => {
                                        setShelterEmail(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="brojTelefonaSklonista" className="label-registrationBigger">Broj
                                    telefona</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="brojTelefonaSklonista"
                                    placeholder="Upišite broj telefona"
                                    value={shelterPhoneNumber}
                                    onChange={(event) => {
                                        setShelterPhoneNumber(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="usernameSklonista" className="label-registrationBigger">Korisničko
                                    ime</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="usernameSklonista"
                                    placeholder="Stvorite korisničko ime"
                                    value={shelterUsername}
                                    onChange={(event) => {
                                        setShelterUsername(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="lozinkaSklonista" className="label-registrationBigger">Lozinka</label>
                                <input
                                    type={showPasswordShelter ? "text" : "password"}
                                    className="form-control"
                                    id="lozinkaSklonista"
                                    placeholder="Stvorite lozinku"
                                    value={shelterPassword}
                                    onChange={(event) => {
                                        setShelterPassword(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-check mt-2">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckShelter"
                                       onChange={() => setShowPasswordShelter(!showPasswordShelter)}/>
                                <label className="form-check-label" htmlFor="flexCheckShelter">
                                    Prikažite lozinku
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success mt-4"
                                onClick={saveShelterUser}
                            >
                                Registrirajte se
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary mt-4"
                                style={{marginLeft: '10px'}}
                                onClick={handleCancel}
                            >
                                Odustanite
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Registration;