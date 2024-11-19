import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Deliverymandetails from './pages/Deliverymandetails'
import MapRoutes from "./pages/MapRoutes"
import Customers from "./pages/Customers";
function App() {

  return (
    <Routes>
      <Route path='/Dashboard' Component={Dashboard} />
      <Route path='/Deliverymandetails' Component={Deliverymandetails}/>
      <Route path='/Routes' Component={MapRoutes} />
      <Route path='/Customers' Component={Customers}/>
    </Routes>
  )
}

export default App
