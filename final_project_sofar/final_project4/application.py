import os
import json
import datetime
import time

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, jsonify
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, current_date, getTeacherSolDay, getTeacherSolWeek, getCentreSol

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














@app.route("/calendarInit", methods=["GET"])
def calendarInit():
    """Send startup data to calendar"""
    if request.method == "GET":
        initData = {}

        # Gets last timeview selected
        sessionData = userdb.execute("SELECT * FROM lastsession WHERE id = :idnum",
                  idnum=session["user_id"])
        userData = userdb.execute("SELECT * FROM users WHERE id = :idnum",
                  idnum=session["user_id"])
        teachers = userdb.execute("SELECT * FROM users WHERE permission = 'teacher' ORDER BY lastName, firstName")
        centres = userdb.execute("SELECT * FROM centres ORDER BY centre, number")
        centreList = getCentreSol(centres)

        initData['templates'] = [render_template("calendar_views/day.html"), render_template("calendar_views/week.html"), render_template("calendar_views/display.html"), render_template("calendar_views/availability.html")]
        initData['time'] = (sessionData[0]['calStartTime'], sessionData[0]['calEndTime'])
        initData['dwd'] = sessionData[0]['calView']
        initData['datePicked'] =sessionData[0]['datePicked']
        initData['teachersSelectedDay'] = sessionData[0]['calTselectDay']
        initData['teacherSelectedWeek'] = sessionData[0]['calTselectWeek']
        initData['centresSelected'] = sessionData[0]['calRselect']
        initData['instruments'] = [('Guitar', 'selected'), ('Banjo', 'unselected')]
        initData['lessonTypes'] = [('AH', 'selected'), ('Weekly', 'unselected')]
        initData['lessonLengths'] = [('30 Minute', 'selected'), ('45 Minute', 'unselected')]
        initData['permissionLevel'] = 'teacher'
        initData['userID'] = session["user_id"]
        initData['username'] ='Shaun'
        initData['teacherListDay'] = getTeacherSolDay(teachers)
        initData['teacherListWeek'] = getTeacherSolWeek(teachers, initData['teacherSelectedWeek'])
        initData['teacherListSingle'] = getTeacherSolWeek(teachers, -1)
        initData['centreList'] = centreList[0]
        initData['uniqueCentreList'] = centreList[1]
        initData['instrumentSol'] = None
        initData['lessonTypeSol'] = None
        initData['lessonLengthSol'] = None

        return json.dumps(initData);

