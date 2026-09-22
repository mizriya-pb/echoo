import ast
import math
import re
from collections import Counter
from datetime import timedelta

import requests
from django.http import JsonResponse
from django.utils import timezone

from .models import CurrencyRate


def home(request):
    return JsonResponse({
        "message": "Scientific Voice Calculator Backend is Working!"
    })


MAX_EXPRESSION_LENGTH = 200

# only these functions and constants may appear in an expression
SAFE_FUNCTIONS = {
    "sin": lambda x: math.sin(math.radians(x)),
    "cos": lambda x: math.cos(math.radians(x)),
    "tan": lambda x: math.tan(math.radians(x)),
    "sqrt": math.sqrt,
    "log": math.log10,
    "ln": math.log,
}

SAFE_CONSTANTS = {
    "pi": math.pi,
    "e": math.e,
}


def _apply_operator(op, left, right):
    if isinstance(op, ast.Add):
        return left + right
    if isinstance(op, ast.Sub):
        return left - right
    if isinstance(op, ast.Mult):
        return left * right
    if isinstance(op, ast.Div):
        return left / right
    if isinstance(op, ast.FloorDiv):
        return left // right
    if isinstance(op, ast.Pow):
        # stop things like 9^9^9 from freezing the server:
        # refuse any power whose answer would have more than 300 digits
        if left != 0 and right * math.log10(abs(left)) > 300:
            raise ValueError("Power is too large")
        return left ** right
    raise ValueError("Operator not allowed")


def _evaluate(node):
    """Walks the parsed expression and only allows numbers, + - * / **,
    brackets, the constants pi and e, and the functions in SAFE_FUNCTIONS."""

    if isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)) and not isinstance(node.value, bool):
            return node.value
        raise ValueError("Only numbers are allowed")

    if isinstance(node, ast.Name) and node.id in SAFE_CONSTANTS:
        return SAFE_CONSTANTS[node.id]

    if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.UAdd, ast.USub)):
        value = _evaluate(node.operand)
        return value if isinstance(node.op, ast.UAdd) else -value

    if isinstance(node, ast.BinOp):
        return _apply_operator(node.op, _evaluate(node.left), _evaluate(node.right))

    if (
        isinstance(node, ast.Call)
        and isinstance(node.func, ast.Name)
        and node.func.id in SAFE_FUNCTIONS
        and len(node.args) == 1
        and not node.keywords
    ):
        return SAFE_FUNCTIONS[node.func.id](_evaluate(node.args[0]))

    raise ValueError("Expression not allowed")


def calculate(request):
    expression = request.GET.get("expression", "")

    if not expression:
        return JsonResponse({"error": "Please provide an expression"}, status=400)

    if len(expression) > MAX_EXPRESSION_LENGTH:
        return JsonResponse({"error": "Expression is too long"}, status=400)

    # now allows letters too, since sin/cos/sqrt/etc are needed
    allowed = re.compile(r"^[0-9+\-*/().\s\^a-z]*$")
    if not allowed.match(expression):
        return JsonResponse({"error": "Invalid characters in expression"}, status=400)

    safe_expr = expression.replace("^", "**")  # ^ means "power" here

    try:
        result = _evaluate(ast.parse(safe_expr.strip(), mode="eval").body)
    except Exception:
        return JsonResponse({"error": "Could not calculate that"}, status=400)

    if isinstance(result, float) and (math.isnan(result) or math.isinf(result)):
        return JsonResponse({"error": "Could not calculate that"}, status=400)

    return JsonResponse({"expression": expression, "result": result})


def binary_convert(request):
    direction = request.GET.get("direction", "")
    value = request.GET.get("value", "").strip()

    if not value:
        return JsonResponse({"error": "Please provide a value"}, status=400)

    if "_" in value or " " in value:
        return JsonResponse({"error": "Invalid number for this conversion"}, status=400)

    # direction -> (base the input is written in, how to write the answer)
    conversions = {
        "dec_to_bin": (10, "b"),
        "bin_to_dec": (2, "d"),
        "dec_to_oct": (10, "o"),
        "oct_to_dec": (8, "d"),
        "dec_to_hex": (10, "X"),
        "hex_to_dec": (16, "d"),
    }

    if direction not in conversions:
        return JsonResponse(
            {"error": "direction must be one of: " + ", ".join(conversions)},
            status=400,
        )

    input_base, output_format = conversions[direction]

    try:
        number = int(value, input_base)
    except ValueError:
        return JsonResponse({"error": "Invalid number for this conversion"}, status=400)

    return JsonResponse({"result": format(number, output_format)})


def formula_calculate(request):
    formula = request.GET.get("formula", "")

    def get_numbers(param_name):
        raw = request.GET.get(param_name, "")
        return [float(x.strip()) for x in raw.split(",") if x.strip() != ""]

    # sizes of shapes must be positive numbers
    if formula.endswith(("_area", "_volume", "_perimeter")):
        for key in ("radius", "side", "length", "width", "height", "base",
                    "side1", "side2", "side3"):
            raw = request.GET.get(key)
            if raw is None:
                continue
            try:
                if float(raw) <= 0:
                    return JsonResponse({"error": "Sizes must be greater than zero"}, status=400)
            except ValueError:
                pass  # the normal "invalid numbers" message below handles this

    try:
        if formula == "circle_area":
            r = float(request.GET.get("radius"))
            result = math.pi * r ** 2

        elif formula == "square_area":
            side = float(request.GET.get("side"))
            result = side ** 2

        elif formula == "rectangle_area":
            length = float(request.GET.get("length"))
            width = float(request.GET.get("width"))
            result = length * width

        elif formula == "triangle_area":
            base = float(request.GET.get("base"))
            height = float(request.GET.get("height"))
            result = 0.5 * base * height

        elif formula == "parallelogram_area":
            base = float(request.GET.get("base"))
            height = float(request.GET.get("height"))
            result = base * height

        elif formula == "cube_volume":
            side = float(request.GET.get("side"))
            result = side ** 3

        elif formula == "cuboid_volume":
            l = float(request.GET.get("length"))
            w = float(request.GET.get("width"))
            h = float(request.GET.get("height"))
            result = l * w * h

        elif formula == "cylinder_volume":
            r = float(request.GET.get("radius"))
            h = float(request.GET.get("height"))
            result = math.pi * r ** 2 * h

        elif formula == "cone_volume":
            r = float(request.GET.get("radius"))
            h = float(request.GET.get("height"))
            result = (1/3) * math.pi * r ** 2 * h

        elif formula == "sphere_volume":
            r = float(request.GET.get("radius"))
            result = (4/3) * math.pi * r ** 3

        elif formula == "square_perimeter":
            side = float(request.GET.get("side"))
            result = 4 * side

        elif formula == "rectangle_perimeter":
            length = float(request.GET.get("length"))
            width = float(request.GET.get("width"))
            result = 2 * (length + width)

        elif formula == "triangle_perimeter":
            a = float(request.GET.get("side1"))
            b = float(request.GET.get("side2"))
            c = float(request.GET.get("side3"))
            result = a + b + c

        elif formula == "circle_perimeter":
            r = float(request.GET.get("radius"))
            result = 2 * math.pi * r

        elif formula == "parallelogram_perimeter":
            base = float(request.GET.get("base"))
            side = float(request.GET.get("side"))
            result = 2 * (base + side)

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
            if not nums:
                raise ValueError("no numbers")
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

    if math.isnan(result) or math.isinf(result):
        return JsonResponse({"error": "Missing or invalid numbers"}, status=400)

    return JsonResponse({"formula": formula, "result": round(result, 4)})


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
    from_cur = (request.GET.get("from") or "").upper()
    to_cur = (request.GET.get("to") or "").upper()

    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return JsonResponse({"error": "amount must be a number"}, status=400)

    if math.isnan(amount) or math.isinf(amount):
        return JsonResponse({"error": "amount must be a number"}, status=400)

    rates = get_current_rates()

    if from_cur not in rates or to_cur not in rates:
        return JsonResponse({"error": f"Unsupported currency. Available: {list(rates.keys())}"}, status=400)

    usd_value = amount / rates[from_cur]
    result = usd_value * rates[to_cur]

    return JsonResponse({"result": round(result, 4)})