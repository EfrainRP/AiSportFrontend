
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Formulario from './components/Inicio/Formulario.jsx'
import Login from './components/Inicio/Login.jsx'
import Welcome from './components/Inicio/Welcome.jsx'
import Nav from './components/Inicio/Nav.jsx'

function App(){
    return (
      <div className='App'>
        <Router>
          <Nav />
          <Routes>
            <Route index path="/" element={<Welcome/>}/>
            {/* <Route path="/login" element={Login} /> */}
          </Routes>
        </Router>
      </div>
    )
}
export default App;