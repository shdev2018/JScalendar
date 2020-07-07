import requests
import urllib.parse
import datetime

from flask import redirect, render_template, request, session
from functools import wraps

def apology(message, code=400):
    """Render message as an apology to user."""
    def escape(s):
        """
        Escape special characters.

        https://github.com/jacebrowning/memegen#special-characters
        """
        for old, new in [("-", "--"), (" ", "-"), ("_", "__"), ("?", "~q"),
                         ("%", "~p"), ("#", "~h"), ("/", "~s"), ("\"", "''")]:
            s = s.replace(old, new)
        return s
    return render_template("apology.html", top=code, bottom=escape(message)), code


def login_required(f):
    """
    Decorate routes to require login.

    http://flask.pocoo.org/docs/0.12/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function


def current_date():
    now = datetime.datetime.now()
    return now.strftime("%a %d %b %Y")


def solify(lofd):
    soldata = []
    i = 0
    for dic in lofd:
        soldata.append({"type": "option", "selected": "true"})
        soldata[i]["value"] = dic['id']
        soldata[i]["label"] = ''.join([dic['firstName'], ' ', dic['lastName']])
        i += 1
    return soldata

def getfullname(lofd):
    teachers = []
    i = 0
    for dic in lofd:
        teachers.append({})
        teachers[i][dic['id']] = ''.join([dic['firstName'], ' ', dic['lastName']])
        i += 1
    return teachers

def getTime(start, end):
    spectrum = {'2': '00:00', '3': '00:15', '4': '00:30', '5': '00:45', '6': '01:00', '7': '01:15', '8': '01:30', '9': '01:45', '10': '02:00', '11': '02:15', '12': '02:30', '13': '02:45', '14': '03:00', '15': '03:15', '16': '03:30', '17': '03:45', '18': '04:00', '19': '04:15', '20': '04:30', '21': '04:45', '22': '05:00', '23': '05:15', '24': '05:30', '25': '05:45', '26': '06:00', '27': '06:15', '28': '06:30', '29': '06:45', '30': '07:00', '31': '07:15', '32': '07:30', '33': '07:45', '34': '08:00', '35': '08:15', '36': '08:30', '37': '08:45', '38': '09:00', '39': '09:15', '40': '09:30', '41': '09:45', '42': '10:00', '43': '10:15', '44': '10:30', '45': '10:45', '46': '11:00', '47': '11:15', '48': '11:30', '49': '11:45', '50': '12:00', '51': '12:15', '52': '12:30', '53': '12:45', '54': '13:00', '55': '13:15', '56': '13:30', '57': '13:45', '58': '14:00', '59': '14:15', '60': '14:30', '61': '14:45', '62': '15:00', '63': '15:15', '64': '15:30', '65': '15:45', '66': '16:00', '67': '16:15', '68': '16:30', '69': '16:45', '70': '17:00', '71': '17:15', '72': '17:30', '73': '17:45', '74': '18:00', '75': '18:15', '76': '18:30', '77': '18:45', '78': '19:00', '79': '19:15', '80': '19:30', '81': '19:45', '82': '20:00', '83': '20:15', '84': '20:30', '85': '20:45', '86': '21:00', '87': '21:15', '88': '21:30', '89': '21:45', '90': '22:00', '91': '22:15', '92': '22:30', '93': '22:45', '94': '23:00', '95': '23:15', '96': '23:30', '97': '23:45', '98': '24:00'}
    timeCol = []
    to = []
    start = int(start)
    end = int(end)
    rows = end - start
    while start <= end:
        time = spectrum[str(start)]
        timeCol.append((start, time))
        if int(start) % 4 == 2:
            to.append((start, time))
        start += 1
    to.pop(0)
    return (timeCol, to, rows)