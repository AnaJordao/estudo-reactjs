import logo from './logo.svg'
import './App.css';
import P from 'prop-types'
import React, { Children, Component, Suspense, cloneElement, useCallback, useContext, useDebugValue, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
// import { LazyComponent } from './LazyComponent';

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

// ---------------------- Criando um Hook (useMyHook) ----------------

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

// function App() {
function AppUseMyHook() {

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


// ---------------- useFetch (my second custom hook) ------

const isObjectEqual = (objA, objB) => {
    return JSON.stringify(objA) === JSON.stringify(objB)
} 

const useFetch = (url, options) => {
    const [result, setResult] = useState(null)
    const [loading, setLoading]  = useState(false)
    const [shouldLoad, setShouldLoad]  = useState(false)
    const urlRef = useRef(url)
    const optionsRef = useRef(options)

    useEffect(() => {
        let changed = false

        if(!isObjectEqual(url, urlRef.current)) {
            urlRef.current = url
            changed = true
        }

        if(!isObjectEqual(options, optionsRef.current)) {
            optionsRef.current = options
            changed = true
        }

        if (changed) {
            setShouldLoad(s => !s)
        }

    }, [url, options])

    useEffect(() => {
        let wait = false
        const controller = new AbortController()
        const signal = controller.signal
        // console.log('EFFECT', new Date().toLocaleString())
        // console.log(optionsRef.current.headers)

        setLoading(true)

        const fetchData = async () => {
            await new Promise((r) => setTimeout(r, 1000))

            try {
                const res = await fetch(urlRef.current, {signal, ...optionsRef.current})
                const jsonRes = await res.json()

                if(!wait) {
                    setResult(jsonRes)
                    setLoading(false)
                }
            } catch(e) {
                if (!wait) {
                    setLoading(false)
                }
                console.log('MY ERROR:', e.message)
            }
            
        }

        fetchData()

        return () => {
            wait = true
        }

    }, [shouldLoad])

    return [result, loading]
}

// function App() {
function AppUseFetch() {

const [postId, setPostId] = useState('')
const [result, loading] = useFetch('https://jsonplaceholder.typicode.com/posts/' + postId, {
    headers: {
        abc: '1' + postId,
    },
})

// useEffect(() => {
//     console.log('ID do post', postId)
// }, [postId])

if (loading) {
    return <p>Loading...</p>
}


const handleClickAppFetch = (id) => {
    setPostId(id)
}

if(!loading && result) {

    return (
        <div>
            {result?.length > 0 ? (
                result.map((p) => (
                    <div key={`post-${p.id}`} onClick={() => handleClickAppFetch(p.id)}>
                        <p>{p.title}</p>
                    </div>
                ))
            ) : (
                <div onClick={() => handleClickAppFetch('')}>
                    <p>{result.title}</p>
                </div>
            )}
        </div>
    );
}
return <h1>Oi</h1>
}


// ----------------- useAsync (terceiro hook customizado) ---------

const useAsync = (asyncFunc, shouldRun) => {
    const [state, setState] = useState({
        status: 'idle',
        result: null,
        error: null,
    })

    const run = useCallback(() => {
        setState({
            status: 'pending',
            result: null,
            error: null,
        })

        return asyncFunc()
            .then((res) => {
                setState({
                    status: 'settled',
                    result: res,
                    error: null,
                })
            })
            .catch((e) => {
                setState({
                    status: 'error',
                    result: null,
                    error: e,
                })
            })
    }, [asyncFunc])

    useEffect(() => {
        if(shouldRun){
            run()
        }
    }, [run, shouldRun])

    return [run, state]
}

const fetchData = async () => {
    const data = await fetch('https://jsonplaceholder.typicode.com/posts/')
    const json = await data.json()
    return json
}


// function App() {
function AppUseAsync() {

    const [posts, setPosts] = useState(null)
    const [reFetchData, stateReFetch] = useAsync(fetchData, true)
    const [reFetchData2, stateReFetch2] = useAsync(fetchData, true)

    useEffect(() => {
        setTimeout(() => {
            reFetchData();
        }, 6000)
    }, [reFetchData])

    useEffect(() => {
        console.log(stateReFetch2.result);
    }, [stateReFetch2.result]);
    
    const handleClickAsync = () => {
        reFetchData()
    }

    if(stateReFetch.status === 'idle'){
        return <pre>idle: Nada executando</pre>
    }
    if(stateReFetch.status === 'pending'){
        return <pre>pending: Loading...</pre>
    }
    if(stateReFetch.status === 'settled'){
        return <pre onClick={handleClickAsync}>settled: {JSON.stringify(stateReFetch.result, null, 2)}</pre>
    }
    if(stateReFetch.status === 'error'){
        return <pre>error: {JSON.stringify(stateReFetch.error, null, 2)}</pre>
    }

    return 'IXII'
}

// ------------ useLayoutEffect ----------------------
// function App() {
function AppUseLayoutEffect() {

    const [counted, setCounted] = useState([0, 1, 2, 3, 4])
    const divRef = useRef()

    // useEffect(() => {
    //     const now = Date.now()

    //     while (Date.now() < now + 3000)
    //     divRef.current.scrollTop = divRef.current.scrollHeight
    // })

    useLayoutEffect(() => {
        const now = Date.now()

        while (Date.now() < now + 3000)
        divRef.current.scrollTop = divRef.current.scrollHeight
    })

    const toCount = () => {
        setCounted((c) => [...c, +c.slice(-1) + 1])
    }

    return (
        <>
            <button onClick={toCount}>Count {counted.slice(-1)}</button>
            <div ref={divRef} style={{ height: '100px', width: '100px', overflowY: 'scroll' }}>{counted.map((c) => {
                return <p key={`c-${c}`}>{c}</p>
            })}</div>
        </>
    )
}

// -------- useImperativeHandle + React.forwardRef ---------------------

// function App() {
function AppUseImp() {

    const [counted, setCounted] = useState([0, 1, 2, 3, 4])
    const divRef = useRef()

    useLayoutEffect(() => {
        const now = Date.now()

        while (Date.now() < now + 300)
        divRef.current.divRef.scrollTop = divRef.current.divRef.scrollHeight
    })

    const toCount = () => {
        setCounted((c) => [...c, +c.slice(-1) + 1])
    }

    return (
        <>
            <button onClick={toCount}>Count {counted.slice(-1)}</button>
            <DisplayCounted counted={counted} ref={divRef}/>
        </>
    )
}

export const DisplayCounted = React.forwardRef(function DisplayCounted({ counted }, ref) {
    const [rand, setRand] = useState('0.24')
    const divRef = useRef()

    const handleClickImp = () => {
        setRand(Math.random().toFixed(2))
    }

    useImperativeHandle(ref, () => ({
        handleClickImp,
        divRef: divRef.current,
    }))

    return (
        <div ref={divRef} style={{ height: '100px', width: '100px', overflowY: 'scroll' }}>{counted.map((c) => {
                return <p onClick={handleClickImp} key={`c-${c}`}>{c} +++ {rand}</p>
        })}</div>
    )
})

// ---------------------- useDebugValue + useMediaQuery (custom) ----------------------------

const useMediaQuery = (query, initialValue = false) => {
    const [match, setMatch] = useState(initialValue)

    useDebugValue(`Query: ${query}`, (name) => {
        return name + ' modificado'
    })

    useEffect(() => {
        let isMounted = true
        const matchMedia = window.matchMedia(query)

        const handleChange = () => {
            if(!isMounted) return
            setMatch(Boolean(matchMedia.matches))
        }

        matchMedia.addEventListener('change', handleChange)
        setMatch(!!matchMedia.matches)

        return () => {
            isMounted = false
            matchMedia.removeEventListener('change', handleChange)
        }
    }, [query])

    return match
}

// function App() {
function AppUseDebugValue() {
   
    const huge = useMediaQuery('(min-width: 980px)')
    const big = useMediaQuery('(max-width: 980px) and (min-width: 768px)')
    const medium = useMediaQuery('(max-width: 767px) and (min-width: 321px)')
    const small = useMediaQuery('(max-width: 321px)')

    const background = huge ? 'green' : big ? 'red' : medium ? 'yellow' : small ? 'purple' : null

    return (
        <div style={{background}}>OI</div>
    )
}

// --------------------------------- Ordem dos Hooks ---------------------------------------------

export const ReactHooks = () => {
    console.log('%cCHILD RENDER STARTING...', 'color: green');
  
    // Lazy Initializer #1
    const [state1, setState1] = useState(() => {
      const state = new Date().toLocaleDateString()
      console.log('%cState Lazy initializer - (useState + InitialValue) = ' + state, 'color: green')
      return state
    })
    const renders = useRef(0)
  
    useEffect(() => {
      console.log('%cuseEffect (UPDATE state1) ' + state1, 'color: #dbc70f')
    }, [state1])
  
    useEffect(() => {
      console.log('%cuseEffect -> No Dependencies', 'color: #dbc70f')
      renders.current += 1
  
      return () => {
        console.log('%cuseEffect (Cleanup) -> No Dependencies', 'color: #dbc70f')
      }
    })
  
    useEffect(() => {
      const listener = () => console.log('Listener...')
      console.log('%cuseEffect -> Empty dependencies', 'color: #dbc70f')
  
      return () => {
        console.log('%cuseEffect (Cleanup) -> Empty dependencies', 'color: #dbc70f')
      }
    }, [])
  
    useLayoutEffect(() => {
      console.log('%cuseLayoutEffect', 'color: #e61a4d')
  
      return () => {
        console.log('%cuseLayoutEffect (Cleanup)', 'color: #e61a4d')
      }
    })
  
    console.log('%cCHILD RENDER ' + renders.current + ' ENDING...', 'color: green')
    return (
      <div onClick={() => setState1(new Date().toLocaleString('pt-br'))} style={{ fontSize: '60px' }}>
        State: {state1}
      </div>
    );
  };

// const App = () => {
const AppOrdemHooks = () => {
    const renders = useRef(0)

    useEffect(() => {
        renders.current += 1
    });

    console.log(`%cPARENT RENDER ${renders.current} STARTING...`, 'color: green')
    const [show, setShow] = useState(false);
    console.log('%cState Initializer - (useState + InitialValue) = ' + show, 'color: green')
    console.log(`%cPARENT RENDER ${renders.current} ENDING...`, 'color: green')

    return (
        <div>
        <p style={{ fontSize: '60px' }} onClick={() => setShow((s) => !s)}>
            Show hooks
        </p>
        {show && <ReactHooks />}
        </div>
    );
};

// ---------------- errorBoundary ----------------------

const s = {
    style: {
        fontSize: '20px',
    }
}

class MyErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = {hasError: false}
    }

    static getDerivedStateFromError(error) {
        // Atualiza o state para que a próxima renderização mostre a UI alternativa.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Você também pode registrar o erro em um serviço de relatórios de erro
        // console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Você pode renderizar qualquer UI alternativa
            return <p {...s}>Deu ruim =(</p>;
        }

        return this.props.children;
    }
}

