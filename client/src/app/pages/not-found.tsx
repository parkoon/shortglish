import { Link } from 'react-router'

export const NotFoundPage = () => {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <Link to="/" replace>
        Go to Home
      </Link>
    </div>
  )
}
