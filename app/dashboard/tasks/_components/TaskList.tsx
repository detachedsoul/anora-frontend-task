"use client";

import TaskFilterTabs from "./task-filter-tabs";
import { useUserTasks } from "@/hooks/use-user-tasks";
import { formatDate } from "@/utils/format-date";
import { useState } from "react";
import { cn } from "@/utils/cn";

type FilterKey =
	| "all"
	| "pending"
	| "completed"
	| "overdue"
	| "upcoming"
	| "high"
	| "medium"
	| "low";

const getPriorityStyles = (priority: string) => {
	switch (priority) {
		case "high":
			return "bg-rose-500 text-white";
		case "medium":
			return "bg-amber-500 text-white";
		case "low":
			return "bg-gray-500 text-white";
		default:
			return "bg-gray-300 text-gray-800";
	}
};

const getStatusStyles = (status: string) => {
	return status === "completed" ? "bg-brand-green text-white" : "bg-yellow-400 text-black";
};

const TaskList = () => {
	const [filterKey, setFilterKey] = useState<FilterKey>("all");

	const { filterTasks } = useUserTasks();

	const tasks = filterTasks(filterKey) ?? [];

	return (
		<div className="grid gap-8">
			<TaskFilterTabs
				filterKey={filterKey}
				setFilterKey={setFilterKey}
				filterTasks={(key) => filterTasks(key) ?? []}
			/>

			{tasks.length === 0 ? (
				<p className="text-gray-500 text-center mt-10">
					No tasks found for this filter.
				</p>
			) : (
				<div className="grid gap-4 md:grid-cols-2">
					{tasks.map((task) => (
						<div
							className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm transition hover:shadow-md grid gap-4"
							key={task.id}
						>
							<div className="flex items-center justify-between">
								<h2 className="text-base header text-gray-800">
									{task.title}
								</h2>

								<div className="flex gap-2">
									<span
										className={cn(
											"text-xs px-2 py-1 rounded-full capitalize font-medium",
											getPriorityStyles(task.priority),
										)}
									>
										{task.priority}
									</span>

									<span
										className={cn(
											"text-xs px-2 py-1 rounded-full font-medium",
											getStatusStyles(task.status),
										)}
									>
										{task.status === "completed"
											? "Completed"
											: "Pending"}
									</span>
								</div>
							</div>

							<p className="text-sm text-gray-600">
								{task.description}
							</p>

							<div className="flex justify-between text-xs text-gray-500 flex-wrap gap-2">
								<span>
									Created:{" "}
									{formatDate(
										new Date(task.createdAt),
										"ddd, MMM Do, YYYY  - h:mm A",
									)}
								</span>

								<span>
									Due:{" "}
									{formatDate(
										new Date(task.dueDate),
										"ddd, MMM Do, YYYY",
									)}
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default TaskList;
