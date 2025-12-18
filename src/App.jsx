import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from "./components/Header"

function App() {
  return (
    <>
      <Header />

      <main className="pt-24 bg-black text-white min-h-screen">
        <section id="about" className="h-screen px-6">
          <h1 className="text-4xl text-orange-500">О нас</h1>
        </section>

        <section id="price" className="h-screen px-6">
          <h1 className="text-4xl text-orange-500">Стоимость</h1>
        </section>

        <section id="gallery" className="h-screen px-6">
          <h1 className="text-4xl text-orange-500">Стрижки</h1>
        </section>

        <section id="booking" className="h-screen px-6">
          <h1 className="text-4xl text-orange-500">Запись</h1>
        </section>
      </main>
    </>
  )
}

export default App