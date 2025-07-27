"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import TaskFilterTabs from "./task-filter-tabs";
import AddTask from "@/app/dashboard/_components/add-task";
import { Task, useUserTasks } from "@/hooks/use-user-tasks";
import { formatDate } from "@/utils/format-date";
import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";

import {
	DndContext,
	closestCenter,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	rectSortingStrategy,
	arrayMove,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const getPriorityStyles = (priority: string) => {
	switch (priority) {
		case "high":
			return "bg-rose-500 text-white";
		case "medium":
			return "bg-amber-500 text-white";
		case "low":
			return "bg-gray-500 text-white";
		default:
			return "bg-gray-300 text-gray-800";
	}
};

const getStatusStyles = (status: string) => {
	return status === "completed"
		? "bg-brand-green text-white"
		: "bg-yellow-400 text-black";
};

const SortableTask = ({
	task,
	onEdit,
	onToggleStatus,
	onDelete,
}: {
	task: Task;
	onEdit: () => void;
	onToggleStatus: () => void;
	onDelete: () => void;
}) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: task.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm transition hover:shadow-md grid gap-4 cursor-grab active:cursor-grabbing"
		>
			<div className="flex items-center justify-between">
				<h2 className="text-base header text-[#111827]">
					{task.title}
				</h2>

				<div className="flex gap-2">
					<span
						className={cn(
							"text-xs px-2 py-1 rounded-full capitalize font-medium",
							getPriorityStyles(task.priority),
						)}
					>
						{task.priority}
					</span>

					<span
						className={cn(
							"text-xs px-2 py-1 rounded-full font-medium",
							getStatusStyles(task.status),
						)}
					>
						{task.status === "completed" ? "Completed" : "Pending"}
					</span>
				</div>
			</div>

			<p className="text-sm text-[#111827]">{task.description}</p>

			<div className="flex justify-between text-xs text-gray-500 flex-wrap gap-2">
				<span>
					Created:{" "}
					{formatDate(
						new Date(task.createdAt),
						"ddd, MMM Do, YYYY - h:mm A",
					)}
				</span>

				<span>
					Due:{" "}
					{formatDate(new Date(task.dueDate), "ddd, MMM Do, YYYY")}
				</span>
			</div>

			<div className="flex gap-2 mt-2 flex-wrap">
				<button
					className="text-xs px-3 py-1 rounded-full border transition border-blue-500 text-blue-600 hover:bg-blue-50"
					type="button"
					onClick={onEdit}
				>
					Edit
                </button>

				<button
					className={cn(
						"text-xs px-3 py-1 rounded-full border transition",
						task.status !== "completed"
							? "border-green-500 text-green-600 hover:bg-green-50"
							: "border-yellow-500 text-yellow-600 hover:bg-yellow-50",
					)}
					type="button"
					onClick={onToggleStatus}
				>
					{task.status === "completed"
						? "Mark as Pending"
						: "Mark as Completed"}
				</button>

				<button
					className="text-xs px-3 py-1 rounded-full border transition border-red-500 text-red-600 hover:bg-red-50"
					type="button"
					onClick={onDelete}
				>
					Delete
				</button>
			</div>
		</div>
	);
};

const TaskList = () => {
	const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
	const [isModalActive, setIsModalActive] = useState(false);

    const { deleteTask, toggleTaskStatus } = useUserTasks();

    const setFilterKey = useUserTasks((state) => state.setFilterKey);

    const filterKey = useUserTasks((state) => state.filterKey);

    const filterTasks = useUserTasks((state) => state.filterTasks);

    const tasks = useUserTasks((s) => s.filteredTasks);

	const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),

		useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
	);

	const [reorderedTasks, setReorderedTasks] = useState<Task[]>(tasks);

	useEffect(() => {
        setReorderedTasks(tasks);
	}, [tasks]);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = reorderedTasks.findIndex((t) => t.id === active.id);
		const newIndex = reorderedTasks.findIndex((t) => t.id === over.id);

        const newOrder = arrayMove(reorderedTasks, oldIndex, newIndex);

		setReorderedTasks(newOrder);
	};

	return (
		<div className="grid gap-8 relative">
			<TaskFilterTabs
				filterKey={filterKey}
				setFilterKey={setFilterKey}
				filterTasks={(key) => filterTasks(key) ?? []}
			/>

			{reorderedTasks.length === 0 ? (
				<p className="text-brand-red text-center mt-10">
					No tasks found for this filter.
				</p>
			) : (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={reorderedTasks.map((task) => task.id)}
						strategy={rectSortingStrategy}
					>
						<div className="grid gap-4 md:grid-cols-2">
							{reorderedTasks.map((task) => (
								<SortableTask
									key={task.id}
									task={task}
									onEdit={() => {
										setTaskToEdit(task);
										setIsModalActive(true);
									}}
									onToggleStatus={() =>
										toggleTaskStatus(task.id)
									}
									onDelete={() => deleteTask(task.id)}
								/>
							))}
						</div>
					</SortableContext>
				</DndContext>
			)}

			<AddTask
				isModalActive={isModalActive}
				setIsModalActive={setIsModalActive}
				taskToEdit={taskToEdit}
			/>
		</div>
	);
};

export default TaskList;
