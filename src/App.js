import React, { useState, useEffect } from 'react';
import './App.css';

import { v4 as uuidv4 } from 'uuid';
import { randomColor } from 'randomcolor';
import Draggable from 'react-draggable';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { customToast } from './helper';

import { FcCheckmark } from 'react-icons/fc';
import { CgTrash } from 'react-icons/cg';
import { FiEdit3 } from 'react-icons/fi';

function App() {
  const [item, setItem] = useState('');
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem('items')) || []
  );

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  function randomPosition(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const newItem = () => {
    if (item.trim() !== '') {
      const newItem = {
        id: uuidv4(),
        item,
        color: randomColor({
          luminosity: 'light',
        }),
        defaultPos: {
          x: randomPosition(5, 20),
          y: randomPosition(-500, -300),
        },
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
    console.log('id', id);
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
        <div className="form">
          <input
            value={item}
            type="text"
            className="input"
            placeholder="Enter your note..."
            onChange={e => setItem(e.target.value)}
            onKeyPress={e => keyPress(e)}
          />
          <button className="enter" onClick={newItem}>
            <FcCheckmark className="btn__add" />
          </button>
        </div>

        <div className="todo__list">
          {items.map((item, index) => {
            return (
              <div className="item-container" key={index}>
                <Draggable
                  defaultPosition={{ x: 0, y: 0 }}
                  onStop={(_, data) => {
                    updatePosition(data, index);
                  }}
                >
                  <div
                    className="todo__item"
                    style={{ backgroundColor: item.color }}
                  >
                    {`${item.item}`}

                    <button
                      className="delete"
                      onClick={() => deleteNode(item.id)}
                    >
                      <CgTrash className="icon_delete" />
                    </button>
                    <button
                      className="edit"
                      onClick={() => deleteNode(item.id)}
                    >
                      <FiEdit3 className="icon_edit" />
                    </button>
                  </div>
                </Draggable>
              </div>
            );
          })}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
