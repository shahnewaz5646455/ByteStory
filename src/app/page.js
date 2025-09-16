
import Feature from "../../components/Feature";
import Hero from "../../components/Hero";
import KeyBenefits from "../../components/KeyBenefits";

export default async function Home() {
 

  return (
    <>
      <Hero />
      {/* You can render data here */}
      <Feature />
      <KeyBenefits />
    </>
  );
}