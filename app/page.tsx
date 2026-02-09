import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import OurStory from "@/components/OurStory";
import Testimonial from "@/components/Testimonial";
import WhyChooseUs from "@/components/WhyChooseUs";
import FinalCTA from "@/components/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <OurStory />
      <Testimonial />
      <WhyChooseUs />
      <FinalCTA />
    </>
  );
}
