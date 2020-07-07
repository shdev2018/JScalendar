import os
import json

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, current_date, solify, getfullname, getTime

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True


# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite databases
userdb = SQL("sqlite:///databases/users.db")


# Get username
def getuser():
    user = userdb.execute("SELECT username FROM users WHERE id = :idnum",
                      idnum=session["user_id"])
    return user[0]['username']


@app.route("/")
@login_required
def index():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Query database for username
        rows = userdb.execute("SELECT * FROM users WHERE username = :username",
                          username=request.form.get("username"))

        if rows:
            # Remember which user has logged in
            session["user_id"] = rows[0]["id"]

            # Redirect user to home page
            return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")





def errorhandler(e):
    """Handle error"""
    return apology(e.name, e.code)


# listen for errors
for code in default_exceptions:
    app.errorhandler(code)(errorhandler)











@app.route("/loginjs", methods=["POST"])
def loginjs():
    """Log user in"""

    # Query database for username
    rows = userdb.execute("SELECT * FROM users WHERE username = :username",
                      username=request.form.get("username"))

    # Ensure username exists and password is correct
    if not rows:
        #Gets this far
        return json.dumps('Invalid username or password.');
    elif not check_password_hash(rows[0]["passhash"], request.form.get("password")):
        return json.dumps('Invalid username or password.');
    else:
        return json.dumps(1);


@app.route("/calendarjs", methods=["GET", "POST"])
def calendarjs():
    """Log user in"""
    if request.method == "POST":
        # Return teacher list

#        if request.form.get('type') == 'Teachers':
#            # Get current list of teachers
#            teachers = userdb.execute("SELECT * FROM users WHERE permission = 'teacher'")
#            return json.dumps(solify(teachers));

        # Gets last timeview selected
        if request.form.get('type') == 'popover_init':
            startTime = userdb.execute("SELECT calStartTime FROM lastsession WHERE id = :idnum",
                      idnum=session["user_id"])
            endTime = userdb.execute("SELECT calEndTime FROM lastsession WHERE id = :idnum",
                      idnum=session["user_id"])

            startTime = startTime[0]['calStartTime']
            endTime = endTime[0]['calEndTime']

            data = getTime(startTime, endTime)
            timeCol = data[0]
            end = data[1]
            rows = data[2]

            times = [render_template("calendar_views/popoverForm.html"), timeCol, end, rows] ########## Passing Time [{'calStartTime': '00:00'}, {'calEndTime': '00:00'}]

            print(timeCol)
            print(end)
            print(rows)

            return json.dumps(times);                                                 ########## Passing html. Now need to handle conversion in helpers.

        # Render Apt Schedule and pass in data (currently number of slots)
        elif request.form.get('type') == 'day':
            day = [render_template("calendar_views/day.html"), 96]
            return json.dumps(day);
        elif request.form.get('type') == 'week':
            week = [render_template("calendar_views/week.html"), 96]
            return json.dumps(week);
        elif request.form.get('type') == 'month':
            month = [render_template("calendar_views/month.html"), 96]
            return json.dumps(month);



@app.route("/calendar", methods=["GET", "POST"])
@login_required
def calendar():
    teachers = userdb.execute("SELECT * FROM users WHERE permission = 'teacher'")
    centres = userdb.execute("SELECT centres FROM centres")
    return render_template("calendar.html", currentDate=current_date(), teachers=getfullname(teachers), centres=centres)






@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    #### INCLUDE FIRST NAME LAST NAME


    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            # JS REPLACE
            return apology("must provide username", 400)

        # Ensure password was submitted
        elif not request.form.get("password"):
            # JS REPLACE
            return apology("must provide password", 400)

        # Ensure confirmation was submitted
        elif not request.form.get("confirmation"):
            # JS REPLACE
            return apology("must confirm password", 400)

        confirmation = request.form.get("confirmation")

        # Query database for username
        rows = userdb.execute("SELECT * FROM users WHERE username = :username",
                          username=request.form.get("username"))

        # Check if username already exists
        if len(rows) > 0:
            # JS REPLACE
            return apology("username unavailable", 400)

        # Compare password & confirmation
        if request.form.get("password") != request.form.get("confirmation"):
            # JS REPLACE
            return apology("passwords do not match", 400)

        # Store data in database
        userdb.execute("INSERT INTO users (username, passhash) VALUES (:username, :passhash)",
                   username=request.form.get("username"), passhash=generate_password_hash(request.form.get("password")))

        # Create personal data table
        userdb.execute("CREATE TABLE :username ('transaction_id' integer PRIMARY KEY AUTOINCREMENT NOT NULL, 'transaction_type' text NOT NULL, 'stock_ticker' text NOT NULL, 'quantity' integer NOT NULL, 'transfer' numeric(2) NOT NULL, 'time' datetime NOT NULL DEFAULT CURRENT_TIMESTAMP)",
                   username=request.form.get("username"))

        # Redirect user to home page
        return render_template("login.html")

    else:
        return render_template("register.html")