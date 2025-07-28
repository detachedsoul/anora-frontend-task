import { useEffect, useState } from "react";

const useTheme = () => {
	const [theme, setTheme] = useState<string>("light");

	useEffect(() => {
		if (
			localStorage.theme === "dark" ||
			(!("theme" in localStorage) &&
				window.matchMedia("(prefers-color-scheme: dark)").matches)
		) {
			document.documentElement.classList.add("dark");

			localStorage.setItem("theme", "dark");

			setTheme("dark");
		} else {
			document.documentElement.classList.add("light");

			localStorage.setItem("theme", "light");

			setTheme("light");
		}
	}, []);

	const toggleTheme = (newTheme: string) => {
		document.documentElement.classList.replace(theme, newTheme);

		localStorage.setItem("theme", newTheme);

		setTheme(newTheme);
	};

	return {
		theme,
		toggleTheme,
	};
};

export default useTheme;
