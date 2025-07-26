"use client";

import SummaryCard from "./summary-card";
import { ClipboardListIcon, XIcon } from "lucide-react";
import { useUserTasks } from "@/hooks/use-user-tasks";
import { useState } from "react";
import { cn } from "@/utils/cn";
import AddTask from "./add-task";

const ProjectSummary = () => {
	const { filterTasks, groupTasksByTime } = useUserTasks();

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
					count={filterTasks("pending")?.length ?? 0}
					label="Pending"
					bg="bg-brand-info"
					border="border-brand-info"
					afterBorder="after:border-brand-info"
				/>

				<SummaryCard
					count={filterTasks("completed")?.length ?? 0}
					label="Completed"
					bg="bg-brand-green"
					border="border-brand-green"
					afterBorder="after:border-brand-green"
				/>

				<SummaryCard
					count={groupTasksByTime()?.today?.length ?? 0}
					label="Due"
					bg="bg-brand-red"
					border="border-brand-red"
					afterBorder="after:border-brand-red"
				/>

                <SummaryCard
					count={groupTasksByTime()?.upcoming?.length ?? 0}
					label="Upcoming"
					bg="bg-purple-500"
					border="border-purple-500"
					afterBorder="after:border-purple-500"
				/>

				<SummaryCard
					count={filterTasks("high")?.length ?? 0}
					label="High Priority"
					bg="bg-rose-500"
					border="border-rose-500"
					afterBorder="after:border-rose-500"
				/>

				<SummaryCard
					count={filterTasks("medium")?.length ?? 0}
					label="Medium Priority"
					bg="bg-amber-600"
					border="border-amber-600"
					afterBorder="after:border-amber-600"
				/>

				<SummaryCard
					count={filterTasks("low")?.length ?? 0}
					label="Low Priority"
					bg="bg-neutral-500"
					border="border-neutral-500"
					afterBorder="after:border-neutral-500"
				/>
			</div>

			<div
				className={cn(
					"fixed max-h-[90dvh] h-[90dvh] overflow-y-auto z-1024 bg-gray-950 border border-gray-950 w-[calc((100%-2rem)+0.25rem)] rounded-t-lg px-4 pb-4 pt-2 outline outline-offset-4 outline-double outline-gray-800 transition-all duration-300 ease-in-out md:w-[calc((80%-2rem)+0.25rem)] lg:w-[calc((50%-2rem)+0.25rem)] flex flex-col gap-10",
					{
						"bottom-0": isModalActive,
						"-bottom-full": !isModalActive,
					},
				)}
			>
				<div className="ml-auto sticky top-0 -mr-2 bg-gray-800 z-50 rounded-full grid place-content-center">
					<button
						className="bg-gray-800 p-1 rounded-full"
						type="button"
						onClick={() => setIsModalActive(false)}
						aria-label="Close modal"
					>
						<XIcon
							strokeWidth={1.2}
							size={18}
						/>
					</button>
				</div>

				<AddTask />
			</div>
		</section>
	);
};

export default ProjectSummary;