// componente que gerará um erro
const ItWillThrowError = () => {

    const [counter, setCounter] = useState(0)

    useEffect(() => {
        if(counter > 3){
            throw new Error('Que chato :(')
        }
    }, [counter])

    return (
        <button {...s} onClick={() => setCounter(c => c+1)}>Increase {counter}</button>
    )
}

// const App = () => {
function AppErrorBoundary() {

    return (
        <div {...s}>
            <MyErrorBoundary>
                <ItWillThrowError/>
            </MyErrorBoundary>
            <MyErrorBoundary>
                <ItWillThrowError/>
            </MyErrorBoundary>
            <MyErrorBoundary>
                <ItWillThrowError/>
            </MyErrorBoundary>
            <MyErrorBoundary>
                <ItWillThrowError/>
            </MyErrorBoundary>
            <MyErrorBoundary>
                <ItWillThrowError/>
            </MyErrorBoundary>
            <MyErrorBoundary>
                <ItWillThrowError/>
            </MyErrorBoundary>
            <MyErrorBoundary>
                <ItWillThrowError/>
            </MyErrorBoundary>
        </div>
    )
}

// ----------- compound Components ---------------------

// const TurnOnOff = ({ children }) => {
//     const [isOn, setIsOn] = useState(false)
//     const onTurn = () => setIsOn(s => !s)

