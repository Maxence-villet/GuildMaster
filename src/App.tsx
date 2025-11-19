import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { appRoutes } from './config/router';
import { AuthProvider } from './context/AuthContext';
import axios from "axios";
axios.defaults.withCredentials = true;

function App() {

  return (
    <div className="App bg-gray-50 h-screen">
      <AuthProvider>
        <Router>
          <Routes>
            {appRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
