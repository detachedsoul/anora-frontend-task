import { cn } from "@/utils/cn";
import { FilterBy, useUserTasks } from "@/hooks/use-user-tasks";
import { useRouter } from "next/navigation";

const SummaryCard = ({
	count,
	label,
	bg,
	border,
	afterBorder,
	filterKey
}: {
	count: number;
	label: string;
	bg: string;
	border: string;
	afterBorder: string;
	filterKey: FilterBy;
}) => {
	const setFilterKey = useUserTasks((state) => state.setFilterKey);

	const { push } = useRouter();

	return (
		<button
			className={cn(
				"relative text-left text-white after:absolute after:size-full after:-bottom-1 after:left-1 after:border after:rounded-lg after:z-10 hover:after:inset-0 after:transition-all after:duration-300 after:ease-in-out",
				afterBorder,
			)}
			type="button"
			onClick={() => {
				setFilterKey(filterKey);

				push("/dashboard/tasks");
			}}
		>
			<div
				className={cn(
					"rounded-lg px-4 pt-4 pb-10 relative z-[1024]",
					bg,
					border,
				)}
			>
				<h3 className="text-sm font-medium">
					<span className="block text-lg header">{count}</span>

					{label}
				</h3>
			</div>
		</button>
	);
};

export default SummaryCard;
