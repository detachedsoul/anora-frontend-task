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

interface FilterButtonProps {
	label: string;
	filterKey: FilterKey;
	active: boolean;
	count: number;
	onClick: (key: FilterKey) => void;
	badgeColor?: string;
}

const FilterButton = ({
	label,
	filterKey,
	active,
	count,
	onClick,
	badgeColor = "bg-slate-200",
}: FilterButtonProps) => {
	return (
		<button
			type="button"
			onClick={() => onClick(filterKey)}
			className={cn(
				"rounded-full py-1 px-3 flex items-center justify-between header gap-4 border",
				{
					"bg-slate-200 text-[#111827] border-gray-800": !active,
					"bg-slate-800 dark:bg-gray-800 text-white border-transparent": active,
				},
			)}
		>
			{label}

			<span
				className={cn(
					"inline-block py-0.5 px-2.5 rounded-full text-white shrink-0",
					badgeColor,
				)}
			>
				{count}
			</span>
		</button>
	);
};

export default FilterButton;
