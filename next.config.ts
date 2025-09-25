import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [25, 50, 75, 95],
    domains: [
      "res.cloudinary.com", // Dominio de Cloudinary para imágenes
    ],
  },
};

export default nextConfig;
