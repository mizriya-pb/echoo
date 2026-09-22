

# Create your tests here.
"""
Automated tests for the ECHOO backend API.

Run them from the folder that contains manage.py:

    python manage.py test

Every test uses Django's test client, so no server has to be running,
and the currency tests never touch the internet (the network call is
replaced with a fake one).
"""

from datetime import timedelta
from unittest.mock import patch

from django.test import TestCase
from django.utils import timezone

from .models import CurrencyRate


# ---------------------------------------------------------------
# GET /   (health check)
# ---------------------------------------------------------------
class HomeTests(TestCase):

    def test_home_says_backend_is_working(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("Working", response.json()["message"])


# ---------------------------------------------------------------
# GET /api/calculate/?expression=...
# ---------------------------------------------------------------
class CalculateTests(TestCase):

    def calc(self, expression):
        return self.client.get("/api/calculate/", {"expression": expression})

    def test_basic_arithmetic(self):
        cases = {
            "2+3": 5,
            "2+3*4": 14,
            "(2+3)*4": 20,
            "10/4": 2.5,
            "-5+3": -2,
            "2^10": 1024,
            "2**3": 8,
        }
        for expression, expected in cases.items():
            with self.subTest(expression=expression):
                response = self.calc(expression)
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.json()["result"], expected)

    def test_functions_and_constants(self):
        cases = {
            "sqrt(16)": 4,
            "sin(30)": 0.5,          # sin works in degrees
            "cos(60)": 0.5,
            "tan(45)": 1,
            "log(100)": 2,           # log is base 10
            "ln(e)": 1,
            "2*pi": 6.283185307,
            "3*sin(30)": 1.5,
        }
        for expression, expected in cases.items():
            with self.subTest(expression=expression):
                response = self.calc(expression)
                self.assertEqual(response.status_code, 200)
                self.assertAlmostEqual(response.json()["result"], expected, places=6)

    def test_response_repeats_the_expression(self):
        response = self.calc("2+3")
        self.assertEqual(response.json()["expression"], "2+3")

    def test_missing_expression_is_rejected(self):
        response = self.client.get("/api/calculate/")
        self.assertEqual(response.status_code, 400)

    def test_bad_expressions_are_rejected(self):
        bad = [
            "1/0",                    # divide by zero
            "sqrt(-1)",               # not a real number
            "log(0)",
            "sin(30",                 # unclosed bracket
            "2+",                     # incomplete
            "x+1",                    # unknown name
            "abs(5)",                 # function that is not allowed
            "sin(1,2)",               # wrong number of arguments
            "2 3",                    # two numbers, no operator
        ]
        for expression in bad:
            with self.subTest(expression=expression):
                self.assertEqual(self.calc(expression).status_code, 400)

    def test_dangerous_input_is_rejected(self):
        dangerous = [
            "__import__('os').system('dir')",
            "open('secret.txt')",
            "().__class__",
            "2;3",
            "2,3",
        ]
        for expression in dangerous:
            with self.subTest(expression=expression):
                self.assertEqual(self.calc(expression).status_code, 400)

    def test_huge_powers_do_not_freeze_the_server(self):
        for expression in ["9^9^9", "2^10000", "10^400"]:
            with self.subTest(expression=expression):
                self.assertEqual(self.calc(expression).status_code, 400)

    def test_very_long_expression_is_rejected(self):
        response = self.calc("1+" * 150 + "1")
        self.assertEqual(response.status_code, 400)


