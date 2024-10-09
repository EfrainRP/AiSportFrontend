
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Nav from './components/Inicio/Nav.jsx'
import Welcome from './components/Inicio/Welcome.jsx'
import SignUp from './components/Inicio/SignUp.jsx'
import SignIn from "./components/Inicio/SignIn.jsx";

function App(){
    return (
      <div className='App'>
        <Router>
          <Nav />
          <Routes>
            <Route index path="/" element={<Welcome/>}/>
            <Route path="/signin" element={<SignIn/>} />
            <Route path="/signup" element={<SignUp/>} />
          </Routes>
        </Router>
      </div>
    )
}
export default App;