import logo from './logo.svg'
import './App.css';
import P from 'prop-types'
import React, { useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';

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

// const Post = ({ post }) => {
//     console.log('filho renderizou')
//     return (
//         <div key={post.id}>
//             <h1>{post.title}</h1>
//             <p>{post.body}</p>
//         </div>
//     )
// }

// Post.propTypes = {
//     post: P.shape({
//       id: P.number,
//       title: P.string,
//       body: P.string,
//     }),
// };

// function App() {
function AppUseMemo() {

    const [posts, setPosts] = useState([])
    const [value, setValue] = useState('')

    console.log('pai renderizou')

    // componentDidMount
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then((res) => res.json())
            .then((res) => setPosts(res))
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

// ------------------ useRef ------------------------
const Post = ({ post, handleClick }) => {
    console.log('filho renderizou')
    return (
        <div key={post.id}>
            <h1 onClick={() => handleClick(post.title)}>{post.title}</h1>
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
    handleClick: P.func,
};

// function App() {
function AppUseRef() {

    const [posts, setPosts] = useState([])
    const [value, setValue] = useState('')
    const input = useRef(null)
    const counter = useRef(0)

    console.log('pai renderizou')

    // componentDidMount
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then((res) => res.json())
            .then((res) => setPosts(res))
    }, [])

    useEffect(() => {
        input.current.focus()
    }, [value])

    useEffect(() => {
        counter.current++
    })

    const handleClick = (value) => {
        setValue(value)
    }

    return (
        <div className="App">
            <h1>Renderizou {counter.current}X</h1>
            <input
                ref={input}
                type='search'
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        
            {useMemo(() => {
                return (
                    posts.length > 0 && 
                    posts.map((post) => {
                        return <Post key={post.id} post={post} handleClick={handleClick}/>
                    })
                )
            }, [posts])}

            {posts.length <= 0 && <p>Ainda não há posts</p>}

        </div>
    );
}


// ---------------- useContext ------------------------

// data.js
const globalState = {
  title: 'o título do contexto',
  body: 'o corpo do contexto',
  counter: 0,
}
const GlobalContext = React.createContext()

const Div = () => {
	return (
		<>
			<H1 />
			<Par />
		</>
	)
}

const H1 = () => {
	const ctx = useContext(GlobalContext)
	const {
		context: { title, counter },
	} = ctx

	return (
		<h1>{title} {counter}</h1>
	)
}

const Par = () => {
	const ctx = useContext(GlobalContext)
	const {
		context: { body, counter },
		context,
		setContext,
	} = ctx

	return (
		<p onClick={() => setContext({...context, counter: counter+1})}>{body}</p>
	)
}

// function App() {
function AppUseContext() {
    
	const [context, setContext] = useState(globalState)

    return (
		<GlobalContext.Provider value={{ context, setContext }}>
			<Div />
		</GlobalContext.Provider>
    );
}


// --------------------- useReducer -----------------------

const reducer = (state, action) => {
	switch (action.type) {
		case 'muda': {
			console.log(action.payload)
			return {...state, title: action.payload}
		}
		case 'inv': {
			console.log('Inverteu')
			return {...state, title: state.title.split('').reverse().join('')}
		}
		default:
			console.log('NENHUMA AÇÃO ENCONTRADA')
			return {...state}
	}
}

// function App() {
function AppUseReducer() {
	
	const [state, dispatch] = useReducer(reducer, globalState)
	const {title, body, counter} = state

	return (
		<div>
			<h1>{title}  {counter}</h1>
			<p>{body}</p>

			<button onClick={() => dispatch({ type: 'muda', payload: new Date().toLocaleString('pt-BR') })}>Mudar</button>
			<button onClick={() => dispatch({ type: 'inv' })}>Inverter</button>
			<button onClick={() => dispatch({ type: 'naoexiste' })}>Nao Existe</button>
		</div>
	);
}

// -------------------- useReducer + useContext ---------------

// actions.js
export const actions = {
    CHANGE_TITLE: 'CHANGE_TITLE'
}

// data.js
export const globalS = {
  title: 'O título do estado global'
}

// reducer.js
export const reducer2 = (state, action) => {
    switch (action.type) {
        case actions.CHANGE_TITLE:
            console.log('Mudou')
            return {...state, title: action.payload}
    
        default:
            return {...state}
    }
}

// AppContext.jsx
export const Context = React.createContext()
export const AppContext = ({ children }) => {
    const [state2, dispatch2] = useReducer(reducer2, globalS)

    // fazer funções para facilitar o uso do dispatch
    const changeTitle = (payload) => {
        dispatch2({ type: actions.CHANGE_TITLE, payload: payload })
    }

    return (
        <Context.Provider value={{ state2, changeTitle }}>
            {children}
        </Context.Provider>
    )
}

AppContext.propTypes = {
    children: P.node,
};

// H2/index.jsx
const H2 = () => {
    const ctx = useContext(Context)
    const refIn = useRef()

    return (
        <>
            <h2 onClick={() => ctx.changeTitle(refIn.current.value)}>
                {ctx.state2.title}
            </h2>
            <input type='text' ref={refIn}/>
        </>
    )
}

// function App() {
function AppUseRedAncCtx() {

	return (
        <AppContext>
            <div>
                <H2 />
            </div>
        </AppContext>
	);
}

// ---------------------- Criando um Hook ----------------

const useMyHook = (cb, delay = 1000) => {
    const savedCb = useRef()

    useEffect(() => {
        savedCb.current = cb
    }, [cb])

    useEffect(() => {
        const interval = setInterval(() => {
            savedCb.current()
        }, delay)

        return () => clearInterval(interval)
    })
}

function App() {
// function AppUseMyHook() {

    const [cont, setCont] = useState(0)
    const [delay, setDelay] = useState(1000)
    const [incrementor, setIncrementor] = useState(100)
    
    useMyHook(() => setCont(c => c+1), delay)

    return (
        <div>
            <h1>Contador: {cont}</h1>
            <h1>Delay: {delay}</h1>

            <button onClick={() => setDelay(d => d + incrementor)}>+{incrementor}</button>
            <button onClick={() => setDelay(d => d - incrementor)}>-{incrementor}</button>

            <input type='number' value={incrementor} onChange={(e) => setIncrementor(Number(e.target.value))}/>
        </div>
    );
}

export default App;
