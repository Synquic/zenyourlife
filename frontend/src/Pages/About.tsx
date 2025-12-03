
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Philosophy from "../components/Philosophy";
import Expert from "../components/Expert";
import Service from "../components/Service";
import Overview from "../components/Overview";
import Testimonial from "../components/Testimonial";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Our Philosophy Section */}
      <Philosophy />

      {/* Meet Our Expert Section */}
      <Expert />

      {/* What We Do Section */}
      <Service />

      <Overview />
      {/* Why Choose Us Section */}

      {/* Testimonials Section */}
      <Testimonial />

      {/* CTA Section */}

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default About;
