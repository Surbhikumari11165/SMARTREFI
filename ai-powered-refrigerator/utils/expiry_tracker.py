from datetime import datetime

SHELF_LIFE = {
    "vegetable": 7,
    "fruit": 10,
    "dairy": 14,
    "meat": 5,
    "leftover": 4
}

def get_expiry_status(item):
    today = datetime.now()
    added = datetime.strptime(item["addedOn"], "%Y-%m-%d")

    days_old = (today - added).days
    shelf = SHELF_LIFE.get(item["category"], 7)

    days_left = shelf - days_old

    if days_left < 0:
        return "expired"
    elif days_left <= 2:
        return "expiring"
    else:
        return "fresh"