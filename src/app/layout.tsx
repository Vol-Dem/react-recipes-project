import "../styles/global.scss";
import AppLayout from "./layout/Layout/Layout";
import AppProviders from "./providers";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: {
    default: "Your recipe book - find and share everyday cooking inspiration",
    template: "%s | Your Recipe Book",
  },
  description:
    "Find recipes, explore cooking inspiration, and save your favorites.",
};

const RootLayout = ({ children }: PropsWithChildren) => (
  <html lang="en">
    <body>
      <AppProviders>
        <AppLayout>{children}</AppLayout>
      </AppProviders>
    </body>
  </html>
);

export default RootLayout;
