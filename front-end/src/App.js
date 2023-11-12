import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/home/Home";
import News from "./pages/news/News";
import Houses from "./pages/houses/Houses";
import { ErrorProvider } from "./contexts/errorContext";

import "./assets/css/base.css";
import "./assets/css/color.css";
import ErrorBanner from "./components/errorBanner/errorBanner";
import { UserProvider } from "./contexts/userContext";
import { Admin } from "./pages/admin/admin";
import { Chat } from "./components/chat/Chat";
import UpdateNews from "./pages/admin/news/UpdateNews"
import CreateNews from "./pages/admin/news/CreateNews"
import SalesHistory from "./pages/saleshistory/SalesHistory"
import { Login } from "./pages/login/Login";
import HouseCreate from "./pages/admin/houseCreate/HouseCreate";
import HouseEdit from "./pages/admin/houseEdit/HouseEdit";

const App = () => {
  return (
    <ErrorProvider>
      <UserProvider>
        <BrowserRouter>
          <Navbar />
          <ErrorBanner />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/hem' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/news' element={<News />} />
            <Route path='/news/create' element={<CreateNews />} />
            <Route path='/sales' element={<SalesHistory/>} />
            <Route path='/news/edit/:id' element={<UpdateNews />} />
            <Route path='/houses' element={<Houses />} />
            <Route path='/houses/create' element={<HouseCreate />} />
            <Route path='/admin' element={<Admin />} />
            <Route path='/houses/edit/:id' element={<HouseEdit />} />
          </Routes>
        </BrowserRouter>
        <Chat />
      </UserProvider>
    </ErrorProvider>
  );
};

export default App;
