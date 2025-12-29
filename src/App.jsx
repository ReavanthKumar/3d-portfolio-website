import { Suspense, lazy } from 'react';
import { Loader } from '@react-three/drei';
import Hero from './sections/Hero.jsx';
import NavBar from './components/NavBar.jsx';
import TechStack from './sections/TechStack.jsx'; // Eager load for stability

const ShowcaseSection = lazy(() => import('./sections/ShowcaseSection.jsx'));
const LogoShowcase = lazy(() => import('./sections/LogoShowcase.jsx'));
const FeatureCards = lazy(() => import('./sections/FeatureCards.jsx'));
const Experience = lazy(() => import('./sections/Experience.jsx'));
const Testimonials = lazy(() => import('./sections/Testimonials.jsx'));
const Contact = lazy(() => import('./sections/Contact.jsx'));
const Footer = lazy(() => import('./sections/Footer.jsx'));


function App() {
  return (
    <>
      <NavBar />
      <Hero />
      <TechStack />
      <Suspense fallback={<div className="flex justify-center items-center py-20 text-white font-bold text-xl">Loading Content...</div>}>
        <ShowcaseSection />
        <LogoShowcase />
        <FeatureCards />
        <Experience />
        <Contact />
        <Footer />
      </Suspense>
      <Loader />
    </>

  )
}

export default App