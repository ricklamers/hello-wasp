import React, { useState } from "react";

import getTasks from "@wasp/queries/getTasks";
import createTask from "@wasp/actions/createTask";
import editTask from "@wasp/actions/editTask";
import removeTask from "@wasp/actions/removeTask";
import { useQuery } from "@wasp/queries";
import logout from "@wasp/auth/logout.js";
import Clocks from "./Clocks";

const MainPage = ({ user }) => {
  const { data: tasks, isFetching, error } = useQuery(getTasks);

  return (
    <div>
      <NewTaskForm />

      {tasks && <TasksList tasks={tasks} />}

      {isFetching && "Fetching..."}
      {error && "Error: " + error}

      <div><Clocks /></div>

      <button onClick={logout}> Logout </button>
    </div>
  );
};

const changeTask = async (taskId, isDone) => {
  try {
    await editTask({ taskId, isDone: !isDone });
  } catch (error) {
    console.error(error);
  }
};

const removeTaskHandler = async (taskId) => {
  if(window.confirm("Are you sure you want to remove this task?")) {
    try {
      await removeTask({ taskId });
    } catch (error) {
      console.error(error);
    }
  }
  
};


const Task = (props) => (
  <div>
    <input
      type="checkbox"
      id={props.task.id}
      checked={props.task.isDone}
      onChange={changeTask.bind(this, props.task.id, props.task.isDone)}
    />
    {props.task.description}
    <button onClick={removeTaskHandler.bind(this, props.task.id)}>💣</button>
  </div>
);

const TasksList = (props) => {
  if (!props.tasks?.length) return "No tasks";
  return props.tasks.map((task, idx) => <Task task={task} key={idx} />);
};

const NewTaskForm = () => {
  const defaultDescription = "";
  const [description, setDescription] = useState(defaultDescription);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createTask({ description });
      setDescription(defaultDescription);
    } catch (err) {
      window.alert("Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input type="submit" value="Create task" />
    </form>
  );
};

export default MainPage;
