// import React, { useEffect, useState } from 'react';
import HomePage from './routes/HomePage';


import './App.css';
import { getDolls } from "./components/AllDollsObjects";

function App() {
    return (<HomePage />);
}

export async function loader() {
    const dolls = await getDolls();
    return { dolls };
  }

export default App;