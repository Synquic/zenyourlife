import React from 'react'
import RNavbar from '../../components/Rental/RNavbar'
import RHeroSection from '../../components/Rental/RHeroSection'
import Overview from '../../components/Rental/Overview'
import Appartments from '../../components/Rental/Appartments'
import Banner from '../../components/Rental/Banner'
import Service from '../../components/Rental/Service'
import Testimonial from '../../components/Rental/Testimonial'
import FAQ from '../../components/Rental/FAQ'
import Footer from '../../components/Footer'

const RHome = () => {
  return (
    <>
    <RNavbar/>
    <RHeroSection/>
    <Overview/>
    <Appartments/>
    <Banner/>
    <Service/>
    <Testimonial/>
    <FAQ/>
    <Footer/>
    </>
  )
}

export default RHome