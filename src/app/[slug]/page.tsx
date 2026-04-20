"use client";
import React from "react";

import Main from "../../features/restaurants/UI/Main";
import RHeader from "../../features/restaurants/UI/RHeader";
import Footer from "@/features/restaurants/UI/Footer";
import HeroSection from "@/features/restaurants/UI/HeroSection";

const Page = () => {
  return (
    <>
      <RHeader />
      <HeroSection />
      <Main />
      <Footer />
    </>
  );
};

export default Page;