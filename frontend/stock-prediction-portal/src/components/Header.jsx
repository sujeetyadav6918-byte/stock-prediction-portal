import { Link } from 'react-router-dom'

function Header() {

  return (
    <header className="navbar">

      <div className="navbar-container">

        <Link
          to="/"
          className="logo"
        >
          Stock<span>Predict</span>
        </Link>

        <nav>

          <Link to="/">
            Home
          </Link>

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/login">
            Login
          </Link>

          <Link
            to="/register"
            className="nav-register"
          >
            Register
          </Link>

        </nav>

      </div>

    </header>
  )
}

export default Header