//     return React.Children.map(children, (child) => {
//         const newChild = cloneElement(child, {
//             isOn,
//             onTurn,
//         })
//         return newChild
//     })
// }

// const TurnOn = ({ isOn, children }) => (isOn ? children : null)
// const TurnOff = ({ isOn, children }) => (isOn ? null : children)
// const TurnBttn = ({ isOn, onTurn, ...props }) => {
//     return (
//         <button onClick={onTurn} {...props}>
//             Turn {isOn ? 'OFF' : 'ON'}
//         </button>
//     )
// }
const Parag = ({ children }) => <p {...s}>{children}</p>

// const App = () => {
function AppCompoundComponents() {

    return (
        <TurnOnOff>
            <TurnOn>
                <Parag>Aqui as coisas que vão acontecer quando estiver ON</Parag>
            </TurnOn>
            <TurnOff>
                <Parag>Aqui vem as coisas do OFF</Parag>
            </TurnOff>
            <TurnBttn {...s} />
        </TurnOnOff>
    )
}

// ----------------- Compoud Components using default html components ------------

const TurnOnOffContext = React.createContext()

const TurnOnOff = ({ children }) => {
    const [isOn, setIsOn] = useState(false)
    const onTurn = () => setIsOn(s => !s)

    return <TurnOnOffContext.Provider value={{isOn, onTurn}}>{children}</TurnOnOffContext.Provider>
}

