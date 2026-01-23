import { Helmet } from 'react-helmet-async';
import Navbar from '../components/landing-page/Navbar';
import Hero from '../components/landing-page/Hero';
import PainPointsGrid from '../components/landing-page/PainPointsGrid';
import HowItWorksCards from '../components/landing-page/HowItWorksCards';
import DigitalTwinShowcase from '../components/landing-page/DigitalTwinShowcase';
import FinalCTA from '../components/landing-page/FinalCTA';
import Footer from '../components/landing-page/Footer';



const Index = () => {
  return (
    <>
      <Helmet>
        <title>PropGrowthX | Data-Driven Real Estate Platform</title>
        <meta
          name="description"
          content="Make smarter property decisions with PropGrowthX. ML-powered price predictions, verified properties, and transparent transactions."
        />
      </Helmet>

      <Navbar />

      <section id="home">
        <Hero />
      </section>

      <section id="pain-points">
        <PainPointsGrid />
      </section>

      <section id="how-it-works">
        <HowItWorksCards />
      </section>

      <section id="features">
        <DigitalTwinShowcase />
      </section>

      <section id="pricing">
        <FinalCTA />
      </section>

      <Footer />
    </>
  );
};

export default Index;

