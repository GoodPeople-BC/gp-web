import { BrowserRouter, Route, Routes } from 'react-router-dom'

import CampaignDetail from './pages/CampaignDetail'
import Home from './pages/Home'

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/campaign/:id' element={<CampaignDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
