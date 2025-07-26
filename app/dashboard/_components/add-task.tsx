import FormInput from "@/components/form/input";
import Button from "@/components/form/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUserTasks } from "@/hooks/use-user-tasks";
import successToast from "@/utils/success-toast";
import { cn } from "@/utils/cn";

const taskSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(2, "Task description is required"),
	status: z.enum(["pending", "completed"]),
	dueDate: z
		.string()
		.refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
	priority: z.enum(["low", "medium", "high"]),
});

type TaskInput = z.infer<typeof taskSchema>;

const AddTask = () => {
	const { addTask, rehydrateStore } = useUserTasks();

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

	const createTask = (data: TaskInput) => {
		addTask(data);

		reset();

		rehydrateStore();

		successToast({
			header: "Task Added",
			message: "New task added successfully.",
		});
	};

	return (
		<form
			className="grid gap-6"
			onSubmit={handleSubmit(createTask)}
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
	);
};

export default AddTask;
