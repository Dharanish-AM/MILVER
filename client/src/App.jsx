import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Deliverymandetails from './pages/Deliverymandetails'
import MapRoutes from "./pages/MapRoutes"
function App() {

  return (
    <Routes>
      <Route path='/Dashboard' Component={Dashboard} />
      <Route path='/Deliverymandetails' Component={Deliverymandetails}/>
      <Route path='/Routes' Component={MapRoutes} />
    </Routes>
  )
}

export default App