# ---------------------------------------------------------------
# GET /api/binary/?direction=...&value=...
# ---------------------------------------------------------------
class BinaryTests(TestCase):

    def convert(self, direction, value):
        return self.client.get("/api/binary/", {"direction": direction, "value": value})

    def test_all_six_conversions(self):
        cases = [
            ("dec_to_bin", "10", "1010"),
            ("bin_to_dec", "1010", "10"),
            ("dec_to_oct", "8", "10"),
            ("oct_to_dec", "12", "10"),
            ("dec_to_hex", "255", "FF"),
            ("hex_to_dec", "ff", "255"),
            ("hex_to_dec", "FF", "255"),
            ("dec_to_bin", "0", "0"),
        ]
        for direction, value, expected in cases:
            with self.subTest(direction=direction, value=value):
                response = self.convert(direction, value)
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.json()["result"], expected)

    def test_negative_numbers(self):
        self.assertEqual(self.convert("dec_to_bin", "-5").json()["result"], "-101")
        self.assertEqual(self.convert("bin_to_dec", "-101").json()["result"], "-5")

    def test_missing_value_is_rejected(self):
        response = self.client.get("/api/binary/", {"direction": "dec_to_bin"})
        self.assertEqual(response.status_code, 400)

    def test_unknown_direction_is_rejected(self):
        self.assertEqual(self.convert("dec_to_roman", "10").status_code, 400)
        self.assertEqual(self.convert("", "10").status_code, 400)

    def test_invalid_numbers_are_rejected(self):
        bad = [
            ("bin_to_dec", "102"),    # 2 is not a binary digit
            ("oct_to_dec", "89"),     # 8 and 9 are not octal digits
            ("hex_to_dec", "xyz"),
            ("dec_to_bin", "abc"),
            ("dec_to_bin", "10.5"),   # whole numbers only
            ("bin_to_dec", "1_0"),
            ("dec_to_hex", "1 0"),
        ]
        for direction, value in bad:
            with self.subTest(direction=direction, value=value):
                self.assertEqual(self.convert(direction, value).status_code, 400)


