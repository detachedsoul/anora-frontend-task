import { Loader2Icon } from "lucide-react";

const Loader = () => {
	return (
		<div className="fixed inset-0 z-50 h-dvh grid place-items-center bg-[#f9fafb]/80 dark:bg-gray-950/80 backdrop-blur-md">
			<Loader2Icon
				className="size-10 animate-spin text-[#111827] dark:text-[#f8fafc]"
				strokeWidth={1.2}
			/>
		</div>
	);
};

export default Loader;
