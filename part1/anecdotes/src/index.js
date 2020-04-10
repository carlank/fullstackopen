import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array.from({length: props.anecdotes.length}).fill(0));
  
  const maxVotes = Math.max(...Object.values(votes));
  const maxVotesIndex = Object.entries(votes).filter(([index,val])=>val==maxVotes)[0][0]; // hax. This pulls the first one, almost certainly, but Object.entries doesn't guarantee that it's ordered


  return (
    <div>
		<p>{props.anecdotes[selected]}</p>
		<p>This anecdote has {votes[selected]} votes!</p>
		<button onClick={()=>setVotes({...votes, [selected]: votes[selected]+1})}>Vote</button>
		<button onClick={()=>setSelected(~~(Math.random() * props.anecdotes.length))}>Randomize</button>
  		<p>The anecodote with the most votes is:</p>
  		<p>{props.anecdotes[maxVotesIndex]}</p>
      <p>with {maxVotes} votes!</p>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)