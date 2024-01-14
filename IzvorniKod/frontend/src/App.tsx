import {useEffect, useState} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import axios from "axios";
import Registration from "./components/Registration.tsx";
import Login from "./components/Login";
import Home from "./components/Home";
import NavbarElement from "./components/NavbarElement";
import AdDetail from "./components/AdDetail.tsx";
import AddAd from "./components/AddAd";
import ChangeAd from "./components/ChangeAd.tsx";

function App() {
    const [loginStatus, setLoginStatus] = useState(false);
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

        void checkLoginStatus();
    }, []);

    const loginUser = () => {
        setLoginStatus(true);
    };

    const logoutUser = () => {
        setLoginStatus(false);
    };

    return (
        <div>
            <BrowserRouter>
                <NavbarElement
                    isLoggedIn={loginStatus}
                    userData={userData}
                    setLoginStatus={logoutUser}
                />
                <Routes>
                    <Route path="/" element={<Home isLoggedIn={loginStatus} userData={userData}/>}/>
                    <Route path="/register" element={<Registration/>}/>
                    <Route
                        path="/login"
                        element={
                            <Login setLoginStatus={loginUser} setUserData={setUserData}/>
                        }
                    />
                    <Route path="/addAd" element={<AddAd/>}/>
                    <Route path="/changeAd/:id" element={<ChangeAd/>}/>
                    <Route path="/:id" element={<AdDetail/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;