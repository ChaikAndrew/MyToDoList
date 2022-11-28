import React, { useState, useEffect } from 'react';
import './App.css';

import { v4 as uuidv4 } from 'uuid';
import { randomColor } from 'randomcolor';
import Draggable from 'react-draggable';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { customToast } from './helper';

import { FcCheckmark } from 'react-icons/fc';

function App() {
  const [item, setItem] = useState('');
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem('items')) || []
  );

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  const newItem = () => {
    if (item !== '') {
      const newItem = {
        id: uuidv4(),
        item,
        color: randomColor({
          luminosity: 'light',
        }),
      };

      setItems(items => [...items, newItem]);
      setItem('');
      customToast(`Сongratulations. Your note has been added`, 'success');
      return;
    } else {
      customToast(`Enter your note, your entry cannot be empty 🙅🏻‍♂️`, 'warning');
      return;
    }
  };

  const deleteNode = id => {
    setItems(items.filter(item => item.id !== id));
    customToast(`Note has been deleted 🗑`, 'error');
    return;
  };

  const updatePosition = (data, index) => {
    let newArray = [...items];
    newArray[index].defaultPos = { x: data.x, y: data.y };
    setItems(newArray);
  };

  const keyPress = e => {
    const code = e.key.code || e.which;
    if (code === 13) {
      newItem();
    }
  };

  return (
    <div className="App">
      <div className="wrapper">
        <input
          value={item}
          type="text"
          className="input"
          placeholder="Enter your note..."
          onChange={e => setItem(e.target.value)}
          onKeyPress={e => keyPress(e)}
        ></input>
        <button className="enter" onClick={newItem}>
          <FcCheckmark className="btn__add" />
        </button>
      </div>

      {items.map((item, index) => {
        return (
          <Draggable
            defaultPosition={{ x: 14, y: -750 }}
            key={index}
            onStop={(_, data) => {
              updatePosition(data, index);
            }}
          >
            <div className="todo__item" style={{ backgroundColor: item.color }}>
              {`${item.item}`}
              <button className="delete" onClick={() => deleteNode(item.id)}>
                X
              </button>
            </div>
          </Draggable>
        );
      })}
      <ToastContainer />
    </div>
  );
}

export default App;
