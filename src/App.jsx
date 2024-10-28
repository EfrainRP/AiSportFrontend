
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Nav from './components/Inicio/Nav.jsx'
import Welcome from './components/Inicio/Welcome.jsx'
import SignUp from './components/Inicio/SignUp/SignUp.jsx'
import SignIn from "./components/Inicio/SignIn/SignIn.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";

function App(){
    return (
      <div className='App'>
        <Router>
          <Nav />
          <Routes>
            <Route index path="/" element={<Welcome/>}/>
            <Route path="/signin" element={<SignIn/>} />
            <Route path="/signup" element={<SignUp/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
          </Routes>
        </Router>
      </div>
    )
}
export default App;