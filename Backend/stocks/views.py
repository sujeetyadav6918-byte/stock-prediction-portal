import yfinance as yf

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .ml.predictor import predict_stock

@api_view(["GET"])
def stock_home(request):
    symbol = request.GET.get("symbol", "AAPL").upper()

    try:
        stock = yf.Ticker(symbol)
        data = stock.history(period="1mo")

        if data.empty:
            return Response(
                {
                    "status": "error",
                    "message": f"Stock '{symbol}' not found."
                },
                status=404
            )

        latest = data.iloc[-1]
        previous = data.iloc[-2] if len(data) > 1 else latest

        current_price = float(latest["Close"])
        previous_price = float(previous["Close"])

        price_change = current_price - previous_price

        if previous_price != 0:
            percentage_change = (price_change / previous_price) * 100
        else:
            percentage_change = 0

        if price_change > 0:
            trend = "Bullish"
        elif price_change < 0:
            trend = "Bearish"
        else:
            trend = "Neutral"

        return Response({
            "status": "success",
            "symbol": symbol,
            "price": round(current_price, 2),
            "open": round(float(latest["Open"]), 2),
            "high": round(float(latest["High"]), 2),
            "low": round(float(latest["Low"]), 2),
            "volume": int(latest["Volume"]),
            "change": round(price_change, 2),
            "change_percent": round(percentage_change, 2),
            "trend": trend,
        })

    except Exception as e:
        return Response(
            {
                "status": "error",
                "message": str(e)
            },
            status=500
        )

    
@api_view(["GET"])
def stock_history(request, symbol):
    symbol = symbol.upper()

    period = request.GET.get("period", "1mo")

    allowed_periods = [
        "1mo",
        "3mo",
        "6mo",
        "1y",
        "5y",
    ]

    if period not in allowed_periods:
        return Response(
            {
                "status": "error",
                "message": "Invalid period."
            },
            status=400
        )

    try:
        stock = yf.Ticker(symbol)

        data = stock.history(period=period)

        if data.empty:
            return Response(
                {
                    "status": "error",
                    "message": f"No historical data found for {symbol}."
                },
                status=404
            )

        # Calculate Simple Moving Averages
        data["SMA20"] = data["Close"].rolling(window=20).mean()
        data["SMA50"] = data["Close"].rolling(window=50).mean()

        history = []

        for date, row in data.iterrows():

            sma20 = None
            sma50 = None

            if row["SMA20"] == row["SMA20"]:
                sma20 = round(float(row["SMA20"]), 2)

            if row["SMA50"] == row["SMA50"]:
                sma50 = round(float(row["SMA50"]), 2)

            history.append({
                "date": date.strftime("%Y-%m-%d"),
                "open": round(float(row["Open"]), 2),
                "high": round(float(row["High"]), 2),
                "low": round(float(row["Low"]), 2),
                "close": round(float(row["Close"]), 2),
                "volume": int(row["Volume"]),
                "sma20": sma20,
                "sma50": sma50,
            })

        return Response({
            "status": "success",
            "symbol": symbol,
            "period": period,
            "data": history
        })

    except Exception as e:
        return Response(
            {
                "status": "error",
                "message": str(e)
            },
            status=500
        )


@api_view(["GET"])
def stock_prediction(request, symbol):

    try:
        result = predict_stock(symbol)

        return Response({
            "status": "success",
            "prediction": result
        })

    except Exception as e:

        return Response(
            {
                "status": "error",
                "message": str(e)
            },
            status=500
        )