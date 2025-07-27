import TaskList from "./_components/task-list";

const Tasks = () => {
    return (
		<section className="grid gap-10 items-start">
			<section className="sticky top-0 pt-4 pb-2 bg-[#f9fafb] text-[#111827] dark:bg-gray-950 dark:text-[#f8fafc] z-[9999]">
				<h1 className="header text-2xl">Task List</h1>
			</section>

			<TaskList />
		</section>
	);
};

export default Tasks;
