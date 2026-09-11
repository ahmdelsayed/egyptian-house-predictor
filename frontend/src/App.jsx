import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import EstimatorForm from "./components/EstimatorForm.jsx";
import Communities from "./components/Communities.jsx";
import WhyUs from "./components/WhyUs.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <main>
        <Hero />
        <EstimatorForm />
        <Communities />
        <WhyUs />
      </main>
      <Footer />
    </div>
  );
}
