import { createSlice } from "@reduxjs/toolkit"

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    createAnecdote(state, action) {
      const object = asObject(action.payload)
      console.log(object)
      state.push(object)
      console.log(JSON.parse(JSON.stringify(state)))
    },
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find(n => n.id === id)
      const votedAnecdote = { 
        ...anecdoteToVote, 
        votes: anecdoteToVote.votes +1 
      }
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : votedAnecdote
      )
    }
  },
})

//const anecdoteReducer = (state = initialState, action) => {
//  console.log('state now: ', state)
//  console.log('ACTION', action)
//  switch(action.type) {
//    case 'NEW_ANECDOTE':
//      const object = asObject(action.data)
//      return state.concat(object)
//    case 'VOTE':
//      const id = action.data.id
//      const anecdoteToVote = state.find(n => n.id === id)
//      const votedAnecdote = {
//        ...anecdoteToVote,
//        votes: anecdoteToVote.votes + 1
//      }
//      return state.map(anecdote => 
//        anecdote.id !== id ? anecdote : votedAnecdote
//      )
//    default:
//      return state
//  }
//}

//export const createAnecdote = (content) => { return {
//  type: 'NEW_ANECDOTE',
//  data: content
//}
//}
//
//export const voteAnecdote = (id) => {
//  return {
//    type: 'VOTE',
//    data: { id }
//  }
//}

export const { createAnecdote, voteAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer