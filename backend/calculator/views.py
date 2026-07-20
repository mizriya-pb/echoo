from datetime import timedelta
from django.utils import timezone
import requests
from .models import CurrencyRate
import math
import re
from django.http import JsonResponse
from collections import Counter
import json
from django.views.decorators.csrf import csrf_exempt


def home(request):
    return JsonResponse({
        "message": "Scientific Voice Calculator Backend is Working!"
    })


def calculate(request):
    expression = request.GET.get("expression", "")

    if not expression:
        return JsonResponse({"error": "Please provide an expression"}, status=400)

    # now allows letters too, since sin/cos/sqrt/etc are needed
    allowed = re.compile(r"^[0-9+\-*/().\s\^a-z]*$")
    if not allowed.match(expression):
        return JsonResponse({"error": "Invalid characters in expression"}, status=400)

    safe_expr = expression.replace("^", "**")  # ^ means "power" here

    # only these function names are allowed to run — nothing else
    safe_functions = {
        "__builtins__": {},
        "sin": lambda x: math.sin(math.radians(x)),
        "cos": lambda x: math.cos(math.radians(x)),
        "tan": lambda x: math.tan(math.radians(x)),
        "sqrt": math.sqrt,
        "log": math.log10,
        "ln": math.log,
        "pi": math.pi,
        "e": math.e,
    }

    try:
        result = eval(safe_expr, safe_functions, {})
    except Exception:
        return JsonResponse({"error": "Could not calculate that"}, status=400)

    return JsonResponse({"expression": expression, "result": result})

def binary_convert(request):
    direction = request.GET.get("direction", "")  # "dec_to_bin" or "bin_to_dec"
    value = request.GET.get("value", "")

    if not value:
        return JsonResponse({"error": "Please provide a value"}, status=400)

    try:
        if direction == "dec_to_bin":
            result = bin(int(value))[2:]  # [2:] strips the "0b" prefix Python adds
        elif direction == "bin_to_dec":
            result = str(int(value, 2))
        else:
            return JsonResponse({"error": "direction must be dec_to_bin or bin_to_dec"}, status=400)
    except ValueError:
        return JsonResponse({"error": "Invalid number for this conversion"}, status=400)

    return JsonResponse({"result": result})

def formula_calculate(request):
    formula = request.GET.get("formula", "")

    def get_numbers(param_name):
        raw = request.GET.get(param_name, "")
        return [float(x.strip()) for x in raw.split(",") if x.strip() != ""]

    try:
        if formula == "circle_area":
            r = float(request.GET.get("radius"))
            result = math.pi * r ** 2

        elif formula == "speed":
            distance = float(request.GET.get("distance"))
            time = float(request.GET.get("time"))
            if time == 0:
                return JsonResponse({"error": "Time cannot be zero"}, status=400)
            result = distance / time

        elif formula == "simple_interest":
            p = float(request.GET.get("principal"))
            r = float(request.GET.get("rate"))
            t = float(request.GET.get("time"))
            result = (p * r * t) / 100

        elif formula == "bmi":
            weight = float(request.GET.get("weight"))
            height = float(request.GET.get("height"))
            if height == 0:
                return JsonResponse({"error": "Height cannot be zero"}, status=400)
            result = weight / (height ** 2)

        elif formula == "percentage":
            part = float(request.GET.get("part"))
            whole = float(request.GET.get("whole"))
            if whole == 0:
                return JsonResponse({"error": "Whole cannot be zero"}, status=400)
            result = (part / whole) * 100

        elif formula == "mean":
            nums = get_numbers("numbers")
            result = sum(nums) / len(nums)

        elif formula == "median":
            nums = sorted(get_numbers("numbers"))
            mid = len(nums) // 2
            result = nums[mid] if len(nums) % 2 else (nums[mid - 1] + nums[mid]) / 2

        elif formula == "mode":
            nums = get_numbers("numbers")
            counts = Counter(nums)
            highest = max(counts.values())
            modes = sorted(v for v, c in counts.items() if c == highest)
            return JsonResponse({"formula": formula, "result": modes})

        elif formula == "variance_population":
            nums = get_numbers("numbers")
            m = sum(nums) / len(nums)
            result = sum((x - m) ** 2 for x in nums) / len(nums)

        elif formula == "variance_sample":
            nums = get_numbers("numbers")
            m = sum(nums) / len(nums)
            result = sum((x - m) ** 2 for x in nums) / (len(nums) - 1)

        elif formula == "std_dev_population":
            nums = get_numbers("numbers")
            m = sum(nums) / len(nums)
            result = math.sqrt(sum((x - m) ** 2 for x in nums) / len(nums))

        elif formula == "std_dev_sample":
            nums = get_numbers("numbers")
            m = sum(nums) / len(nums)
            result = math.sqrt(sum((x - m) ** 2 for x in nums) / (len(nums) - 1))

        elif formula == "z_score":
            x = float(request.GET.get("value"))
            mean = float(request.GET.get("mean"))
            std_dev = float(request.GET.get("std_dev"))
            if std_dev == 0:
                return JsonResponse({"error": "Standard deviation cannot be zero"}, status=400)
            result = (x - mean) / std_dev

        elif formula == "covariance":
            xs = get_numbers("numbers_x")
            ys = get_numbers("numbers_y")
            if len(xs) != len(ys):
                return JsonResponse({"error": "Both lists must be the same length"}, status=400)
            mx = sum(xs) / len(xs)
            my = sum(ys) / len(ys)
            result = sum((xs[i] - mx) * (ys[i] - my) for i in range(len(xs))) / (len(xs) - 1)

        else:
            return JsonResponse({"error": f"Unknown formula: {formula}"}, status=400)

    except (TypeError, ValueError, ZeroDivisionError):
        return JsonResponse({"error": "Missing or invalid numbers"}, status=400)

    return JsonResponse({"formula": formula, "result": round(result, 4)})

