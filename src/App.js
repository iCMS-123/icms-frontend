import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginForm from './Components/LoginForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <h1 style={{margin:'0', padding:'0'}}>Welcome to iCMS</h1> */}
        <h1>Welcome to iCMS</h1>
        <LoginForm/>
      </header>

    </div>
  );
}

export default App;
