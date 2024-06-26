import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login({setLoginStatus, setUserData}) {
    document.title = "Prijava";
    const [username, setUsername] = useState("");
    const [lozinka, setLozinka] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const validateLoginForm = () => {
        if (!username || !lozinka) {
            setError("Niste upisali podatke u sva zadana polja!");
            return false;
        }
        return true;
    };

    async function login(event: { preventDefault: () => void }) {
        event.preventDefault();

        if (!validateLoginForm()) {
            return;
        }

        try {
            const response = await axios.post("/api/login", {
                username: username,
                email: "",
                password: lozinka,
            });

            if (response.status === 200) {
                const userDataResponse = await axios.get("/api/logged");

                if (userDataResponse.status === 200) {
                    const userData = userDataResponse.data;
                    setLoginStatus(true);
                    setUserData(userData);
                    navigate("/");
                } else {
                    alert("Failed to get user data.");
                }
            } else if (response.status === 401) {
                setError(response.data.message);
            } else {
                setError("Invalid username or password!");
            }
        } catch (err) {
            console.error(err);
            setError("Pogreška prilikom prijave!");
        }
    }

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div>
            <div className="container mt-4">
                <div className="card p-5">
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form>
                        <div className="form-group mb-2">
                            <label htmlFor="email" className="label-emailAndPassword">Korisničko ime</label>
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                placeholder="Upišite korisničko ime"
                                autoComplete="off"
                                value={username}
                                onChange={(event) => {
                                    setUsername(event.target.value);
                                }}
                            />
                        </div>

                        <div className="form-group mb-2">
                            <label htmlFor="lozinka" className="label-emailAndPassword">Lozinka</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                id="lozinka"
                                placeholder="Upišite lozinku"
                                value={lozinka}
                                onChange={(event) => {
                                    setLozinka(event.target.value);
                                }}
                            />
                        </div>

                        <div className="form-check mt-2">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheck"
                                   onChange={() => setShowPassword(!showPassword)}/>
                            <label className="form-check-label" htmlFor="flexCheck">
                                Prikažite lozinku
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success mt-4"
                            onClick={login}
                        >
                            Prijavite se
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
                </div>
            </div>
        </div>
    );
}

export default Login;