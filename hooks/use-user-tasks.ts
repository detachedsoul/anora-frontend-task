import errorToast from "@/utils/error-toast";
import successToast from "@/utils/success-toast";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { nanoid } from "nanoid";

type TaskStatus = "pending" | "completed";
type TaskPriority = "low" | "medium" | "high";

export interface Task {
	id: string;
	title: string;
	description: string;
	status: TaskStatus;
	dueDate: string;
	createdAt: string;
	priority: TaskPriority;
}

export interface UserTask {
	name: string;
	tasks: Task[];
}

type SortBy = "priority" | "dueDate";
export type FilterBy =
	| "all"
	| "completed"
	| "pending"
	| "low"
	| "high"
	| "medium"
	| "overdue"
	| "upcoming";

interface GroupedTasks {
	today: Task[];
	upcoming: Task[];
	overdue: Task[];
}

interface UserTaskStore {
	users: UserTask[];
	currentUser: string | null;
	searchQuery: string;
	filteredTasks: Task[];
	filterKey: FilterBy;
	currentFilter: FilterBy;

	setUserName: (name: string) => void;
	setCurrentUser: (name: string) => void;
	addTask: (task: Omit<Task, "id" | "createdAt">) => void;
	updateTask: (taskId: string, updates: Partial<Task>) => void;
	deleteTask: (taskId: string) => void;
	clearAllTasks: () => void;
	clearStorage: () => void;
	logoutCurrentUser: () => void;
	updateFilteredTasks: () => void;
	setSearchQuery: (query: string) => void;
	toggleTaskStatus: (taskId: string) => void;

	setFilteredTasks: (tasks: Task[]) => void;
	setFilterKey: (key: FilterBy) => void;

	getUserNames: () => string[];
	getUser: () => UserTask | undefined;
	getTasks: (sortBy?: SortBy) => Task[] | undefined;
	filterTasks: (filter: FilterBy, taskList?: Task[]) => Task[] | undefined;
	searchTasks: (query: string, taskList?: Task[]) => Task[] | undefined;
	groupTasksByTime: () => GroupedTasks;

	rehydrateStore: () => void;
}

const priorityOrder: Record<TaskPriority, number> = {
	high: 1,
	medium: 2,
	low: 3,
};

