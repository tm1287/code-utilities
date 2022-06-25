import logo from './logo.svg';
import './App.css';
import FormulaParser from './components/FormulaParser/FormulaParser'; 


function App() {
  return (
    <div className="App">
      <h1>Formula Parser</h1>
      <br/><br/>
      <div style={{display: "flex", justifyContent: "center"}}>
      <FormulaParser/>
      </div>
    </div>
  );
}

export default App;
