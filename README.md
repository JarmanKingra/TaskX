🚀 TaskX – Team Task Management App  - Demo - https://drive.google.com/file/d/1VhMbw8oa5zaaTzFY_YbmvUl2BmvA4nk-/view?usp=drive_link

🔑 Demo Credentials (feel free to try)
Admin
📧 aman.admin@taskx.dev
🔑 Admin@123

Member
📧 priya.member@taskx.dev
🔑 Member@123

TaskX is a role-based team task management application where admins can create teams, manage members, and assign tasks, while members can view and update their assigned tasks.
It is built to simulate real-world team workflows used in startups and companies.

🧠 Core Idea

Admins manage teams and tasks
Members work on assigned tasks
Tasks stay safe even when members are removed (unassigned instead of deleted)
This ensures data integrity, accountability, and realistic task tracking.

✨ Features
👑 Admin Features

Create and manage teams
Add members to a team using email
Remove members from a team
Assign tasks to team members
View tasks of any team member
Remove tasks when required

👤 Member Features

View assigned tasks
Update task status (Pending / In-Progress / Completed)
View task details

📋 Task Management

Tasks belong to teams
Tasks can be:
Assigned
Unassigned (when a member is removed)
Tasks are never lost accidentally

🔐 Authentication & Authorization
JWT-based authentication
Role-based access control

Protected routes for:
Admin dashboard
Member dashboard

🏗 Tech Stack
Frontend -- 

Next.js (App Router)
React
Zustand – state management
CSS Modules – styling

Backend --

Node.js
Express.js
MongoDB
Mongoose
JWT Authentication

🔄 Real-World Logic Used

❓ What happens when a member is removed?
Member is removed from the team
Tasks previously assigned to that member become unassigned
Tasks are not deleted
✔ This mirrors real company workflows

🧪 Error Handling

Proper API error messages
Client-side error handling using Zustand
Loading states for better UX


📌 Future Improvements

Task reassignment UI for unassigned tasks
Notifications system
Activity logs (who assigned / updated tasks)
Drag-and-drop task board
Mobile responsiveness enhancements

🧑‍💻 Author

Jarman Jot Singh
BCA Student | Aspiring Full-Stack Developer
Focused on building real-world, production-level applications

⭐ Why TaskX?

TaskX is not just a CRUD app — it demonstrates:
Role-based access
Real-world decision making
Scalable backend logic
Clean frontend state management
