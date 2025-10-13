import { useQuery } from "@apollo/client/react"
import { BOOKS_BY_GENRE, ME } from "../queries"

const Recommend = (props) => {
  const result = useQuery(ME)
  const favoriteGenre = result?.data?.me?.favoriteGenre
  const books = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre
  })

  if (!props.show) {
    return null
  }

  if (result.loading || books.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        Books in your favorite genre <b>{favoriteGenre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend