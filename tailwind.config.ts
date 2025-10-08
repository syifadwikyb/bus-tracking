import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2356CF",
        gray: "#949191",
        warning: "#F2A100",
        success: "#0B7E6E",
        danger: "#CC1B1B",
        softSuccess: "#E5F6F5",
        softWarning: "#FFF4BC",
        softDanger: "#FFD6D6",
      },
      backgroundImage: {
        gradient1: "linear-gradient(135deg, #B357FF 0%, #5B87E6 100%)",
        gradient2: "linear-gradient(135deg, #12042B 0%, #480028 100%)",
        gradient3: "linear-gradient(135deg, #8D2370 0%, #F79464 100%)",
      },
      fontFamily: {
        sans: ["Quicksand", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
