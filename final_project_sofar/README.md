# CS50 Final Project – Plugin Calendar API 
### Video at <https://youtu.be/1dkeSseafiU>

##### Aims
For my Final Project I have built a plugin calendar api designed for use by small businesses for scheduling appointments and keeping track of staff availability.

My aim for this project was to implement the MVC model, creating a clear distinction between:

* The application (Model) - a python file which handles database requests.
* The view - HTML and CSS along with a Javascript file which handles dynamic content.
* The controller - a separate Javascript file which makes AJAX requests of the model and then crunches the requested data before feeding it to the view.

I also wanted to allow for straightforward third party implementation of the api and tried (as much as possible) to reduce the endpoint to that of a typical cdn, i.e. one or two importable javascript and css files along with a summoning div id and single class instantiation.

##### Purpose
For the purposes of the final project, I have created a basic website to surround the calendar and feed it the necessary data to correctly initialise it. In this instance, I have tailored the calendar for use for a music school, but it could just as easily be used for a company with a similar 'appointment-based' setup.

##### Web App Features
I have included the typical 'Register' and 'Login' functionality. Currently, when someone registers, this creates a new user who will appear in the calendar service-provider list.

On the dashboard, after logging in, I have included buttons to add/change or remove data. Currently, I have only activated the ability to edit your own profile, username, password, etc.

##### Calendar Features
The calendar itself utilises all the expected features, e.g. days of the week, time index, day picker to select the visible day, etc. But there are a few other features that make the calendar more suitable for a business.

Within the back-end database, there is a table dedicated solely to remembering unique session data (beyond cookie functionality) for the user logged in.

There is a 'today' button which snaps to the current day, this also defaults to 'day' view.

There are forward and backward buttons used to leaf through the successive days or weeks (depending on viewing mode).

There is a 'display' button which opens a settings sub-page. Currently, the only changeable option is the ability to alter the visible time frame, e.g. view all availability between 9:00 am and 5:00 pm.

There are two buttons to switch between 'day' and 'week' view. If the calendar is in 'week' view, it will present all availabilities in which the selected day is situated. By default, the user can only view one staff member's schedule at a time. In 'day' view, however, the user can view multiple staff members' schedules side-by-side.

'Day' view has a 'notes' column in which you can add, edit and remove notes for that specific day.

The calendar features two filters to determine what the viewer sees. The calendar can be filtered by Centre, or by staff member (Teacher). The calendar relies upon Patrick Bauerochse's 'Searchable Option List' plugin. (Documentation at: <https://pbauerochse.github.io/searchable-option-list/>) This allows the user not only to group-select options, but to search via text input, which would be really useful if there were a long list of personnel.

The calendar features the ability to add, edit and remove a staff members availability.

##### Conclusion
In the future, I may decide to continue the project and implement appointment functionality, but for now, I feel like the calendar is already an effective tool which could be used in a real-world situation.

I have learnt a great deal whilst building this application and I am confident that this knowledge will benefit my future work.

Other creditable libraries and technologies used:
* JQuery
* JQueru UI
* Moment.js
* Bootstrap
