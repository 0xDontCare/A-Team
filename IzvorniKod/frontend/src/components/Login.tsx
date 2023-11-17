import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function Login({setLoginStatus, setUserData}) {
    document.title = "Prijava";
    const [username, setUsername] = useState("");
    const [lozinka, setLozinka] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");

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
            setError("Error while logging in!");
        }
    }

    return (
        <div>
            <div className="container mt-4">
                <div className="card p-5">
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form>
                        <div className="form-group mb-2">
                            <label>Korisničko ime</label>
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                placeholder="Upišite korisničko ime"
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