import {useEffect, useState} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import NavbarElement from "./components/NavbarElement";
import OglasDetalj from "./components/OglasDetalj.tsx";
import AddAd from "./components/AddAd";
import axios from "axios";
import ChangeAd from "./components/ChangeAd.tsx";

function App() {
    const [isLoggedIn, setLoginStatus] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get("/api/logged");

                if (response.data) {
                    setLoginStatus(true);
                    setUserData(response.data);
                } else {
                    setLoginStatus(false);
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    setLoginStatus(false);
                } else {
                    console.error("Error fetching user data: ", error);
                }
            }
        };

        checkLoginStatus();
    }, []);

    const prijaviUser = () => {
        setLoginStatus(true);
    };

    const odjaviUser = () => {
        setLoginStatus(false);
    };

    return (
        <div>
            <BrowserRouter>
                <NavbarElement
                    isLoggedIn={isLoggedIn}
                    userData={userData}
                    setLoginStatus={odjaviUser}
                />
                <Routes>
                    <Route path="/" element={<Home isLoggedIn={isLoggedIn} userData={userData}/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route
                        path="/login"
                        element={
                            <Login setLoginStatus={prijaviUser} setUserData={setUserData}/>
                        }
                    />
                    <Route path="/addAd" element={<AddAd/>} userData={userData}/>
                    <Route path="/changeAd/:id" element={<ChangeAd/>}/>
                    <Route path="/:id" element={<OglasDetalj/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;