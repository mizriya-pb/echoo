from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
    path('api/calculate/', views.calculate),
    path('api/binary/', views.binary_convert),
    path('api/formula/', views.formula_calculate),
    path('api/matrix/', views.matrix_calculate),
]