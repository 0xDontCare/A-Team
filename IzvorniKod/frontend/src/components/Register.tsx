import {useState} from "react";
import axios from "axios";

function Register() {
    const [ime, setIme] = useState("");
    const [prezime, setPrezime] = useState("");
    const [email, setEmail] = useState("");
    const [brojTelefona, setBrojTelefona] = useState("");
    const [username, setUsername] = useState("");
    const [lozinka, setLozinka] = useState("");
    const [error, setError] = useState("");

    const validateEmail = (email) => {
        // Email regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phoneNumber) => {
        // Phone number regex pattern (accepts only numbers)
        const phoneRegex = /^\d+$/;
        return phoneRegex.test(phoneNumber);
    };

    const save = async (event) => {
        event.preventDefault();

        // Validation checks
        if (!ime || !prezime || !email || !brojTelefona || !lozinka) {
            setError("Niste upisali podatke u sva zadana polja!");
            return;
        }

        if (!validateEmail(email)) {
            setError("E-pošta nije u dobrom formatu!");
            return;
        }

        if (!validatePhoneNumber(brojTelefona)) {
            setError("Broj telefona mora sadržavati samo brojeve!");
            return;
        }

        try {
            await axios.post("/api/register", {
                name: ime,
                surname: prezime,
                email: email,
                phoneNumber: brojTelefona,
                username: username,
                password: lozinka
            });

            alert("Uspješno ste se registrirali!");
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div>
            <div className="container mt-4">
                <div className="card p-5">
                    <h1>Registracija</h1>
                    <hr/>

                    {error && <div className="alert alert-danger">{error}</div>}

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
                                type="brojTelefona"
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

                        <button type="submit" className="btn btn-dark mt-4" onClick={save}>
                            Registrirajte se
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;