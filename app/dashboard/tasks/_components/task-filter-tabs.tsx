import FilterButton from "./filter-buttons";
import { FilterBy, Task } from "@/hooks/use-user-tasks";

const filters = [
	{ key: "all", label: "All", badgeColor: "bg-indigo-600" },
	{ key: "pending", label: "Pending", badgeColor: "bg-brand-info" },
	{ key: "completed", label: "Completed", badgeColor: "bg-brand-green" },
	{ key: "overdue", label: "Due", badgeColor: "bg-brand-red" },
	{ key: "upcoming", label: "Upcoming", badgeColor: "bg-purple-500" },
	{ key: "high", label: "High", badgeColor: "bg-rose-500" },
	{ key: "medium", label: "Medium", badgeColor: "bg-amber-600" },
	{ key: "low", label: "Low", badgeColor: "bg-neutral-500" },
] as const;

type Props = {
	filterKey: FilterBy;
	setFilterKey: (key: FilterBy) => void;
	filterTasks: (key: FilterBy) => Task[];
};

const TaskFilterTabs: React.FC<Props> = ({
	filterKey,
	setFilterKey,
	filterTasks,
}) => {
	return (
		<div className="min-w-full overflow-x-auto custom-scrollbar flex items-center gap-4">
			{filters.map((filter) => (
				<FilterButton
					key={filter.key}
					label={filter.label}
					filterKey={filter.key}
					active={filterKey === filter.key}
					count={filterTasks(filter.key)?.length ?? 0}
					badgeColor={filter.badgeColor}
					onClick={setFilterKey}
				/>
			))}
		</div>
	);
};

export default TaskFilterTabs;
