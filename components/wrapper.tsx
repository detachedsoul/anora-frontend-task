"use client";

import Loader from "@/app/loading";
import useTheme from "@/hooks/use-theme";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { useEffect } from "react";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
	const isHydrated = useHasHydrated();

    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
		if (isHydrated) {
            toggleTheme(theme);
        }
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [theme, isHydrated]);

	if (!isHydrated) return <Loader />;

	return <div>{children}</div>;
};

export default Wrapper;
