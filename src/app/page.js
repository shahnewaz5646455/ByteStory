
import Feature from "../../components/Feature";
import Hero from "../../components/Hero";
import HowItWorks from "../../components/HowItWorks";
import KeyBenefits from "../../components/KeyBenefits";
import { MarqueeDemo } from "../../components/Marquee";

export default function Home() {
  return (
    <>
      <Hero />
      <Feature />
      <MarqueeDemo />
      <KeyBenefits />
      <HowItWorks />
    </>
  );
}