@csrf_exempt
def matrix_calculate(request):
    if request.method != "POST":
        return JsonResponse({"error": "This endpoint needs a POST request"}, status=400)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    operation = body.get("operation")   # "add", "sub", or "mul"
    a = body.get("matrix_a")
    b = body.get("matrix_b")

    if not a or not b:
        return JsonResponse({"error": "Provide matrix_a and matrix_b"}, status=400)

    rows_a, cols_a = len(a), len(a[0])
    rows_b, cols_b = len(b), len(b[0])

    try:
        if operation == "add":
            result = [[a[r][c] + b[r][c] for c in range(cols_a)] for r in range(rows_a)]
        elif operation == "sub":
            result = [[a[r][c] - b[r][c] for c in range(cols_a)] for r in range(rows_a)]
        elif operation == "mul":
            if cols_a != rows_b:
                return JsonResponse({"error": "Matrix sizes don't match for multiplication"}, status=400)
            result = [[sum(a[r][k] * b[k][c] for k in range(cols_a)) for c in range(cols_b)] for r in range(rows_a)]
        else:
            return JsonResponse({"error": "operation must be add, sub, or mul"}, status=400)
    except (IndexError, TypeError):
        return JsonResponse({"error": "Matrices must be the same size to add/subtract"}, status=400)

    return JsonResponse({"result": result})

FALLBACK_RATES = {
    "USD": 1.0,
    "INR": 83.30,
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 157.20,
    "AUD": 1.51,
}


def get_current_rates():
    """Reuses saved rates if they're under 24 hours old, otherwise fetches fresh ones."""
    latest = CurrencyRate.objects.order_by("-fetched_at").first()

    is_stale = True
    if latest:
        is_stale = (timezone.now() - latest.fetched_at) > timedelta(hours=24)

    if latest and not is_stale:
        return latest.rates  # reuse saved rates, still fresh

    try:
        response = requests.get("https://open.er-api.com/v6/latest/USD", timeout=8)
        data = response.json()
        all_rates = data["rates"]
        updated = {cur: all_rates[cur] for cur in FALLBACK_RATES if cur in all_rates}
        updated["USD"] = 1.0
        CurrencyRate.objects.create(rates=updated)  # save with today's timestamp
        return updated
    except Exception:
        if latest:
            return latest.rates  # internet failed — use last known rates instead of crashing
        return FALLBACK_RATES  # no saved rates at all — use the fixed backup table
    
def currency_convert(request):
    amount = request.GET.get("amount")
    from_cur = request.GET.get("from")
    to_cur = request.GET.get("to")

    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return JsonResponse({"error": "amount must be a number"}, status=400)

    rates = get_current_rates()

    if from_cur not in rates or to_cur not in rates:
        return JsonResponse({"error": f"Unsupported currency. Available: {list(rates.keys())}"}, status=400)

    usd_value = amount / rates[from_cur]
    result = usd_value * rates[to_cur]

    return JsonResponse({"result": round(result, 4)})  