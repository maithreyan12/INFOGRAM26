import HeroSection from '@/components/home/HeroSection';
import FeaturedEvents from '@/components/home/FeaturedEvents';
import LiveBanner from '@/components/home/LiveBanner';
import SponsorsSection from '@/components/home/SponsorsSection';
import StatsSection from '@/components/home/StatsSection';
import VideoSection from '@/components/home/VideoSection';
import MusicPlayer from '@/components/home/MusicPlayer';
import PublicLayout from '@/components/layout/PublicLayout';

export const metadata = {
  title: "INFOGRAM'26 | National Level Technical Symposium",
  description:
    "Join INFOGRAM'26, the premier national level technical symposium organized by the Department of Information Technology at C. Abdul Hakeem College of Engineering & Technology.",
};

export default function Home() {
  return (
    <PublicLayout>
      <LiveBanner />
      <HeroSection />
      <VideoSection />
      <StatsSection />
      <FeaturedEvents />
      <SponsorsSection />
      {/* Floating background music player with online playlist & track chooser */}
      <MusicPlayer />
    </PublicLayout>
  );
}
