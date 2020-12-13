import React, { FC } from 'react'
import Todo from './components/Todo'

export const derp = 'hello'

const App: FC = () => {
  return (
    <div className="App">
      <h1>Sandbox Todo App</h1>
      <Todo />
    </div>
  );
}

export default App;