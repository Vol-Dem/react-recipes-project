import localFont from "next/font/local";

export const raleway = localFont({
  src: [
    {
      path: "../assets/fonts/Raleway/Raleway-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Raleway/Raleway-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/Raleway/Raleway-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/Raleway/Raleway-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-raleway",
  display: "swap",
  fallback: ["sans-serif"],
});

export const grandHotel = localFont({
  src: "../assets/fonts/GrandHotel/GrandHotel-Regular.ttf",
  // Preserve the weight used by the original @font-face declaration.
  weight: "500",
  style: "normal",
  variable: "--font-grand-hotel",
  display: "swap",
  fallback: ["sans-serif"],
});