# ---------------------------------------------------------------
# GET /api/formula/?formula=...
# ---------------------------------------------------------------
class FormulaTests(TestCase):

    def formula(self, name, **params):
        params["formula"] = name
        return self.client.get("/api/formula/", params)

    def test_every_formula_gives_the_right_answer(self):
        # (formula name, parameters, expected result rounded to 4 places)
        cases = [
            # areas
            ("circle_area", {"radius": 5}, 78.5398),
            ("square_area", {"side": 4}, 16),
            ("rectangle_area", {"length": 5, "width": 3}, 15),
            ("triangle_area", {"base": 10, "height": 5}, 25),
            ("parallelogram_area", {"base": 6, "height": 4}, 24),
            # volumes
            ("cube_volume", {"side": 3}, 27),
            ("cuboid_volume", {"length": 2, "width": 3, "height": 4}, 24),
            ("cylinder_volume", {"radius": 3, "height": 5}, 141.3717),
            ("cone_volume", {"radius": 3, "height": 5}, 47.1239),
            ("sphere_volume", {"radius": 3}, 113.0973),
            # perimeters
            ("square_perimeter", {"side": 4}, 16),
            ("rectangle_perimeter", {"length": 10, "width": 5}, 30),
            ("triangle_perimeter", {"side1": 3, "side2": 4, "side3": 5}, 12),
            ("circle_perimeter", {"radius": 7}, 43.9823),
            ("parallelogram_perimeter", {"base": 5, "side": 3}, 16),
            # others
            ("speed", {"distance": 100, "time": 2}, 50),
            ("simple_interest", {"principal": 1000, "rate": 5, "time": 2}, 100),
            ("bmi", {"weight": 70, "height": 1.75}, 22.8571),
            ("percentage", {"part": 45, "whole": 50}, 90),
            # statistics
            ("mean", {"numbers": "1,2,3,4,5"}, 3),
            ("median", {"numbers": "1,3,2"}, 2),
            ("median", {"numbers": "1,2,3,4"}, 2.5),
            ("variance_population", {"numbers": "1,2,3,4,5"}, 2),
            ("variance_sample", {"numbers": "1,2,3,4,5"}, 2.5),
            ("std_dev_population", {"numbers": "2,4,4,4,5,5,7,9"}, 2),
            ("std_dev_sample", {"numbers": "2,4,4,4,5,5,7,9"}, 2.1381),
            ("z_score", {"value": 70, "mean": 60, "std_dev": 5}, 2),
            ("covariance", {"numbers_x": "1,2,3", "numbers_y": "2,4,6"}, 2),
        ]
        for name, params, expected in cases:
            with self.subTest(formula=name, params=params):
                response = self.formula(name, **params)
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.json()["formula"], name)
                self.assertAlmostEqual(response.json()["result"], expected, places=4)

    def test_mode_returns_a_list(self):
        self.assertEqual(
            self.formula("mode", numbers="1,2,2,3").json()["result"], [2.0]
        )

    def test_mode_with_a_tie_returns_every_mode(self):
        self.assertEqual(
            self.formula("mode", numbers="1,1,2,2,3").json()["result"], [1.0, 2.0]
        )

    def test_unknown_formula_is_rejected(self):
        self.assertEqual(self.formula("pentagon_area", side=3).status_code, 400)
        self.assertEqual(self.client.get("/api/formula/").status_code, 400)

    def test_missing_or_non_numeric_values_are_rejected(self):
        self.assertEqual(self.formula("circle_area").status_code, 400)
        self.assertEqual(self.formula("circle_area", radius="abc").status_code, 400)
        self.assertEqual(
            self.formula("rectangle_area", length=5).status_code, 400
        )

    def test_shape_sizes_must_be_positive(self):
        for radius in ["0", "-5"]:
            with self.subTest(radius=radius):
                self.assertEqual(
                    self.formula("circle_area", radius=radius).status_code, 400
                )
        self.assertEqual(
            self.formula("cylinder_volume", radius=3, height=-1).status_code, 400
        )

    def test_divide_by_zero_is_rejected(self):
        self.assertEqual(self.formula("speed", distance=10, time=0).status_code, 400)
        self.assertEqual(self.formula("bmi", weight=70, height=0).status_code, 400)
        self.assertEqual(self.formula("percentage", part=5, whole=0).status_code, 400)
        self.assertEqual(
            self.formula("z_score", value=1, mean=0, std_dev=0).status_code, 400
        )

    def test_empty_or_too_small_lists_are_rejected(self):
        for name in ["mean", "median", "mode", "variance_population", "std_dev_population"]:
            with self.subTest(formula=name):
                self.assertEqual(self.formula(name, numbers="").status_code, 400)
        # a sample needs at least two numbers
        self.assertEqual(self.formula("variance_sample", numbers="5").status_code, 400)
        self.assertEqual(self.formula("std_dev_sample", numbers="5").status_code, 400)

    def test_covariance_lists_must_match(self):
        response = self.formula("covariance", numbers_x="1,2,3", numbers_y="1,2")
        self.assertEqual(response.status_code, 400)

    def test_nan_and_infinity_are_rejected(self):
        self.assertEqual(self.formula("mean", numbers="nan,1").status_code, 400)
        self.assertEqual(self.formula("mean", numbers="inf,1").status_code, 400)


# ---------------------------------------------------------------
# GET /api/currency/?amount=...&from=...&to=...
# ---------------------------------------------------------------
LIVE_RATES = {
    "result": "success",
    "rates": {"USD": 1, "INR": 90.0, "EUR": 0.9, "GBP": 0.8, "JPY": 150.0, "AUD": 1.5},
}


class FakeResponse:
    """Stands in for the answer from the exchange-rate website."""

    def __init__(self, data):
        self._data = data

    def json(self):
        return self._data


