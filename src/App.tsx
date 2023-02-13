import Header from './components/common/Header'
import routes from './router'
import RouteIndex from './router/RouterIndex'

function App() {
  return (
    <>
      <Header />
      <RouteIndex routes={routes} />
    </>
  )
}

export default App