export const useUserTasks = create<UserTaskStore>()(
	persist(
		(set, get) => ({
			users: [],
			currentUser: null,
			currentFilter: "all",
			filteredTasks: [],
			filterKey: "all",
			searchQuery: "",

			updateFilteredTasks: () => {
				const {
					filterKey,
					searchQuery,
					filterTasks,
					searchTasks,
					getTasks,
				} = get();
                const filtered = filterTasks(filterKey, getTasks());

				const searched = searchQuery
					? searchTasks(searchQuery, filtered)
                    : filtered;

				set({ filteredTasks: searched ?? [] });
			},

			setSearchQuery: (query: string) => {
				set({ searchQuery: query });

				get().updateFilteredTasks();
			},

			setUserName: (name) => {
				set((state) => {
					if (state.users.find((u) => u.name === name)) return state;

					return { users: [...state.users, { name, tasks: [] }] };
				});
			},

			setCurrentUser: (name) => {
				const exists = get().users.some((u) => u.name === name);

				if (exists) set({ currentUser: name });
			},

			setFilterKey: (key) => {
				set({ filterKey: key });

				get().updateFilteredTasks();
			},

			setFilteredTasks: (tasks) => set({ filteredTasks: tasks }),

			addTask: (task) => {
				const name = get().currentUser;
				if (!name) return;

				set((state) => {
					const users = state.users.map((user) => {
						if (user.name !== name) return user;

						const newTask: Task = {
							...task,
							id: nanoid(),
							createdAt: new Date().toISOString(),
						};

						successToast({
							header: "Task Added Successfully",
							message: "New task has been added successfully.",
						});

						return { ...user, tasks: [...user.tasks, newTask] };
					});

					const updatedUser = users.find((u) => u.name === name);

					const filtered = get().filterTasks(
						get().filterKey,
						updatedUser?.tasks ?? [],
					);

					get().setFilteredTasks(filtered ?? []);

					return { users };
				});
			},

			updateTask: (taskId, updates) => {
				const name = get().currentUser;
				if (!name) {
					errorToast({
						header: "Not Authorized",
						message: "Invalid User.",
					});
					return;
				}

				set((state) => {
					const users = state.users.map((user) => {
						if (user.name !== name) return user;

						const taskExists = user.tasks.some(
							(task) => task.id === taskId,
						);
						if (!taskExists) {
							errorToast({
								header: "Invalid ID",
								message: "No task found with the given ID.",
							});
							return user;
						}

						const updatedTasks = user.tasks.map((task) =>
							task.id === taskId ? { ...task, ...updates } : task,
						);

						successToast({
							header: "Updated Successfully",
							message: "Task updated successfully.",
						});

						return { ...user, tasks: updatedTasks };
					});

					const updatedUser = users.find((u) => u.name === name);

					const filtered = get().filterTasks(
						get().filterKey,
						updatedUser?.tasks ?? [],
					);

					get().setFilteredTasks(filtered ?? []);

					return { users };
				});
			},

			deleteTask: (taskId) => {
				const name = get().currentUser;
				if (!name) {
					errorToast({
						header: "Not Authorized",
						message: "Invalid User.",
					});
					return;
				}

				set((state) => {
					const users = state.users.map((user) => {
						if (user.name !== name) return user;

						const taskExists = user.tasks.some(
							(task) => task.id === taskId,
						);
						if (!taskExists) {
							errorToast({
								header: "Invalid ID",
								message: "No task found with the given ID.",
							});
							return user;
						}

						const updatedTasks = user.tasks.filter(
							(task) => task.id !== taskId,
						);

						successToast({
							header: "Deletion Successful",
							message: "Task deleted successfully.",
						});

						return { ...user, tasks: updatedTasks };
					});

					const updatedUser = users.find((u) => u.name === name);

					const filtered = get().filterTasks(
						get().filterKey,
						updatedUser?.tasks ?? [],
					);

					get().setFilteredTasks(filtered ?? []);

					return { users };
				});
			},

			toggleTaskStatus: (taskId) => {
				const name = get().currentUser;
				if (!name) {
					errorToast({
						header: "Not Authorized",
						message: "Invalid User.",
					});
					return;
				}

				set((state) => {
					const users = state.users.map((user) => {
						if (user.name !== name) return user;

						const taskExists = user.tasks.some(
							(task) => task.id === taskId,
						);

						if (!taskExists) {
							errorToast({
								header: "Invalid ID",
								message: "Please pass in the correct ID",
							});

							return user;
						}

						const updatedTasks = user.tasks.map((task) => {
							if (task.id !== taskId) return task;

							const newStatus: TaskStatus =
								task.status === "pending"
									? "completed"
									: "pending";

							return {
								...task,
								status: newStatus,
							};
						});

						successToast({
							header: "Task Status Changed",
							message: "Task status changed successfully.",
						});

						return {
							...user,
							tasks: updatedTasks,
						};
					});

					return { users };
				});

				get().updateFilteredTasks();
			},

			filterTasks: (filter, taskList) => {
				const tasks = taskList ?? get().getTasks();
				if (!tasks) return;

				switch (filter) {
					case "completed":
						return tasks.filter((t) => t.status === "completed");
					case "pending":
						return tasks.filter((t) => t.status === "pending");
					case "low":
					case "medium":
					case "high":
						return tasks.filter((t) => t.priority === filter);
					case "overdue":
						return get().groupTasksByTime().overdue;
					case "upcoming":
						return get().groupTasksByTime().upcoming;
					default:
						return tasks;
				}
			},

			clearAllTasks: () => {
				const name = get().currentUser;
				if (!name) return;

				set((state) => {
					const users = state.users.map((user) =>
						user.name === name ? { ...user, tasks: [] } : user,
					);
					return { users };
				});
			},

			clearStorage: () => {
				if (typeof window !== "undefined") {
					localStorage.removeItem("user-task-store");
				}

				set({ users: [], currentUser: null });
			},

			getUserNames: () => get().users.map((u) => u.name),

			getUser: () => {
				const name = get().currentUser;

				return get().users.find((u) => u.name === name);
			},

			getTasks: (sortBy) => {
				const user = get().getUser();
				if (!user) return;

				const tasks = [...user.tasks];

				if (sortBy === "priority") {
					return tasks.sort(
						(a, b) =>
							priorityOrder[a.priority] -
							priorityOrder[b.priority],
					);
				}

				if (sortBy === "dueDate") {
					return tasks.sort(
						(a, b) =>
							new Date(a.dueDate).getTime() -
							new Date(b.dueDate).getTime(),
					);
				}

				return tasks;
			},

			logoutCurrentUser: () => set({ currentUser: null }),

			searchTasks: (query, taskList) => {
				const tasks = taskList ?? get().getTasks();
				if (!tasks) return [];

				const lower = query.toLowerCase();

				return tasks.filter(
					(task) =>
						task.title.toLowerCase().includes(lower) ||
						task.description.toLowerCase().includes(lower),
				);
			},

			groupTasksByTime: () => {
				const tasks = get().getTasks() || [];
				const today = new Date().toISOString().slice(0, 10);
				const now = new Date(today);

				const isToday = (d: string) => d === today;
				const isUpcoming = (d: string) => new Date(d) > now;
				const isOverdue = (d: string) => new Date(d) < now;

				return {
					today: tasks.filter((t) => isToday(t.dueDate)),
					upcoming: tasks.filter((t) => isUpcoming(t.dueDate)),
					overdue: tasks.filter((t) => isOverdue(t.dueDate)),
				};
			},

			rehydrateStore: () => {
				if (typeof window === "undefined") return;

				const rawData = localStorage.getItem("user-task-store");
				if (!rawData) return;

				const parsed = JSON.parse(rawData).state;
				if (parsed) {
					set(() => ({
						users: parsed.users,
						currentUser: parsed.currentUser,
					}));
				}
			},
		}),
		{
			name: "user-task-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
