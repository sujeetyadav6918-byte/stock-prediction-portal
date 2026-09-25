function Login() {

  return (
    <main className="auth-page">

      <div className="auth-card">

        <h1>
          Welcome Back
        </h1>

        <p>
          Login to your Stock Prediction Portal
        </p>

        <form>

          <input
            type="email"
            placeholder="Email"
          />

          <input
            type="password"
            placeholder="Password"
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </main>
  )
}

export default Login