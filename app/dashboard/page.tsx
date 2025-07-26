import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Taskify | Dashboard",
	description: "Welcome to your dashboard",
};

const Dashboard = () => {
	return (
		<p className="grid place-content-center h-dvh">
			This is your dashboard
		</p>
	);
};

export default Dashboard;
