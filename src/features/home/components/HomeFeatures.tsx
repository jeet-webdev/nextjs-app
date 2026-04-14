import { BarChart3, Shield, Zap } from "lucide-react";
import FeatureItem from "./FeatureItem";

export default function HomeFeatures() {
  return (
    <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 pb-40">
      <FeatureItem
        icon={<Shield size={26} />}
        title="Trusted Marketplace"
        desc="Every listing is managed through role-based flows so restaurant data remains consistent."
      />
      <FeatureItem
        icon={<Zap size={26} />}
        title="Fast Discovery"
        desc="Customers can browse multiple restaurants, compare categories, and find what they need quickly."
      />
      <FeatureItem
        icon={<BarChart3 size={26} />}
        title="Scalable Growth"
        desc="Owners publish restaurants while administrators maintain platform quality at scale."
      />
    </section>
  );
}//
