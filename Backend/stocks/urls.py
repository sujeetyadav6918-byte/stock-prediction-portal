from django.urls import path

from .views import stock_home, stock_history, stock_prediction


urlpatterns = [
    path("", stock_home, name="stock-home"),
    path("<str:symbol>/history/", stock_history, name="stock-history"),
    path("<str:symbol>/prediction/",stock_prediction,name="stock-prediction"),
]