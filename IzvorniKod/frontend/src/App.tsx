import {useEffect, useState} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import NavbarElement from "./components/NavbarElement";
import OglasDetalj from "./components/OglasDetalj.tsx";
import AddAd from "./components/AddAd";
import axios from "axios";

function App() {
    const [isLoggedIn, setLoginStatus] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (isLoggedIn) {
            axios.get("/api/logged")
                .then((response) => {
                    setUserData(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching user data: ", error);
                });
        }
    }, [isLoggedIn]);

    const prijaviUser = () => {
        setLoginStatus(true);
    };

    const odjaviUser = () => {
        setLoginStatus(false);
    };

    return (
        <div>
            <BrowserRouter>
                <NavbarElement isLoggedIn={isLoggedIn} userData={userData} setLoginStatus={odjaviUser}/>
                <Routes>
                    <Route
                        path="/"
                        element={<Home isLoggedIn={isLoggedIn}/>}
                    />
                    <Route path="/register" element={<Register/>}/>
                    <Route
                        path="/login"
                        element={<Login setLoginStatus={prijaviUser} setUserData={setUserData}/>}
                    />

                    <Route path="/addAd" element={<AddAd/>}/>
                    <Route path="/:id" element={<OglasDetalj/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;