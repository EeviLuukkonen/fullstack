import { useState } from "react"
import { BOOKS_BY_GENRE, GET_GENRES } from "../queries"
import { useQuery, useApolloClient } from "@apollo/client/react"

const Books = (props) => {
  const [genre, setGenre] = useState('')
  const client = useApolloClient()
  
  const booksByGenreData = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: genre },
  })
  const genresData = useQuery(GET_GENRES)

  if (!props.show) {
    return null
  }

  if (booksByGenreData.loading || genresData.loading)  {
    return <div>loading...</div>
  }

  const handleChange = async (genre) => {
    setGenre(genre)
    await client.refetchQueries({
      include: [BOOKS_BY_GENRE],
    });
  };

  const books = booksByGenreData.data.allBooks
  const genreList = genresData.data.allBooks.flatMap(item => item.genres)
  const uniqueGenres = [...new Set(genreList)]

  return (
    <div>
      <h2>books</h2>
      <div>
        in genre <b>{genre || 'all genres'}</b>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
        {uniqueGenres.map(g =>
          <button key={g} onClick={() => handleChange(g)}>{g}</button>
        )}
        <button onClick={() => handleChange('')}>all genres</button>
      </table>
    </div>
  )
}

export default Books
