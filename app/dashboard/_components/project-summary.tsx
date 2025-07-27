"use client";

import SummaryCard from "./summary-card";
import AddTask from "./add-task";
import { ClipboardListIcon } from "lucide-react";
import { useUserTasks } from "@/hooks/use-user-tasks";
import { useState } from "react";

const ProjectSummary = () => {
	const { getTasks, filterTasks, groupTasksByTime } = useUserTasks();

	const [isModalActive, setIsModalActive] = useState(false);

	return (
		<section className="grid gap-3 relative">
			<div className="flex flex-wrap justify-between gap-4 items-center">
				<h2 className="header text-xl">Tasks Summary</h2>

				<button
					className="flex items-center gap-2 header hover:underline hover:text-brand-green decoration-wavy underline-offset-4"
					type="button"
					onClick={() => setIsModalActive(!isModalActive)}
				>
					Add Task <ClipboardListIcon strokeWidth={1.2} />
				</button>
			</div>

			<div className="grid grid-cols-2 items-start gap-4">
				<SummaryCard
					count={getTasks()?.length ?? 0}
					label="Total"
					bg="bg-indigo-600"
					border="border-indigo-600"
					afterBorder="after:border-indigo-600"
                    filterKey="all"
				/>

                <SummaryCard
					count={filterTasks("pending")?.length ?? 0}
					label="Pending"
					bg="bg-brand-info"
					border="border-brand-info"
                    afterBorder="after:border-brand-info"
                    filterKey="pending"
				/>

				<SummaryCard
					count={filterTasks("completed")?.length ?? 0}
					label="Completed"
					bg="bg-brand-green"
					border="border-brand-green"
                    afterBorder="after:border-brand-green"
                    filterKey="completed"
				/>

				<SummaryCard
					count={groupTasksByTime()?.today?.length ?? 0}
					label="Due"
					bg="bg-brand-red"
					border="border-brand-red"
                    afterBorder="after:border-brand-red"
                    filterKey="overdue"
				/>

				<SummaryCard
					count={groupTasksByTime()?.upcoming?.length ?? 0}
					label="Upcoming"
					bg="bg-purple-500"
					border="border-purple-500"
                    afterBorder="after:border-purple-500"
                    filterKey="upcoming"
				/>

				<SummaryCard
					count={filterTasks("high")?.length ?? 0}
					label="High Priority"
					bg="bg-rose-500"
					border="border-rose-500"
                    afterBorder="after:border-rose-500"
                    filterKey="high"
				/>

				<SummaryCard
					count={filterTasks("medium")?.length ?? 0}
					label="Medium Priority"
					bg="bg-amber-600"
					border="border-amber-600"
                    afterBorder="after:border-amber-600"
                    filterKey="medium"
				/>

				<SummaryCard
					count={filterTasks("low")?.length ?? 0}
					label="Low Priority"
					bg="bg-neutral-500"
					border="border-neutral-500"
					afterBorder="after:border-neutral-500"
                    filterKey="low"
				/>
			</div>

			<AddTask
				isModalActive={isModalActive}
				setIsModalActive={setIsModalActive}
			/>
		</section>
	);
};

export default ProjectSummary;
