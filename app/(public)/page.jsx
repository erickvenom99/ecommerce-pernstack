'use client'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
//import HeroTwo from "@/components/HeroTwo";
import HeroThree from "@/components/HeroThree";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import HeroRunwayCinematic from "@/components/HeroRunwayCinematic";

export default function Home() {
    return (
        <div>
            <Hero />
            <LatestProducts />
            <HeroThree />
            {/* <HeroTwo /> */}
            <BestSelling />
            <HeroRunwayCinematic />
            <OurSpecs />
            <Newsletter />
        </div>
    );
}
