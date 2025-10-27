
import ScrollToTop from "@/components/ScrollToTop";
import Cta from "../../components/Cta";
import FAQ from "../../components/Faq";
import Hero from "../../components/Hero";
import HowItWorks from "../../components/HowItWorks";
import KeyBenefits from "../../components/KeyBenefits";
import { MarqueeDemo } from "../../components/Marquee";
import TestimonialSection from "../../components/Testimonial";
import ToolboxSection from "../../components/Toolbox";
import Feature from "../../components/Feature";

export default function Home() {
  return (
    <>
      <Hero />
      <Feature />
      <ToolboxSection />
      <MarqueeDemo />
      <KeyBenefits />
      <HowItWorks />
      <TestimonialSection />
      <FAQ />
      <Cta />
      <ScrollToTop />
    </>
  );
}