class CurrencyTests(TestCase):

    def convert(self, amount, from_cur, to_cur):
        params = {"from": from_cur, "to": to_cur}
        if amount is not None:
            params["amount"] = amount
        return self.client.get("/api/currency/", params)

    @patch("calculator.views.requests.get")
    def test_conversion_uses_live_rates(self, mock_get):
        mock_get.return_value = FakeResponse(LIVE_RATES)

        response = self.convert(100, "USD", "INR")
        self.assertEqual(response.status_code, 200)
        self.assertAlmostEqual(response.json()["result"], 9000, places=4)

        self.assertAlmostEqual(self.convert(9000, "INR", "USD").json()["result"], 100, places=4)
        self.assertAlmostEqual(self.convert(100, "EUR", "GBP").json()["result"], 88.8889, places=4)

    @patch("calculator.views.requests.get")
    def test_rates_are_saved_and_reused(self, mock_get):
        mock_get.return_value = FakeResponse(LIVE_RATES)

        self.convert(1, "USD", "INR")
        self.convert(1, "USD", "EUR")
        self.convert(1, "USD", "GBP")

        self.assertEqual(mock_get.call_count, 1)          # only one trip to the internet
        self.assertEqual(CurrencyRate.objects.count(), 1)  # and one saved row

    @patch("calculator.views.requests.get")
    def test_fresh_saved_rates_need_no_internet(self, mock_get):
        CurrencyRate.objects.create(rates={"USD": 1.0, "INR": 100.0, "EUR": 0.5})

        response = self.convert(2, "USD", "INR")

        mock_get.assert_not_called()
        self.assertAlmostEqual(response.json()["result"], 200, places=4)

    @patch("calculator.views.requests.get")
    def test_old_rates_are_refreshed(self, mock_get):
        old = CurrencyRate.objects.create(rates={"USD": 1.0, "INR": 100.0})
        CurrencyRate.objects.filter(pk=old.pk).update(
            fetched_at=timezone.now() - timedelta(hours=48)
        )
        mock_get.return_value = FakeResponse(LIVE_RATES)

        response = self.convert(1, "USD", "INR")

        mock_get.assert_called_once()
        self.assertAlmostEqual(response.json()["result"], 90, places=4)

    @patch("calculator.views.requests.get")
    def test_old_saved_rates_are_used_when_internet_fails(self, mock_get):
        old = CurrencyRate.objects.create(rates={"USD": 1.0, "INR": 100.0})
        CurrencyRate.objects.filter(pk=old.pk).update(
            fetched_at=timezone.now() - timedelta(hours=48)
        )
        mock_get.side_effect = Exception("no internet")

        response = self.convert(1, "USD", "INR")

        self.assertEqual(response.status_code, 200)
        self.assertAlmostEqual(response.json()["result"], 100, places=4)

    @patch("calculator.views.requests.get")
    def test_built_in_rates_are_used_when_nothing_else_works(self, mock_get):
        mock_get.side_effect = Exception("no internet")

        response = self.convert(1, "USD", "INR")

        self.assertEqual(response.status_code, 200)
        self.assertAlmostEqual(response.json()["result"], 83.30, places=2)

    @patch("calculator.views.requests.get")
    def test_currency_codes_are_not_case_sensitive(self, mock_get):
        mock_get.return_value = FakeResponse(LIVE_RATES)

        response = self.convert(1, "usd", "inr")

        self.assertEqual(response.status_code, 200)
        self.assertAlmostEqual(response.json()["result"], 90, places=4)

    @patch("calculator.views.requests.get")
    def test_unsupported_currency_is_rejected(self, mock_get):
        mock_get.return_value = FakeResponse(LIVE_RATES)

        self.assertEqual(self.convert(1, "XYZ", "INR").status_code, 400)
        self.assertEqual(self.convert(1, "USD", "XYZ").status_code, 400)
        self.assertEqual(self.convert(1, "", "INR").status_code, 400)

    @patch("calculator.views.requests.get")
    def test_bad_amounts_are_rejected(self, mock_get):
        mock_get.return_value = FakeResponse(LIVE_RATES)

        for amount in [None, "", "abc", "nan", "inf"]:
            with self.subTest(amount=amount):
                self.assertEqual(self.convert(amount, "USD", "INR").status_code, 400)