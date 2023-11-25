import logo from './logo.svg'
import './App.css';
import P from 'prop-types'
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// ----------- useState -------------------------
// function App() {
function AppUseState() {
  const [reverse, setReverse] = useState(false)
  const [inc, setInc] = useState(0)

  const reverseClass = reverse ? "reverse" : ""

  const handleReverse = () => {
    setReverse(!reverse)
  }

  const handleInc = () => {
    // setInc(inc + 1)
    setInc((prevInc) => prevInc + 1) // com callback
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className={`App-logo ${reverseClass}`} alt="logo" />

        <h1>Counter: {inc}</h1>
        
        <button type='button' onClick={handleReverse}>Reverse</button>
        <button type='button' onClick={handleInc}>Increment</button>
      </header>
    </div>
  );
}

// -------------------- useEffect -------------

const eventFn = () => {
  console.log('h1 clicado')
}

// function App() {
function AppUseEffect() {
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


// -------------- useCallback (fazer um cache de funcs) -------------------------

// simulação do componente do botão em outra pag

// COM REACT.MEMO
const Button = React.memo(function Button({ incBttn }) {
  console.log('filho renderizou') 
  return <button onClick={() => incBttn(100)}>+</button>
})

// SEM REACT.MEMO (vai sempre atualizar o componente)
// const Button = ({ incBttn }) => {
//   console.log('filho renderizou') 
//   return <button onClick={() => incBttn(100)}>+</button>
// }

Button.propTypes = {
  incBttn: P.func,
}

// function App() {
function AppUseCallback() {

  const [inc, setInc] = useState(0)

  // COM USECALLBACK
  const incCounter = useCallback((num) => {
    setInc((i) => i + num)
  }, [])

  // SEM USECALLBACK
  // const incCounter = (num) => {
  //   setInc((i) => i + num)
  // }

  console.log('pai renderizou')

  return (
    <div className="App">
      <h1>Counter: {inc}</h1>

      <Button incBttn={incCounter}/>
    </div>
  );
}

// --------------------- useMemo (substitui o React.memo) -------------------------------------

const Post = ({ post }) => {
    console.log('filho renderizou')
    return (
        <div key={post.id}>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
        </div>
    )
}

Post.propTypes = {
    post: P.shape({
      id: P.number,
      title: P.string,
      body: P.string,
    }),
};

function App() {
// function AppUseMemo() {

    const [posts, setPosts] = useState([])
    const [value, setValue] = useState('')

    console.log('pai renderizou')

    // componentDidMount
    useEffect(() => {
        setTimeout(function () {
            fetch('https://jsonplaceholder.typicode.com/posts')
                .then((res) => res.json())
                .then((res) => setPosts(res))
        }, 5000)
    }, [])

    return (
        <div className="App">

            <input
                type='search'
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        
            {useMemo(() => {
                return (
                    posts.length > 0 && 
                    posts.map((post) => {
                        return <Post key={post.id} post={post} />
                    })
                )
            }, [posts])}

            {posts.length <= 0 && <p>Ainda não há posts</p>}

        </div>
    );
}

export default App;
