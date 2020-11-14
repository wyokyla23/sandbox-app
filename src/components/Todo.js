import React, { useState } from "react";
import "./todo-styles.css";
import { customData } from "./data";
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'

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
    backgroundColor: '#aaaaaa'
  }
}))


export default function TodoList() {
  const [todos, setTodos] = useState(customData)
  const [finished, setFinished] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const classes = useStyles()
  console.log(todos, finished)
  const completeItem = (item) => (event) => {
    setTodos(todos.filter((innerItem) => {
      return item.id !== innerItem.id
    }))
    setFinished(finished.concat(item))
  }

  const deleteItem = (item) => (event) => {
    setFinished(finished.filter((innerItem) => {
      return item.id !== innerItem.id
    }))
  }

  const clearItems = () => (event) => {
    setTodos([])
  }

  const handleChange = (event) => {
    setNewTodo(event.target.value)
  }

  const handleSubmit = (value) => (event) => {
    event.preventDefault()
    setTodos((prevState) => {
      return prevState.concat({
        name: value,
        id: prevState.length + 1
      })
    })
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
            <div key={item.id}>
              <ul className={classes.listItems}>
                <li>{item.name}</li>
                <Button onClick={completeItem(item)}
                  className={classes.button}>Complete</Button>
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
            <ul key={item.id}
              className={classes.listItems}>
              <li>{item.name}</li>
              <Button onClick={deleteItem(item)}
                className={classes.button}>x</Button>
            </ul>
          ))}
        </div>
      </Grid>
    </Grid>
  );
}
