import { Route, Routes } from 'react-router-dom'
import Layout from './components/common/Layout'
import HomePage from './pages'
import CampaignCreate from './pages/campaign/create'
import CampaignDetail from './pages/campaign/detail'

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/campaign/:id' element={<CampaignDetail />} />
          <Route path='/campaign/create' element={<CampaignCreate />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App
