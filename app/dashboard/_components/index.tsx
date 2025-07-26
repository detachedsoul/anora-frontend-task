"use client";

import Loader from "@/app/loading";
import ProjectSummary from "./project-summary";
import { useUserTasks } from "@/hooks/use-user-tasks";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { formatDate } from "@/utils/format-date";

const Index = () => {
    const isHydrated = useHasHydrated();

    const store = useUserTasks();

    if (!isHydrated) return <Loader />;

	const { currentUser } = store;

    return (
		<div className="grid gap-10">
			<section className="sticky top-4 pb-2 bg-[#f9fafb] text-[#111827] dark:bg-gray-950 dark:text-[#f8fafc]">
				<div className="grid gap-1">
					<h1 className="header text-2xl">Hi, {currentUser ?? ""} 👋</h1>

					<p>
						{formatDate(new Date(), "ddd, MMMM Do, YYYY - h:mm A")}
					</p>
				</div>
			</section>

			<div className="grid gap-4">
				<ProjectSummary />
			</div>
		</div>
	);
};

export default Index;
