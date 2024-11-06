import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Deliverymandetails from './pages/Deliverymandetails'
function App() {

  return (
    <Routes>
      <Route path='/Dashboard' Component={Dashboard} />
      <Route path='/Deliverymandetails' Component={Deliverymandetails}/>
    </Routes>
  )
}

export default App
