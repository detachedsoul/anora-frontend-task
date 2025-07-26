import type { Metadata } from "next";
import Index from "./_components";

export const metadata: Metadata = {
	title: "Taskify | Dashboard",
	description: "Welcome to your dashboard",
};

const Dashboard = () => {
	return (
		<Index />
	);
};

export default Dashboard;
