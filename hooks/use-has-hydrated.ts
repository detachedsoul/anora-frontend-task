import { useEffect, useState } from "react";
import { useUserTasks } from "./use-user-tasks";

export const useHasHydrated = () => {
    const [hasHydrated, setHasHydrated] = useState(false);

	const {
		rehydrateStore,
	} = useUserTasks((state) => state);

	useEffect(() => {
        if (typeof window !== "undefined") {
            setHasHydrated(true);
        }
	}, []);

    useEffect(() => {
		if (hasHydrated && typeof window !== "undefined") {
			rehydrateStore();
		}
	}, [hasHydrated, rehydrateStore]);

	return hasHydrated;
};
