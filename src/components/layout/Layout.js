import Header from './Header'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      <main className="grow py-8 overflow-x-hidden">
        <div className="school-container">{children}</div>
      </main>
      <Footer />
    </div>
  )
}
