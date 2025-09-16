
import Feature from "../../components/Feature";
import Hero from "../../components/Hero";
import KeyBenefits from "../../components/KeyBenefits";
import { MarqueeDemo } from "../../components/Marquee";

export default async function Home() {
 

  return (
    <>
      <Hero />
      <Feature />
      <MarqueeDemo />
      <KeyBenefits />
    </>
  );
}