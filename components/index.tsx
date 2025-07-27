"use client";

import FormInput from "./form/input";
import Button from "./form/button";
import successToast from "@/utils/success-toast";
import Loader from "@/app/loading";
import { z } from "zod";
import { UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserTasks } from "@/hooks/use-user-tasks";
import { useRouter, redirect } from "next/navigation";
import { useHasHydrated } from "@/hooks/use-has-hydrated";

const formSchema = z.object({
	name: z.string().min(2, "Please enter your name"),
});

const Index = () => {
	const isHydrated = useHasHydrated();

	const store = useUserTasks();

	const { replace } = useRouter();

	const {
		register,
		formState: { isValid, errors },
		getValues,
	} = useForm({
		resolver: zodResolver(formSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
		},
	});

	if (!isHydrated) return <Loader />;

    const { currentUser, setUserName, setCurrentUser } = store;

	const createUser = () => {
		const name = getValues("name");

        successToast({
			header: "Registration Successful",
			message: "Logged in successfully.",
		});

		setUserName(name);
		setCurrentUser(name);

        replace("/dashboard");
    };

    if (currentUser) {
		redirect("/dashboard");
	}

	return (
		<form className="flex flex-col place-content-center w-full gap-8 min-h-dvh h-dvh max-md:p-4 md:w-1/3 md:mx-auto">
			<div className="text-center grid gap-1">
				<h1 className="header text-xl md:text-3xl">
					Welcome to Taskify 👋
				</h1>

				<p className="md:text-lg font-medium">
					Enter your name to continue
				</p>
			</div>

			<div className="grid gap-6">
				<label
					className="grid gap-1.5"
					htmlFor="name"
				>
					<span className="header">
						Enter Your Name{" "}
						<span className="text-brand-red">*</span>
					</span>

					<div className="flex gap-3 items-center bg-gray-900 border border-gray-900 rounded-lg pl-3 focus-within:outline focus-within:outline-offset-3 focus-within:outline-gray-800 group">
						<UserIcon strokeWidth={1.2} />

						<FormInput
							className="input bg-transparent rounded-l-none pl-0 focus:outline-none"
							type="text"
							placeholder="Enter your name"
							id="name"
							{...register("name")}
						/>
					</div>

					{errors && (
						<p className="text-brand-red text-sm">
							{errors?.name?.message}
						</p>
					)}
				</label>

				<Button
					disabled={!isValid}
					onClick={() => createUser()}
				>
					Continue
				</Button>
			</div>
		</form>
	);
};

export default Index;
