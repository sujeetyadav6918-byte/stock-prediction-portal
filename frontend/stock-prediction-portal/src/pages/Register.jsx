function Register() {

  return (
    <main className="auth-page">

      <div className="auth-card">

        <h1>
          Create Account
        </h1>

        <p>
          Start analyzing the stock market.
        </p>

        <form>

          <input
            type="text"
            placeholder="Username"
          />

          <input
            type="email"
            placeholder="Email"
          />

          <input
            type="password"
            placeholder="Password"
          />

          <input
            type="password"
            placeholder="Confirm Password"
          />

          <button type="submit">
            Register
          </button>

        </form>

      </div>

    </main>
  )
}

export default Register