const TurnOn = ({ children }) => {
    const { isOn } = useContext(TurnOnOffContext)
    return (isOn ? children : null)
}
const TurnOff = ({ children }) => {
    const { isOn } = useContext(TurnOnOffContext)
    return (isOn ? null : children)
}
const TurnBttn = ({ ...props }) => {
    const { isOn, onTurn } = useContext(TurnOnOffContext)
    return (
        <button onClick={onTurn} {...props}>
            Turn {isOn ? 'OFF' : 'ON'}
        </button>
    )
}

// const App = () => {
function AppCompoundComponents2() {

    return (
        <TurnOnOff>
            <div>
                <header>
                    <TurnOff>
                        <Parag>Aqui vem as coisas do OFF</Parag>
                    </TurnOff>
                </header>
                <section>
                    <TurnOn>
                        <Parag>Aqui as coisas que vão acontecer quando estiver ON</Parag>
                    </TurnOn>
                </section>
            </div>
            <TurnBttn {...s} />
        </TurnOnOff>
    )
}

// -------------- React.lazy + Suspence -----------------

const loadComponent = () => {
    console.log('Componente carregando...')
    return import('./LazyComponent')
}
const LazyComponent = React.lazy(loadComponent)

const App = () => {
// function AppCompoundComponents() {

    const [show, setShow] = useState(false)

    return (
        <div>
            <p>
                <button onMouseOver={loadComponent} onClick={() => setShow((s) => !s)}>
                    Show {show ? 'LC on screen' : 'LC off screen'}
                </button>
            </p>
            <Suspense fallback={<p>Carregando...</p>}>
                {show && <LazyComponent />}
            </Suspense>
        </div>
    )
}

export default App;
