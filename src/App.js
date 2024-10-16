import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';  // Importing the Header component
import User from './Components/User';
import Status from './Components/Status';
import Priority from './Components/Priority';
function App() {
  return (
    <>
    <Header/>
     <Routes>
     
     <Route path="/" element={ <User/> } />
     <Route path="/status" element={ <Status/> } />
     <Route path="/priority" element={ <Priority/> } />
     </Routes>
    </>
  );
}

export default App;
