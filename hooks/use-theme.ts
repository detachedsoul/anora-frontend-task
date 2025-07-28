import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	resolvedTheme: "light" | "dark";
}

export const useTheme = create<ThemeState>()(
	persist(
		(set, get) => ({
			theme: "system",
			setTheme: (theme) => {
				set({ theme });
                const root = document.documentElement;

				const resolved =
					theme === "system"
						? window.matchMedia("(prefers-color-scheme: dark)")
								.matches
							? "dark"
							: "light"
						: theme;

                root.classList.remove("light", "dark");

				root.classList.add(resolved);
			},
			get resolvedTheme() {
                const current = get().theme;

				return current === "system"
					? window.matchMedia("(prefers-color-scheme: dark)").matches
						? "dark"
						: "light"
					: current;
			},
		}),
		{
			name: "theme-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
