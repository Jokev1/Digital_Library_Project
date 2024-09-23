import './App.css'
import { Routes, Route} from 'react-router-dom';
import Home from './home/Home'
import Library from './library/Library';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/Library' element={<Library/>}></Route>
    </Routes>
  )
}

export default App
