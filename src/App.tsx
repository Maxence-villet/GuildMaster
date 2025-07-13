import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { appRoutes } from './config/router';

function App() {
  return (
    <div className="App bg-gray-50 h-screen">
      <BrowserRouter>
        <Routes>
          {appRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