@app.route("/calendarUpdate", methods=["GET", "POST"])
def calendarUpdate():
    """Handles database updates via calendar"""
    if request.method == "POST":
        if request.form.get("type") == 'timePref':
            userdb.execute("UPDATE lastsession SET calStartTime=:newStart, calEndTime=:newEnd WHERE id = :idnum",
                       newStart=request.form.get('from'), newEnd=request.form.get('to'), idnum=session["user_id"])
            return ''
        elif request.form.get("type") == 'calView':
            userdb.execute("UPDATE lastsession SET calView=:view WHERE id = :idnum",
                       view=request.form.get('view'), idnum=session["user_id"])
            return ''
        elif request.form.get("type") == 'teacherSelectsDay':
            userdb.execute("UPDATE lastsession SET calTselectDay=:teacherSelects WHERE id = :idnum",
                       teacherSelects=request.form.get('selects'), idnum=session["user_id"])
            return''
        elif request.form.get("type") == 'teacherSelectsWeek':
            userdb.execute("UPDATE lastsession SET calTselectWeek=:teacherSelects WHERE id = :idnum",
                       teacherSelects=request.form.get('selects'), idnum=session["user_id"])
            return''
        elif request.form.get("type") == 'centreSelects':
            userdb.execute("UPDATE lastsession SET calRselect=:centreSelects WHERE id = :idnum",
                       centreSelects=request.form.get('selects'), idnum=session["user_id"])
            return''
        elif request.form.get("type") == 'newDate':
            userdb.execute("UPDATE lastsession SET datePicked=:newDate WHERE id = :idnum",
                       newDate=request.form.get('datePicked'), idnum=session["user_id"])
            return''
        elif request.form.get("type") == 'availability':
            formDays = {}
            startD = datetime.datetime.strptime(request.form.get('data[start_date]'), "%d/%m/%Y").strftime("%Y-%m-%d")
            endD = datetime.datetime.strptime(request.form.get('data[end_date]'), "%d/%m/%Y").strftime("%Y-%m-%d")
            daySpec = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
            # Where availabilities overlap, delete unneccessary entry
            userdb.execute("DELETE FROM teacher_availability WHERE teacher_id = :teacherID AND centre = :Centre AND start_date >= :startDate AND end_date <= :endDate AND start_time >= :startTime AND end_time <= :endTime AND (monday = :mon OR tuesday = :tue OR wednesday = :wed OR thursday = :thu OR friday = :fri OR saturday = :sat OR sunday = :sun)",
                       teacherID=request.form.get('data[teacher_id]'), startDate=startD, endDate=endD, startTime=request.form.get('data[start_time]'), endTime=request.form.get('data[end_time]'), Centre=request.form.get('data[centre]'),
                       mon=request.form.get('data[monday]'), tue=request.form.get('data[tuesday]'), wed=request.form.get('data[wednesday]'), thu=request.form.get('data[thursday]'), fri=request.form.get('data[friday]'), sat=request.form.get('data[saturday]'), sun=request.form.get('data[sunday]'))
            for i in range(7):
                if request.form.get('data['+daySpec[i]+']') == 'false-':
                    formDays[daySpec[i]] = 'false'
                else:
                    formDays[daySpec[i]] = 'true'
            # Add new availability
            userdb.execute("INSERT INTO teacher_availability (teacher_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday, start_date, end_date, start_time, end_time, centre) VALUES (:teacherID, :mon, :tue, :wed, :thu, :fri, :sat, :sun, :startDate, :endDate, :startTime, :endTime, :Centre)",
                       teacherID=request.form.get('data[teacher_id]'), mon=formDays.get('monday'), tue=formDays.get('tuesday'), wed=formDays.get('wednesday'), thu=formDays.get('thursday'), fri=formDays.get('friday'), sat=formDays.get('saturday'), sun=formDays.get('sunday'),
                       startDate=startD, endDate=endD, startTime=request.form.get('data[start_time]'), endTime=request.form.get('data[end_time]'), Centre=request.form.get('data[centre]'))
            return''

@app.route("/apptRetrieve", methods=["GET", "POST"])
def apptRetrieve():
    """Handles database updates via calendar"""
    if request.method == "POST":
        if request.form.get("type") == 'calendarInfo':
            calendarInfo = {}
            startDate = datetime.datetime.strptime(request.form.get("datespan[start]"), "%d/%m/%Y").strftime("%Y-%m-%d")
            endDate = datetime.datetime.strptime(request.form.get("datespan[end]"), "%d/%m/%Y").strftime("%Y-%m-%d")
            availability = userdb.execute("SELECT * FROM teacher_availability WHERE end_date >= :startDate AND start_date <= :endDate",
                        startDate=startDate, endDate=endDate)
            for dic in availability:
                dic['start_date'] = datetime.datetime.strptime(dic['start_date'], "%Y-%m-%d").strftime("%d/%m/%Y")
                dic['end_date'] = datetime.datetime.strptime(dic['end_date'], "%Y-%m-%d").strftime("%d/%m/%Y")
            calendarInfo['availability'] = availability
            return json.dumps(calendarInfo);

@app.route("/calendar", methods=["GET", "POST"])
@login_required
def calendar():
    teachers = userdb.execute("SELECT * FROM users WHERE permission = 'teacher'")
    return render_template("calendar.html", currentDate=current_date())















@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    #### INCLUDE FIRST NAME LAST NAME

    #### POPULATE LastSession field
    #### -> Query for teachers and

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