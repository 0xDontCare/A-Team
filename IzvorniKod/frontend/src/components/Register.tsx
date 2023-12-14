import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Register() {
    document.title = "Registracija";
    const [userType, setUserType] = useState("regular");
    const navigate = useNavigate();

    const [ime, setIme] = useState("");
    const [prezime, setPrezime] = useState("");
    const [email, setEmail] = useState("");
    const [brojTelefona, setBrojTelefona] = useState("");
    const [username, setUsername] = useState("");
    const [lozinka, setLozinka] = useState("");
    const [error, setError] = useState("");

    const [imeSklonista, setImeSklonista] = useState("");
    const [emailSklonista, setEmailSklonista] = useState("");
    const [brojTelefonaSklonista, setBrojTelefonaSklonista] = useState("");
    const [usernameSklonista, setUsernameSklonista] = useState("");
    const [lozinkaSklonista, setLozinkaSklonista] = useState("");
    const [errorSklonista, setErrorSklonista] = useState("");

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex =
            /^(?:\+?1[-. ]?)?\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})$/;
        return phoneRegex.test(phoneNumber);
    };

    const saveRegularUser = async (event) => {
        event.preventDefault();

        if (!ime || !prezime || !email || !brojTelefona || !lozinka) {
            setError("Niste upisali podatke u sva zadana polja!");
            return;
        }

        if (!validateEmail(email)) {
            setError("E-pošta nije u dobrom formatu!");
            return;
        }

        if (!validatePhoneNumber(brojTelefona)) {
            setError("Broj telefona mora sadržavati samo 10 brojeva bez slova!");
            return;
        }

        try {
            await axios.post("/api/register", {
                firstName: ime,
                lastName: prezime,
                email: email,
                phoneNumber: brojTelefona,
                username: username,
                password: lozinka,
            });

            alert("Uspješno ste se registrirali!");
            resetFormFields();
            navigate("/");
        } catch (err) {
            alert(err.response.data);
        }
    };

    const saveShelterUser = async (event) => {
        event.preventDefault();

        if (
            !imeSklonista ||
            !emailSklonista ||
            !brojTelefonaSklonista ||
            !lozinkaSklonista
        ) {
            setErrorSklonista("Niste upisali podatke u sva zadana polja!");
            return;
        }

        if (!validateEmail(emailSklonista)) {
            setErrorSklonista("E-pošta nije u dobrom formatu!");
            return;
        }

        if (!validatePhoneNumber(brojTelefonaSklonista)) {
            setErrorSklonista(
                "Broj telefona mora sadržavati samo 10 brojeva bez slova!"
            );
            return;
        }

        try {
            await axios.post("/api/register", {
                shelterName: imeSklonista,
                email: emailSklonista,
                phoneNumber: brojTelefonaSklonista,
                username: usernameSklonista,
                password: lozinkaSklonista,
            });

            alert("Uspješno ste se registrirali kao sklonište!");
            resetFormFields();
            navigate("/");
        } catch (err) {
            alert(err.response.data);
        }
    };

    const resetFormFields = () => {
        setIme("");
        setPrezime("");
        setEmail("");
        setBrojTelefona("");
        setUsername("");
        setLozinka("");
        setError("");

        setImeSklonista("");
        setEmailSklonista("");
        setBrojTelefonaSklonista("");
        setUsernameSklonista("");
        setLozinkaSklonista("");
        setErrorSklonista("");
    };

    return (
        <div>
            <div className="container mt-4">
                <div className="card p-5">
                    {userType === "regular" ? (
                        <div>
                            {error && <div className="alert alert-danger">{error}</div>}
                        </div>
                    ) : (
                        <div>
                            {errorSklonista && (
                                <div className="alert alert-danger">{errorSklonista}</div>
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
                        <div className="form-check form-check-inline">
                            <input
                                type="radio"
                                id="regularniKorisnik"
                                name="userType"
                                value="regular"
                                className="form-check-input"
                                defaultChecked={userType === "regular"}
                                onChange={() => setUserType("regular")}
                            />
                            <label htmlFor="regularniKorisnik" className="form-check-label">
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
                                className="form-check-input"
                                defaultChecked={userType !== "regular"}
                                onChange={() => setUserType("premium")}
                            />
                            <label htmlFor="sklonisteKorisnik" className="form-check-label">
                                Sklonište
                            </label>
                        </div>
                    </div>

                    <br/>

                    {userType === "regular" && (
                        <form>
                            <div className="form-group mb-2">
                                <label>Ime</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="ime"
                                    placeholder="Upišite ime"
                                    value={ime}
                                    onChange={(event) => {
                                        setIme(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label>Prezime</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="prezime"
                                    placeholder="Upišite prezime"
                                    value={prezime}
                                    onChange={(event) => {
                                        setPrezime(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label>E-pošta</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Upišite e-poštu"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label>Broj telefona</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="brojTelefona"
                                    placeholder="Upišite broj telefona"
                                    value={brojTelefona}
                                    onChange={(event) => {
                                        setBrojTelefona(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label>Korisničko ime</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    placeholder="Kreirajte korisničko ime"
                                    value={username}
                                    onChange={(event) => {
                                        setUsername(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label>Lozinka</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="lozinka"
                                    placeholder="Kreirajte lozinku"
                                    value={lozinka}
                                    onChange={(event) => {
                                        setLozinka(event.target.value);
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success mt-4"
                                onClick={saveRegularUser}
                            >
                                Registrirajte se
                            </button>
                        </form>
                    )}

                    {userType === "premium" && (
                        <form>
                            <div className="form-group mb-2">
                                <label>Ime skloništa</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="imeSklonista"
                                    placeholder="Upišite ime skloništa"
                                    value={imeSklonista}
                                    onChange={(event) => {
                                        setImeSklonista(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label>E-pošta</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="emailSklonista"
                                    placeholder="Upišite e-poštu"
                                    value={emailSklonista}
                                    onChange={(event) => {
                                        setEmailSklonista(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label>Broj telefona</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="brojTelefonaSklonista"
                                    placeholder="Upišite broj telefona"
                                    value={brojTelefonaSklonista}
                                    onChange={(event) => {
                                        setBrojTelefonaSklonista(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label>Korisničko ime</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="usernameSklonista"
                                    placeholder="Kreirajte korisničko ime"
                                    value={usernameSklonista}
                                    onChange={(event) => {
                                        setUsernameSklonista(event.target.value);
                                    }}
                                />
                            </div>

                            <div className="form-group mb-2">
                                <label>Lozinka</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="lozinkaSklonista"
                                    placeholder="Kreirajte lozinku"
                                    value={lozinkaSklonista}
                                    onChange={(event) => {
                                        setLozinkaSklonista(event.target.value);
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success mt-4"
                                onClick={saveShelterUser}
                            >
                                Registrirajte se
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;