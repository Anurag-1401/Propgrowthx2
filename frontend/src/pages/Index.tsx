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
          content="Make smarter property decisions with PropGrowthX. ML-powered price predictions, verified properties, and transparent transactions for buying, selling, renting, or investing."
        />
      </Helmet>

      <div style={{ width: '100%' }}>
        <Navbar />
        <Hero />
        <PainPointsGrid />
        <HowItWorksCards />
        <DigitalTwinShowcase />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
};

export default Index;
