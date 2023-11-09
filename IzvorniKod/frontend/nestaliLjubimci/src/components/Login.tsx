import {useState} from "react";
import {useNavigate} from 'react-router-dom';
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [lozinka, setLozinka] = useState("");
    const navigate = useNavigate();

    async function login(event) {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/", {
                email: email,
                lozinka: lozinka,
            });

            if (response.data.message === "Email not exists") {
                alert("E-pošta ne postoji!");
            } else if (response.data.message === "Login Success") {
                navigate('/home');
            } else {
                alert("Kriva e-pošta ili lozinka!");
            }
        } catch (err) {
            console.error(err);
            alert("Pogreška prilikom prijave!");
        }
    }

    return (
        <div>
            <div className="container mt-4">
                <div className="card p-5">
                    <h1>Prijava</h1>
                    <hr/>

                    <form>
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
                            <label>Lozinka</label>
                            <input
                                type="password"
                                className="form-control"
                                id="lozinka"
                                placeholder="Upišite lozinku"
                                value={lozinka}
                                onChange={(event) => {
                                    setLozinka(event.target.value);
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success mt-4"
                            onClick={login}
                        >
                            Prijavite se
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
