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
type FilterBy = "all" | "completed" | "pending";

interface GroupedTasks {
	today: Task[];
	upcoming: Task[];
	overdue: Task[];
}

interface UserTaskStore {
	users: UserTask[];
	currentUser: string | null;

	// Actions
	setUserName: (name: string) => void;
	setCurrentUser: (name: string) => void;
	addTask: (task: Omit<Task, "id" | "createdAt">) => void;
	updateTask: (taskId: string, updates: Partial<Task>) => void;
	deleteTask: (taskId: string) => void;
	clearAllTasks: () => void;
	clearStorage: () => void;
	logoutCurrentUser: () => void;

	// Getters
	getUserNames: () => string[];
	getUser: () => UserTask | undefined;
	getTasks: (sortBy?: SortBy) => Task[] | undefined;
	filterTasks: (filter: FilterBy) => Task[] | undefined;
	searchTasks: (query: string) => Task[] | undefined;
	groupTasksByTime: () => GroupedTasks;

	// Rehydrate store after the component mounts
	rehydrateStore: () => void
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

			setUserName: (name) =>
				set((state) => {
					if (state.users.find((u) => u.name === name)) return state;

					return { users: [...state.users, { name, tasks: [] }] };
				}),

			setCurrentUser: (name) => {
				const exists = get().users.some((u) => u.name === name);

				if (exists) set({ currentUser: name });
			},

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

						return { ...user, tasks: [...user.tasks, newTask] };
					});

					return { users };
				});
			},

			updateTask: (taskId, updates) => {
				const name = get().currentUser;
				if (!name) return;

				set((state) => {
					const users = state.users.map((user) => {
						if (user.name !== name) return user;

						const tasks = user.tasks.map((task) =>
							task.id === taskId ? { ...task, ...updates } : task,
						);

						return { ...user, tasks };
					});

					return { users };
				});
			},

			deleteTask: (taskId) => {
				const name = get().currentUser;
				if (!name) return;

				set((state) => {
					const users = state.users.map((user) => {
						if (user.name !== name) return user;

						const tasks = user.tasks.filter(
							(task) => task.id !== taskId,
						);

						return { ...user, tasks };
					});

					return { users };
				});
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

			filterTasks: (filter) => {
				const tasks = get().getTasks();
				if (!tasks) return;

				if (filter === "completed")
					return tasks.filter((t) => t.status === "completed");
				if (filter === "pending")
					return tasks.filter((t) => t.status === "pending");

				return tasks;
			},

			searchTasks: (query) => {
				const tasks = get().getTasks();
				if (!tasks) return;

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
			skipHydration: true,
			storage: createJSONStorage(() => localStorage),
		},
	),
);
