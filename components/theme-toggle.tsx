"use client";

import useTheme from "@/hooks/use-theme";
import { useState } from "react";
import { MoonIcon, SunIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/utils/cn";

const themes = [
	{ label: "Light", value: "light", icon: <SunIcon className="size-4" /> },
	{ label: "Dark", value: "dark", icon: <MoonIcon className="size-4" /> },
] as const;

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

	const [open, setOpen] = useState(false);

	const current = themes.find((t) => t.value === theme);

	return (
		<div className="relative inline-block text-left">
			<button
				className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md hover:bg-muted/80 transition"
				type="button"
				onClick={() => setOpen((prev) => !prev)}
			>
				{current?.icon}

				<span className="capitalize text-sm">{current?.label}</span>

				<ChevronDownIcon className="size-4 ml-1" />
			</button>

			{open && (
				<div className="absolute z-50 mt-2 p-1 w-max bg-white dark:bg-zinc-900 border border-border rounded-md shadow-lg">
					{themes.map((item) => (
						<button
							className={cn(
								"w-full px-4 py-2 flex items-center gap-2 text-sm hover:bg-muted/50 transition text-left rounded",
								{
									"bg-gray-800 text-white":
										theme === item.value,
								},
							)}
							type="button"
							key={item.value}
							onClick={() => {
                                toggleTheme(item.value);

								setOpen(false);
							}}
						>
							{item.icon}

							{item.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default ThemeToggle;
