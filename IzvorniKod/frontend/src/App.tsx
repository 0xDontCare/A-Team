import {useState} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import NavbarElement from './components/NavbarElement';
import OglasDetalj from './components/OglasDetalj.tsx';
import AddAd from './components/AddAd';

function App() {
    const [isLoggedIn, setLoginStatus] = useState(false); // State to track login status
    const cardData = [
        {id: 1, title: 'Oglas 1', content: 'This is some content for Card 1.'},
        {id: 2, title: 'Oglas 2', content: 'This is some content for Card 2.'},
        {id: 3, title: 'Oglas 3', content: 'This is some content for Card 3.'},
        {id: 4, title: 'Oglas 4', content: 'This is some content for Card 4.'}
    ];

    return (
        <div>
            <NavbarElement isLoggedIn={isLoggedIn}/>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home cardData={cardData} isLoggedIn={isLoggedIn}/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login setLoginStatus={setLoginStatus}/>}/>
                    <Route path="/addAd" element={<AddAd/>}/>
                    <Route path="/:id" element={<OglasDetalj cardData={cardData}/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;