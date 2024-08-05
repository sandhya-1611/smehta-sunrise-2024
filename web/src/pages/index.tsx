import { useEffect, useState } from "react";
import Task from "@/model/Task";
import { initializeTasks, getActiveTasks, getCompletedTasks, getAllTasks, completeTask, deleteTask, updateTask, createTask } from "@/modules/taskManager";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Badge,
  Grid
} from '@mui/material';

export default function Home() {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [toDoTasks, setToDoTasks] = useState<Task[]>([]);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
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
      setIsUpdateModalVisible(false);
      updateTasks();
    }
  };

  const handleCancelUpdate = () => {
    setIsUpdateModalVisible(false);
  };

  const handleShowCreateModal = () => {
    setForm({
      title: "",
      description: "",
      persona: "",
      group: ""
    });
    setIsCreateModalVisible(true);
  };

  const handleCreateTask = () => {
    const group = parseInt(form.group);
    if (group <= 0) {
      alert('Group must be a positive number');
      return;
    }

    createTask(form.title, form.description, form.persona, group);
    setIsCreateModalVisible(false);
    updateTasks();
  };

  const handleCancelCreate = () => {
    setIsCreateModalVisible(false);
  };

  return (
    <Container maxWidth="lg" >
      <Box sx={{ bgcolor: 'lavender', minHeight: '100vh' ,width:'100%'}}>
        <Box sx={{ bgcolor: 'lavender', p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ color: 'black', fontWeight: 'bold' }}>
            Taskboard
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
            onClick={handleShowCreateModal}
          >
            Create Task
          </Button>
        </Box>
        <Grid container spacing={2} sx={{ p: 4 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ bgcolor: '#E8F7F4', p: 2, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6" component="h2" sx={{ mb: 2, color: 'black' }}>
                To Do
                <Badge sx={{ ml: 2, mt: 1.5}}badgeContent={toDoTasks.length} color="error">
                <Typography variant="body2" sx={{ mb: 2, color: 'black' }}>
                </Typography>
              </Badge>
              </Typography>
              
              {toDoTasks.map(task => (
                <Card key={task.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" component="h3" sx={{ color: 'black' }}>
                      Task {task.id}: {task.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'black' }}>
                      {task.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleShowUpdateModal(task)}
                      >
                        Update
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
          <Grid  item xs={12} md={4} >
          <Box sx={{ bgcolor: '#E8F7F4', p: 2, borderRadius: 2, boxShadow: 3 }}>

              <Typography variant="h6" component="h2" sx={{ mb: 2, color: 'black' }}>
                In Progress
                <Badge sx={{ mt: -0.5, ml:2}} badgeContent={inProgressTasks.length} color="primary">
              </Badge>
              </Typography>
              
              {inProgressTasks.map(task => (
                <Card key={task.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" component="h3" sx={{ color: 'black' }}>
                      Task {task.id}: {task.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'black' }}>
                      {task.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleCompleteTask(task.title)}
                      >
                        Done
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleShowUpdateModal(task)}
                      >
                        Update
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ bgcolor: '#E8F7F4', p: 2, borderRadius: 2, boxShadow: 3 }}>
              <Typography variant="h6" component="h2" sx={{ mb: 2, color: 'black' }}>
                Completed
                <Badge sx={{ mt: -0.5, ml:2}} badgeContent={completedTasks.length} color="success">
              </Badge>
              </Typography>
              
              {completedTasks.map(task => (
                <Card key={task.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" component="h3" sx={{ color: 'black' }}>
                      Task {task.id}: {task.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'black' }}>
                      {task.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Update Task Modal */}
      <Dialog open={isUpdateModalVisible} onClose={handleCancelUpdate}>
        <DialogTitle>Update Task</DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateTask(); }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
                        <TextField
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              required
            />
            <TextField
              label="Persona"
              value={form.persona}
              onChange={(e) => setForm({ ...form, persona: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Group"
              type="number"
              value={form.group}
              onChange={(e) => setForm({ ...form, group: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpdate} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateTask} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Task Modal */}
      <Dialog open={isCreateModalVisible} onClose={handleCancelCreate}>
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => { e.preventDefault(); handleCreateTask(); }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              required
            />
            <TextField
              label="Persona"
              value={form.persona}
              onChange={(e) => setForm({ ...form, persona: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Group"
              type="number"
              value={form.group}
              onChange={(e) => setForm({ ...form, group: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelCreate} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateTask} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

             

