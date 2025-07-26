"use client";

import Loader from "../loading";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { useUserTasks } from "@/hooks/use-user-tasks";
import { redirect } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode; }) => {
    const isHydrated = useHasHydrated();

	const store = useUserTasks();

	if (!isHydrated) return <Loader />;

	const { currentUser } = store;

	if (isHydrated && !currentUser) {
		redirect("/");
    }

    return (
        <main className="p-4 md:w-4/5 md:mx-auto lg:w-1/2">
            {children}
        </main>
    );
};

export default Layout;
