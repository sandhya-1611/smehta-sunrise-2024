import { useEffect, useState } from "react";
import Task from "@/model/Task";
import { initializeTasks, getActiveTasks, getCompletedTasks, getAllTasks, completeTask, deleteTask, updateTask, createTask } from "@/modules/taskManager";

export default function Home() {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [toDoTasks, setToDoTasks] = useState<Task[]>([]);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isModalOpen,setIsModalOpen] = useState<Boolean>(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    persona: "",
    group: ""
  });

  useEffect(() => {
    initializeTasks();
    updateTasks();
  }, []);

  const updateTasks = () => {
    setCompletedTasks(getCompletedTasks());
    setInProgressTasks(getActiveTasks());
    setToDoTasks(getAllTasks().filter(task => !task.completed && !getActiveTasks().includes(task)));
  };

  const handleCompleteTask = (taskTitle: string) => {
    completeTask(taskTitle);
    updateTasks();
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTask(taskId);
    updateTasks();
  };

  const handleShowUpdateModal = (task: Task) => {
    setSelectedTask(task);
    setForm({
      title: task.title,
      description: task.description,
      persona: task.persona,
      group: task.group.toString()
    });
    setIsModalOpen(true);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateTask = () => {
    if (selectedTask) {
      const group = parseInt(form.group);
      if (group <= 0) {
        alert('Group must be a positive number');
        return;
      }

      updateTask(selectedTask.id, {
        title: form.title,
        description: form.description,
        persona: form.persona,
        group: group
      });
      setIsModalOpen(false);
      setIsUpdateModalVisible(false);
      updateTasks();
    }
  };

  const handleCancelUpdate = () => {
    setIsModalOpen(false);
    if(isUpdateModalVisible){
    setIsUpdateModalVisible(false);
    }
    else{
      setIsCreateModalVisible(false);
    }
  };

  const handleShowCreateModal = () => {
    setForm({
      title: "",
      description: "",
      persona: "",
      group: ""
    });
    setIsModalOpen(true);
    setIsCreateModalVisible(true);
  };

  const handleCreateTask = () => {
    const group = parseInt(form.group);
    if (group <= 0) {
      alert('Group must be a positive number');
      return;
    }

    createTask(form.title, form.description, form.persona, group);
    setIsModalOpen(false);
    setIsCreateModalVisible(false);
    updateTasks();
  };

  return (
    <div className="min-h-screen bg-purple-100">
      <header className="bg-lavender p-6 text-center ">
        <h1 className="text-black text-4xl font-bold">Taskboard</h1>
          <button
            className="mt-4 bg-green-400 text-white py-3 px-6 text-lg font-bold rounded-xl hover:bg-green-600"
            onClick={handleShowCreateModal}
          >
            Create Task
          </button>
      </header>
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <section className="bg-[#E8F7F4] p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2 text-black">To Do</h2>
            <div className="flex items-center mb-4">
              <span className="bg-red-500 text-white py-1 px-2 rounded-full text-xs font-bold">{toDoTasks.length}</span>
            </div>
            {toDoTasks.map(task => (
              <div key={task.id} className="bg-white p-4 mb-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-black">Task {task.id}: {task.title}</h3>
                <p className="mb-4 text-black">{task.description}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400"
                    onClick={() => handleCompleteTask(task.title)}
                  >
                    Done
                  </button>
                  <button
                    className="bg-red-400 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-400 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    onClick={() => handleShowUpdateModal(task)}
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </section>
          <section className="bg-[#E8F7F4] p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2 text-black">In Progress</h2>
            <div className="flex items-center mb-4">
              <span className="bg-blue-500 text-white py-1 px-2 rounded-full text-xs font-bold">{inProgressTasks.length}</span>
            </div>
            {inProgressTasks.map(task => (
              <div key={task.id} className="bg-white p-4 mb-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-black">Task {task.id}: {task.title}</h3>
                <p className="mb-4 text-black">{task.description}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    className="bg-blue-400 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    onClick={() => handleCompleteTask(task.title)}
                  >
                    Done
                  </button>
                  <button
                    className="bg-red-400 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                    onClick={() => handleShowUpdateModal(task)}
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </section>
          <section className="bg-[#E8F7F4] p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2 text-black">Completed</h2>
            <div className="flex items-center mb-4">
              <span className="bg-green-500 text-white py-1 px-2 rounded-full text-xs font-bold">{completedTasks.length}</span>
            </div>
            {completedTasks.map(task => (
              <div key={task.id} className="bg-white p-4 mb-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-black">Task {task.id}: {task.title}</h3>
                <p className="mb-4 text-black">{task.description}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    className="bg-red-400 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4 text-black">{isUpdateModalVisible ?  "Update Task" : "Create Task"}</h2>
            <form onSubmit={isUpdateModalVisible ? handleUpdateTask : handleCreateTask}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-black">Title</label>
                <input
                  type="text"
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-black">Description</label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="persona" className="block text-sm font-medium text-black">Persona</label>
                <input
                  type="text"
                  id="persona"
                  value={form.persona}
                  onChange={(e) => setForm({ ...form, persona: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="group" className="block text-sm font-medium text-black">Group</label>
                <input
                  type="number"
                  id="group"
                  value={form.group}
                  onChange={(e) => setForm({ ...form, group: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCancelUpdate}
                  className="bg-gray-300 text-black py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                  {isUpdateModalVisible ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


