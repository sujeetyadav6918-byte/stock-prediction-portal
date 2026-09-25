
import yfinance as yf
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)


def predict_stock(symbol):

    symbol = symbol.upper()

    # =========================
    # GET HISTORICAL DATA
    # =========================

    stock = yf.Ticker(symbol)

    data = stock.history(period="2y")

    if data.empty:
        raise ValueError(
            f"No data found for {symbol}"
        )


    # =========================
    # FEATURE ENGINEERING
    # =========================

    data["SMA20"] = (
        data["Close"]
        .rolling(20)
        .mean()
    )

    data["SMA50"] = (
        data["Close"]
        .rolling(50)
        .mean()
    )

    data["Daily_Return"] = (
        data["Close"]
        .pct_change()
    )


    # Remove missing values

    data = data.dropna()


    # =========================
    # FEATURES
    # =========================

    features = [
        "Close",
        "SMA20",
        "SMA50",
        "Daily_Return",
        "Volume",
    ]


    # Target = next day's closing price

    data["Target"] = (
        data["Close"]
        .shift(-1)
    )

    data = data.dropna()


    X = data[features]

    y = data["Target"]


    # =========================
    # TRAIN / TEST SPLIT
    # =========================

    split_index = int(
        len(data) * 0.8
    )

    X_train = X.iloc[:split_index]

    X_test = X.iloc[split_index:]

    y_train = y.iloc[:split_index]

    y_test = y.iloc[split_index:]


    # =========================
    # RANDOM FOREST MODEL
    # =========================

    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42,
        n_jobs=-1,
    )


    model.fit(
        X_train,
        y_train
    )


    # =========================
    # TEST PREDICTIONS
    # =========================

    y_pred = model.predict(
        X_test
    )


    # =========================
    # MODEL METRICS
    # =========================

    mae = mean_absolute_error(
        y_test,
        y_pred
    )

    mse = mean_squared_error(
        y_test,
        y_pred
    )

    rmse = np.sqrt(mse)

    r2 = r2_score(
        y_test,
        y_pred
    )


    # =========================
    # NEXT DAY PREDICTION
    # =========================

    latest_features = (
        data[features]
        .iloc[-1:]
    )

    predicted_price = model.predict(
        latest_features
    )[0]


    current_price = float(
        data["Close"].iloc[-1]
    )


    change = (
        predicted_price -
        current_price
    )


    if current_price != 0:

        change_percent = (
            change /
            current_price
        ) * 100

    else:

        change_percent = 0


    # =========================
    # RESULT
    # =========================

    return {

        "symbol": symbol,

        "current_price": round(
            current_price,
            2
        ),

        "predicted_price": round(
            float(predicted_price),
            2
        ),

        "change": round(
            float(change),
            2
        ),

        "change_percent": round(
            float(change_percent),
            2
        ),

        "model": "Random Forest",

        "features": features,

        "metrics": {

            "mae": round(
                float(mae),
                4
            ),

            "mse": round(
                float(mse),
                4
            ),

            "rmse": round(
                float(rmse),
                4
            ),

            "r2": round(
                float(r2),
                4
            ),

        },

    }

