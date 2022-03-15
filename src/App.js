import axios from 'axios';
import { useState,useEffect } from 'react';
import './App.css';

const URL = 'http://localhost/shoppinglist/';

function App() {
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setItems(response.data);
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      });
  }, []);

  function save(e) {
    e.preventDefault();
    const json = JSON.stringify({description:item});
    axios.post(URL + 'add.php',json, {
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then ((response) => {
      setItems(items => [...items,response.data]);
      setItem('');
    }).catch(error => {
      alert(error.response ? error.response.data.error : error);
    })
  }

  function remove(id) {
    const json = JSON.stringify({id:id})
    axios.post(URL + 'delete.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
      .then((response) => {
        const newListWithoutRemoved = items.filter((item) => item.id !== id);
        setItems(newListWithoutRemoved);
      }).catch (error => {
        alert(error.response ? error.response.data.error : error);
      });
  }
  
  return (
    <div className='container'>
      <form onSubmit={save}>
        <label>New item</label>
        <input value={item} placeholder='Add a new item' onChange={e => setItem(e.target.value)}/>
        <button>Save</button>
      </form>
      <ol>
        {items?.map(item => (
          <li key={item.id}>
            {item.description}
            <a className='delete' onClick={() => remove(item.id)} href="#"> Delete</a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
