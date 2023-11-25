import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

// ----------- useState -------------------------
// function App() {
//   const [reverse, setReverse] = useState(false)
//   const [inc, setInc] = useState(0)

//   const reverseClass = reverse ? "reverse" : ""

//   const handleReverse = () => {
//     setReverse(!reverse)
//   }

//   const handleInc = () => {
//     // setInc(inc + 1)
//     setInc((prevInc) => prevInc + 1) // com callback
//   }

//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className={`App-logo ${reverseClass}`} alt="logo" />

//         <h1>Counter: {inc}</h1>
        
//         <button type='button' onClick={handleReverse}>Reverse</button>
//         <button type='button' onClick={handleInc}>Increment</button>
//       </header>
//     </div>
//   );
// }

// -------------------- useEffect -------------

const eventFn = () => {
  console.log('h1 clicado')
}

function App() {
  const [inc, setInc] = useState(0)
  const [inc2, setInc2] = useState(0)

  // componentDidUpdate = toda veq q o componente atualiza
  useEffect(() => {
    console.log('componentDidUpdate')
  })

  // componentDidMount (sem dependências) = quando o component é montado pela 1ª vez
  useEffect(() => {
    document.querySelector('h1')?.addEventListener('click', eventFn)

    // componentWillUnmount - limpeza
    // pode ser retornado em qqer useEffect
    // evita q haja duplicatas quando o arquivo é modificado
    return () => {
      document.querySelector('h1')?.removeEventListener('click', eventFn)
    }
  }, [])

  // Com dependências = executa quando a dependência atualiza
  useEffect(() => {
    console.log('c1: ', inc, 'c2:', inc2)
  }, [inc, inc2])

  return (
    <div className="App">
      <h1>Counter: {inc}</h1>

      <button onClick={() => setInc(inc + 1)}>+</button>
      <button onClick={() => setInc2(inc2 + 1)}>+ (2)</button>
    </div>
  );
}

export default App;
