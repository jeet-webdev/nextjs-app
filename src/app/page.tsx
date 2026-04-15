import HomeNavbar from "@/features/home/components/HomeNavbar";
import HomeHero from "@/features/home/components/HomeHero";
import HomeStats from "@/features/home/components/HomeStats";
import HomeFeatures from "@/features/home/components/HomeFeatures";
import HomeRestaurants from "@/features/home/components/HomeRestaurants";
import HomeFooter from "@/features/home/components/HomeFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] pointer-events-none -z-10" />

      <HomeNavbar />
      <HomeHero />
      <HomeRestaurants />
      <HomeStats />
      <HomeFeatures />
      <HomeFooter />
    </div>
  );
}//