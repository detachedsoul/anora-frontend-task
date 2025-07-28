import FormInput from "@/components/form/input";
import Button from "@/components/form/button";
import errorToast from "@/utils/error-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Task, useUserTasks } from "@/hooks/use-user-tasks";
import { cn } from "@/utils/cn";
import { XIcon } from "lucide-react";
import { useEffect } from "react";

const taskSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(2, "Task description is required"),
	status: z.enum(["pending", "completed"]),
	dueDate: z.string().refine(
		(val) => {
			const selectedDate = new Date(val);

			const today = new Date();

			selectedDate.setHours(0, 0, 0, 0);

			today.setHours(0, 0, 0, 0);

			return selectedDate >= today;
		},
		{ message: "Due date cannot be in the past" },
	),
	priority: z.enum(["low", "medium", "high"]),
});

type TaskInput = z.infer<typeof taskSchema>;

const AddTask = ({
	isModalActive,
	setIsModalActive,
	taskToEdit,
}: {
	isModalActive: boolean;
	setIsModalActive: React.Dispatch<React.SetStateAction<boolean>>;
	taskToEdit?: Task;
}) => {
	const { addTask, updateTask, rehydrateStore } = useUserTasks();

	const {
		register,
		reset,
		formState: { errors, isValid },
		handleSubmit,
		watch,
	} = useForm<TaskInput>({
		resolver: zodResolver(taskSchema),
		mode: "onChange",
		defaultValues: {
			title: "",
			description: "",
			status: "pending",
			dueDate: "",
			priority: "low",
		},
	});

    const isEditing = Boolean(taskToEdit);

	useEffect(() => {
		if (taskToEdit) {
			reset(taskToEdit);
		}
	}, [taskToEdit, reset]);

	const handleForm = (data: TaskInput) => {
        if (isEditing) {
            if (!taskToEdit?.id) {
                errorToast({
                    header: "Missing Parameters",
                    message: "Please pass in a valid ID"
                });
            }

			updateTask(taskToEdit?.id ?? "", data);
		} else {
			addTask(data);
		}

		reset();

		setIsModalActive(false);

		rehydrateStore();
	};


	return (
		<div
			className={cn(
				"fixed max-h-[90dvh] h-[90dvh] bg-slate-300 overflow-y-auto dark:bg-gray-950 border border-gray-950 w-[calc((100%-2rem)+0.25rem)] rounded-t-lg px-4 pb-4 pt-2 outline outline-offset-4 outline-double outline-gray-800 transition-all duration-300 ease-in-out md:w-[calc((80%-2rem)+0.25rem)] lg:w-[calc((50%-2rem)+0.25rem)] flex flex-col gap-10 custom-scrollbar z-[9999]",
				{
					"bottom-0": isModalActive,
					"-bottom-full": !isModalActive,
				},
			)}
		>
			<div className="ml-auto sticky top-0 -mr-2 bg-slate-400 dark:bg-gray-800 z-50 rounded-full grid place-content-center">
				<button
					className="bg-slate-400 text-white dark:bg-gray-800 p-1 rounded-full"
					type="button"
					onClick={() => setIsModalActive(false)}
					aria-label="Close modal"
				>
					<XIcon
						strokeWidth={1.2}
						size={18}
					/>
				</button>
			</div>

			<form
				className="grid gap-6"
				onSubmit={handleSubmit(handleForm)}
			>
				<label
					className="grid gap-2"
					htmlFor="title"
				>
					<span className="header">Title</span>

					<FormInput
						type="text"
						placeholder="Enter title"
						{...register("title")}
						error={errors?.title?.message}
					/>
				</label>

				<label
					className="grid gap-2"
					htmlFor="description"
				>
					<span className="header">Description</span>

					<textarea
						className={cn("input", {
							"border-brand-red": errors?.description?.message,
						})}
						id="description"
						placeholder="Enter task description"
						{...register("description")}
						rows={3}
					></textarea>

					{errors && (
						<p className="text-brand-red text-sm">
							{errors?.description?.message}
						</p>
					)}
				</label>

				<label
					htmlFor="dueDate"
					className="grid gap-2"
				>
					<span className="header">Due Date</span>

					<FormInput
						className="date-input"
						placeholder="Enter due date"
						{...register("dueDate")}
						type="date"
						error={errors?.dueDate?.message}
					/>
				</label>

				<label
					htmlFor="status"
					className="grid gap-2"
				>
					<span className="header">Status</span>

					<select
						className="select-input"
						id="status"
						{...register("status")}
						defaultValue={watch("status")}
					>
						<option value="pending">Pending</option>
						<option value="completed">Completed</option>
					</select>
				</label>

				<label
					htmlFor="priority"
					className="grid gap-2"
				>
					<span className="header">Priority</span>

					<select
						className="select-input"
						id="priority"
						{...register("priority")}
						defaultValue={watch("priority")}
					>
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
					</select>
				</label>

				<Button
					type="submit"
					disabled={!isValid}
				>
					Add Task
				</Button>
			</form>
		</div>
	);
};

export default AddTask;
