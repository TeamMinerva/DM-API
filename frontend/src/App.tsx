import Home from './pages/Home'
import Expansao from './pages/Expansao'
import Risco from './pages/Risco'
import Mercado from './pages/Mercado'
import { Navigate } from 'react-router-dom'

import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (

    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/Expansao" element={<Expansao />}/>
        <Route path="/Risco" element={<Risco />}/>
        <Route path="/Mercado" element={<Mercado />}/>

        {/* Caso tenha alguma rota inválida, navega até o / (dashboard) */}
        <Route path="*" element={<Navigate to="/" />} /> 

      </Routes>

    </BrowserRouter>

  )
}

export default App