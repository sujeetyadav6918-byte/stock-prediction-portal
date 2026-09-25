import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="home-page">

      <section className="hero">

        <div className="hero-content">

          <span className="hero-badge">
            AI POWERED STOCK ANALYSIS
          </span>

          <h1>
            Stock Market
            <span> Prediction Portal</span>
          </h1>

          <p>
            Analyze historical stock data, visualize market trends,
            and explore machine-learning based price predictions.
          </p>

          <div className="hero-buttons">

            <Link
              to="/dashboard"
              className="primary-btn"
            >
              Explore Dashboard
            </Link>

            <Link
              to="/register"
              className="secondary-btn"
            >
              Create Account
            </Link>

          </div>

        </div>

      </section>

    </main>
  )
}

export default Home