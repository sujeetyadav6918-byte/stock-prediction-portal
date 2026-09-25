import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import API from "../services/api";


function Dashboard() {

  const [symbol, setSymbol] = useState("AAPL");
  const [search, setSearch] = useState("AAPL");
  const [period, setPeriod] = useState("1mo");

  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [prediction, setPrediction] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // =========================
  // FETCH STOCK DATA
  // =========================

  const fetchStockData = async (stockSymbol, selectedPeriod) => {

    try {

      setLoading(true);
      setError("");

      // Current stock
      const currentResponse = await API.get(
        `/stocks/?symbol=${stockSymbol}`
      );

      // Historical data
      const historyResponse = await API.get(
        `/stocks/${stockSymbol}/history/?period=${selectedPeriod}`
      );

      // ML prediction
      const predictionResponse = await API.get(
        `/stocks/${stockSymbol}/prediction/`
      );


      // Save data
      setStock(currentResponse.data);

      setHistory(historyResponse.data.data);

      setPrediction(
        predictionResponse.data.prediction
      );

      setSymbol(stockSymbol);

    } catch (err) {

      console.error(err);

      setStock(null);

      setHistory([]);

      setPrediction(null);

      setError(
        "Stock not found or unable to fetch data."
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    fetchStockData("AAPL", "1mo");

  }, []);


  // =========================
  // SEARCH
  // =========================

  const handleSearch = (e) => {

    e.preventDefault();

    const stockSymbol =
      search.trim().toUpperCase();

    if (!stockSymbol) {
      return;
    }

    fetchStockData(
      stockSymbol,
      period
    );

  };


  // =========================
  // PERIOD CHANGE
  // =========================

  const handlePeriodChange = (
    selectedPeriod
  ) => {

    setPeriod(selectedPeriod);

    fetchStockData(
      symbol,
      selectedPeriod
    );

  };


  return (

    <div className="dashboard">

      <h1>
        Stock Prediction Dashboard
      </h1>


      {/* =========================
          SEARCH
      ========================= */}

      <form onSubmit={handleSearch}>

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Enter stock symbol"
        />

        <button type="submit">
          Search
        </button>

      </form>


      {/* =========================
          PERIOD BUTTONS
      ========================= */}

      <div className="period-buttons">

        <button
          onClick={() =>
            handlePeriodChange("1mo")
          }
          className={
            period === "1mo"
              ? "active"
              : ""
          }
        >
          1M
        </button>


        <button
          onClick={() =>
            handlePeriodChange("3mo")
          }
          className={
            period === "3mo"
              ? "active"
              : ""
          }
        >
          3M
        </button>


        <button
          onClick={() =>
            handlePeriodChange("6mo")
          }
          className={
            period === "6mo"
              ? "active"
              : ""
          }
        >
          6M
        </button>


        <button
          onClick={() =>
            handlePeriodChange("1y")
          }
          className={
            period === "1y"
              ? "active"
              : ""
          }
        >
          1Y
        </button>


        <button
          onClick={() =>
            handlePeriodChange("5y")
          }
          className={
            period === "5y"
              ? "active"
              : ""
          }
        >
          5Y
        </button>

      </div>


      {/* =========================
          LOADING
      ========================= */}

      {loading && (

        <h2>
          Loading {symbol}...
        </h2>

      )}


      {/* =========================
          ERROR
      ========================= */}

      {error && (

        <h2>
          {error}
        </h2>

      )}


      {!loading && stock && (

        <>


          {/* =========================
              CURRENT STOCK
          ========================= */}

          <div className="stock-info">

            <h2>
              {stock.symbol}
            </h2>


            <h3>
              ${stock.price}
            </h3>


            <p>

              Daily Change:{" "}

              <strong
                style={{
                  color:
                    stock.change >= 0
                      ? "green"
                      : "red",
                }}
              >

                {stock.change >= 0
                  ? "+"
                  : ""}

                {stock.change}

                {" "}

                ({stock.change_percent}%)

              </strong>

            </p>


            <p>

              Trend:{" "}

              <strong
                style={{
                  color:
                    stock.trend === "Bullish"
                      ? "green"
                      : stock.trend === "Bearish"
                      ? "red"
                      : "gray",
                }}
              >

                {stock.trend}

              </strong>

            </p>

          </div>



          {/* =========================
              STATISTICS
          ========================= */}

          <div className="stats-grid">


            <div className="stat-card">

              <h4>
                Open
              </h4>

              <p>
                ${stock.open}
              </p>

            </div>


            <div className="stat-card">

              <h4>
                Day High
              </h4>

              <p>
                ${stock.high}
              </p>

            </div>


            <div className="stat-card">

              <h4>
                Day Low
              </h4>

              <p>
                ${stock.low}
              </p>

            </div>


            <div className="stat-card">

              <h4>
                Volume
              </h4>

              <p>
                {stock.volume.toLocaleString()}
              </p>

            </div>

          </div>



          {/* =========================
              ML PREDICTION
          ========================= */}

          {prediction && (

            <div className="prediction-card">
                {/* =========================
    MODEL METRICS
========================= */}

{prediction?.metrics && (

  <div className="metrics-section">

    <h2>
      Model Performance
    </h2>

    <div className="metrics-grid">

      <div className="metric-card">
        <span>MAE</span>
        <strong>
          {prediction.metrics.mae}
        </strong>
        <small>
          Mean Absolute Error
        </small>
      </div>


      <div className="metric-card">
        <span>MSE</span>
        <strong>
          {prediction.metrics.mse}
        </strong>
        <small>
          Mean Squared Error
        </small>
      </div>


      <div className="metric-card">
        <span>RMSE</span>
        <strong>
          {prediction.metrics.rmse}
        </strong>
        <small>
          Root Mean Squared Error
        </small>
      </div>


      <div className="metric-card">
        <span>R²</span>
        <strong>
          {prediction.metrics.r2}
        </strong>
        <small>
          R-Squared Score
        </small>
      </div>

    </div>

  </div>

)}


              <div className="prediction-header">

                <div>

                  <p className="prediction-label">
                    ML Prediction
                  </p>

                  <h2>
                    Next Trading Price
                  </h2>

                </div>


                <span className="prediction-badge">
                  Random Regression
                </span>

              </div>



              <div className="prediction-price">

                ${prediction.predicted_price}

              </div>



              <div className="prediction-details">


                <div>

                  <span>
                    Current Price
                  </span>

                  <strong>
                    ${prediction.current_price}
                  </strong>

                </div>



                <div>

                  <span>
                    Predicted Change
                  </span>

                  <strong
                    className={
                      prediction.change >= 0
                        ? "positive"
                        : "negative"
                    }
                  >

                    {prediction.change >= 0
                      ? "+"
                      : ""}

                    {prediction.change}

                  </strong>

                </div>



                <div>

                  <span>
                    Change %
                  </span>

                  <strong
                    className={
                      prediction.change_percent >= 0
                        ? "positive"
                        : "negative"
                    }
                  >

                    {prediction.change_percent >= 0
                      ? "+"
                      : ""}

                    {prediction.change_percent}%

                  </strong>

                </div>


              </div>



              <p className="prediction-note">

                This prediction is generated by a
Random Forest model using historical
stock features.

              </p>


            </div>

          )}



          {/* =========================
              PRICE CHART
          ========================= */}

          <div className="chart-container">

            <h2>

              {stock.symbol}
              {" — "}
              Price History

            </h2>


            <ResponsiveContainer
              width="100%"
              height={400}
            >

              <LineChart
                data={history}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />


                <XAxis
                  dataKey="date"
                />


                <YAxis />


                <Tooltip />


                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={false}
                  name="Close"
                />


                <Line
                  type="monotone"
                  dataKey="sma20"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="SMA 20"
                />


                <Line
                  type="monotone"
                  dataKey="sma50"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                  name="SMA 50"
                />

              </LineChart>

            </ResponsiveContainer>

          </div>


        </>

      )}

    </div>

  );

}


export default Dashboard;

