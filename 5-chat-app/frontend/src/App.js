import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import JoinPage from './comonents/JoinPage';
import ChatPage from './comonents/ChatPage';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<JoinPage />} />
          <Route path="/chatPage" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
