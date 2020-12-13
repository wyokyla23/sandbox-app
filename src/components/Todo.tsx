import React, { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import "./todo-styles.css";
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import Axios from 'axios'
import { HTMLEvent } from "../types";

const useStyles = makeStyles((theme) => ({

  root: {},
  todoWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  columnWrapper: {
    width: '100%',
    minHeight: '600px',
    height: '100%',
    backgroundColor: '#232323;',
    display: 'flex',
    color: '#aaaaaa;',
    fontFamily: 'Londrina Shadow, cursive',
    fontSize: '2.5rem',
  },
  finished: {
    flex: '1',
    textAlign: 'center',
  },
  listItems: {
    width: '90%',
    listStyleType: 'none',
  },
  clearButton: {
    paddingInlineStart: '15px',
    marginTop: '20px',
    marginBottom: '10px'
  },
  todoHeader: {
    width: '70%',
    display: 'flex',
    justifyContent: 'space-around',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '1.2rem',
    lineHeight: '1px;',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  input: {
    width: '50%',
    borderRadius: '20px',
    [theme.breakpoints.down('md')]: {
      width: '60%',
    },
  },
  button: {
    color: '#232323',
    backgroundColor: '#aaaaaa',
    '&:hover': {
      backgroundColor: 'white',
    },
  },
  completeButton: {
    '&:hover': {
      textDecoration: 'line-through'
    }
  }

}))

type Task = {
  task: string
  task_id: number
  completed: string
}

export default function TodoList() {
  const [todos, setTodos] = useState<Task[]>([])
  const [finished, setFinished] = useState<Task[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [changeCounter, setChangeCounter] = useState(0)
  const classes = useStyles()


  useEffect(() => {
    (async () => {
      const response = await Axios({
        method: "GET",
        url: "http://localhost:4000/todos",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const incomplete = response.data.filter((task: Task) => task.completed === "false")
      const completed = response.data.filter((task: Task) => task.completed === "true")
      setTodos(incomplete)
      setFinished(completed)
    })()
  }, [changeCounter])

  const completeItem = (item: Task) => async () => {
    const response = await Axios.patch("http://localhost:4000/todos/" + item.task_id, { completed: "true" })
    setTodos(todos.filter((innerItem) => {
      return item.task_id !== innerItem.task_id
    }))
    setFinished(finished.concat(item))
    setChangeCounter((prev) => prev + 1)
  }

  const deleteItem = (item: Task) => async () => {
    const response = await Axios.delete("http://localhost:4000/todos/" + item.task_id)
    setFinished(finished.filter((innerItem) => {
      return item.task_id !== innerItem.task_id
    }))
  }

  const clearItems = () => async () => {
    const response = await Axios.delete("http://localhost:4000/todos/")
    setChangeCounter((prev) => prev + 1)
  }

  const handleChange = (event: HTMLEvent) => {
    setNewTodo(event.target.value)
  }

  const handleSubmit = (value: string) => async (event: FormEvent) => {
    event.preventDefault()
    console.log(value)
    setNewTodo('')
    await Axios.post("http://localhost:4000/todos/", { task: value, completed: "false" })
    setChangeCounter((prev) => prev + 1)
  }

  return (
    <Grid container className={classes.todoWrapper}>
      <Grid item className={classes.todoHeader}>
        <h3>What Needs to Get Done?</h3>
        <form onSubmit={handleSubmit(newTodo)}>
          <Input
            className={classes.input}
            name='todo'
            type='text'
            placeholder='Feed the butterflies'
            value={newTodo}
            onChange={handleChange}
            required
          />
          <Button
            variant='outlined'
            type='submit'
            style={{ marginLeft: '30px' }}
          >
            Add
          </Button>
        </form>
      </Grid>
      <Grid
        container
        className={classes.columnWrapper}
      >
        <div className={classes.finished}>
          <h2>To Do</h2>
          {todos.map((item) => (
            <div key={item.task_id}>
              <ul className={classes.listItems}>
                <li>{item.task}</li>
                <Button onClick={completeItem(item)}
                  className={`${classes.button} ${classes.completeButton}`}>Complete</Button>
              </ul>
            </div>
          ))}
          <div className={classes.clearButton}>
            <Button onClick={clearItems()}
              className={classes.button}>Clear List</Button>
          </div>
        </div>
        <div className={classes.finished}>
          <h2>Finished</h2>
          {finished.map((item) => (
            <ul key={item.task_id}
              className={classes.listItems}>
              <li>{item.task}</li>
              <Button onClick={deleteItem(item)}
                className={classes.button}>x</Button>
            </ul>
          ))}
        </div>
      </Grid>
    </Grid>
  );
}
