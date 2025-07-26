import { useEffect, useState } from "react";
import { useUserTasks } from "./use-user-tasks";

export const useHasHydrated = () => {
    const [hasHydrated, setHasHydrated] = useState(false);

	const {
		rehydrateStore,
	} = useUserTasks((state) => state);

	useEffect(() => {
		setHasHydrated(true);
	}, []);

    useEffect(() => {
		if (hasHydrated) {
			rehydrateStore();
		}
	}, [hasHydrated, rehydrateStore]);

	return hasHydrated;
};
