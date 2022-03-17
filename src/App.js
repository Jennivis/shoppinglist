import axios from 'axios';
import { useState,useEffect } from 'react';
import './App.css';

const URL = 'http://localhost/shoppinglist/';

function App() {
  const [item, setItem] = useState("");
  const [items, setItems] = useState([]);
  const [amount, setAmount] = useState("")

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
    const json = JSON.stringify({description:item, amount:amount});
    axios.post(URL + 'add.php',json, {
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then ((response) => {
      setItems(items => [...items,response.data]);
      setItem('');
      setAmount('')
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
      <h1>Shopping list</h1>
      <form onSubmit={save}>
        <label>New item:</label>
        <input type="text" value={item} placeholder='Add a new item' onChange={e => setItem(e.target.value)}/>
        <input type="number" value={amount} placeholder='Amount' onChange={e => setAmount(e.target.value)}/>
        <button>Save</button>
      </form>
      <ol>
        {items?.map(item => (
          <li key={item.id}>
            {item.description} {item.amount} &nbsp;
            <a className='delete' onClick={() => remove(item.id)} href="#">Delete</a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
