import './App.css'
import Header from "./components/Header"
import Hero from './components/Hero'
import About from "./components/About"
import Gallery from "./components/Gallery"
import Footer from "./components/Footer"
import Reviews from "./components/Reviews"

function App() {
  return (
    <>
      <Header />
      <main className="bg-black text-white">
        <Hero />
        <About />
        <Gallery />
        <Reviews />
      </main>
       <Footer />
    </>
  )
}

export default App