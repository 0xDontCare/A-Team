import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setLoginStatus }) {
  document.title = "Prijava";
  const [username, setUsername] = useState("");
  const [lozinka, setLozinka] = useState("");
  const navigate = useNavigate();

  async function login(event) {
    event.preventDefault();
    try {
      const response = await axios.post("/api/login", {
        username: username,
        email: "", // implementing it later
        password: lozinka,
      });

      if (response.status === 200) {
        // Assuming the server responds with a success status
        setLoginStatus(true); // Update the login status in the parent component
        navigate("/");
      } else if (response.status === 401) {
        alert(response.data.message);
      } else {
        alert("Krivo korisničko ime ili lozinka!");
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
