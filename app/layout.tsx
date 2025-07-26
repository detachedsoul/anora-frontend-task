import type { Metadata } from "next";
import { Toaster } from "sonner";
import { IBM_Plex_Mono, Urbanist } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
	variable: "--font-ibm-plex-mono",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const urbanist = Urbanist({
	variable: "--font-urbanist",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Taskify - Take Control of Your Day",
	description: "Taskify - Take control of your day.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${ibmPlexMono.variable} ${urbanist.variable} antialiased scroll-smooth font-urbanist tracking-wider bg-[#f9fafb] text-[#111827] text-base dark:bg-gray-950 dark:text-[#f8fafc]`}
			>
				{children}

				<Toaster richColors />
			</body>
		</html>
	);
}
