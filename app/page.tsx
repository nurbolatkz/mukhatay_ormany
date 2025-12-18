import { HeroSection } from "@/components/sections/hero-section"
import { LocationsSection } from "@/components/sections/locations-section"
import { StatsSection } from "@/components/sections/stats-section"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"
import { TrustSection } from "@/components/sections/trust-section"
import { MissionSection } from "@/components/sections/mission-section"
import { CorporateSection } from "@/components/sections/corporate-section"
import { TransparencySection } from "@/components/sections/transparency-section"
import { NewsSection } from "@/components/sections/news-section"
import { ContactSection } from "@/components/sections/contact-section"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <LocationsSection />
        <StatsSection />
        <HowItWorksSection />
        <TrustSection />
        <MissionSection />
        <CorporateSection />
        <TransparencySection />
        <NewsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
