import { useState } from 'react'
import { useMutation } from '@apollo/client/react'

import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const BirthyearForm = (props) => {
  const [name, setName] = useState('')
  const [birthyear, setBirthyear] = useState('')

  const [ changeYear ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
      console.log(error)
      props.setError(error.message)
    }
  })

  const submit = async (event) => {
    event.preventDefault()

    const setBornTo = Number(birthyear)

    changeYear({ variables: { name, setBornTo } })
    console.log({name, setBornTo})
    setName('')
    setBirthyear('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>

      <form onSubmit={submit}>
        <div>
          name <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born <input
            value={birthyear}
            onChange={({ target }) => setBirthyear(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default BirthyearForm