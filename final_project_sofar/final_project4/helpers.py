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


def getTeacherSolDay(lofd):
    teachers = []
    i = 0
    for dic in lofd:
        teachers.append({"type": "option", "selected": "true"})
        teachers[i]["value"] = dic['id']
        teachers[i]["label"] = ''.join([dic['firstName'], ' ', dic['lastName']])
        i += 1
    return teachers

def getTeacherSolWeek(lofd, selected):
    teachers = []
    i = 0
    for dic in lofd:
        teachers.append({"type": "option"})
        if dic['id'] == selected:
            teachers[i]["selected"] = "true"
        teachers[i]["value"] = dic['id']
        teachers[i]["label"] = ''.join([dic['firstName'], ' ', dic['lastName']])
        i += 1
    return teachers


def getCentreSol(lofd):
    centreData = []
    uniqueCentreData = []
    uniqueCentres = list(set([name['centre'] for name in lofd]))
    for centre in uniqueCentres:
        uniqueCentreData.append({"type": "option", "label": centre, "value": centre})
        children = []
        for dic in lofd:
            if dic['centre'] == centre:
                children.append({"type": "option", "value": ''.join([dic['centre'], str(dic['number'])]), "label": ''.join([dic['roomName'], ' ', str(dic['number'])])})
        centreData.append({"type": "optiongroup", "label": centre, "children": children})
    return (centreData, uniqueCentreData)