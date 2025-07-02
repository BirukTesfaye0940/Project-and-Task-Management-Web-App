````md
# ProcrastiNOT 🧠📋  
*A Modern Project & Task Management Platform with Real-Time Collaboration*

ProcrastiNOT is a full-featured, web-based project management system built with the MERN stack. It helps teams collaborate efficiently by streamlining project planning, task delegation, progress tracking, issue reporting, and real-time notifications — all wrapped in a sleek, responsive UI powered by ShadCN.

---

## 🚀 Features

- 🔐 **Authentication & Security**
  - Secure login and registration using JWT stored in HTTP-only cookies
  - Session validation and route protection

- 📊 **Interactive Dashboard**
  - Real-time overview of project status, tasks, and issues
  - Clean and responsive design with [ShadCN UI](https://ui.shadcn.com/)

- 👥 **Team Collaboration**
  - Invite members via email using a secure invitation link
  - Email-powered onboarding into the right projects

- 🛡️ **Role-Based Access Control**
  - Three user roles: **Owner**, **Admin**, and **Regular**
  - Owner controls everything, Admin helps manage, and Regular focuses on tasks

- ✅ **Task Management**
  - Create and assign tasks to team members
  - Track progress with a **Kanban-style** board: *To-Do → In Progress → Done*

- 🛠️ **Issue Tracking**
  - Log and resolve issues per project
  - Track status: Open or Solved

- 🔔 **Real-Time Notifications**
  - Task assignments trigger real-time alerts using **Socket.IO**
  - Keeps everyone in sync — no need to refresh!

- ✨ **AI Integration (Coming Soon!)**
  - Smart suggestions, auto-assignment, and productivity boosters powered by AI

---

## 🧰 Tech Stack

| Technology     | Purpose                            |
|----------------|------------------------------------|
| MongoDB        | NoSQL database                     |
| Express.js     | Backend & API server               |
| React.js       | Frontend UI                        |
| Node.js        | Runtime environment                |
| Socket.IO      | Real-time communication            |
| ShadCN UI      | Stylish & flexible UI components   |
| Cloudinary     | Image uploads                      |
| Nodemailer     | Email invitation system            |

---

## 📦 Installation & Setup

### 📁 Clone the Repository

```bash
git clone https://github.com/BirukTesfaye0940/Project-and-Task-Management-Web-App.git
cd Project-and-Task-Management-Web-App
````

### 🔧 Environment Variables

Create a `.env` file in the `backend/` directory using the template below:

#### `.env.example`

```env
# MongoDB connection
MONGO_URL=mongodb://127.0.0.1:27017/TASK-MANAGEMENT-APP

# Server configuration
PORT=5003
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here

# Cloudinary for uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email for invitation system
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

# Frontend URL (for redirects in email)
FRONTEND_URL=http://localhost:5173
```

---

## 🛠 Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App will be live at:
`http://localhost:5173`

---

## 🌐 Live Demo

> Coming Soon

---

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/014c68f6-e9c7-4e84-a541-5457fd4453f8)
![image](https://github.com/user-attachments/assets/022422ba-c888-442d-bd35-6e13d0899e9b)
![image](https://github.com/user-attachments/assets/f9b9c8bc-0852-433a-8a34-2ab9f7f01151)
![image](https://github.com/user-attachments/assets/708e6822-4dc0-40ee-b5bd-411fcae591b7)
![image](https://github.com/user-attachments/assets/5d7340da-e815-48e2-96f4-58990ffde84d)
![image](https://github.com/user-attachments/assets/4f0ed215-75af-491d-9236-6f7107c2fff9)
![image](https://github.com/user-attachments/assets/c1a12262-2539-40c2-a354-41990f815e16)

---

## 🧠 Future Improvements

* 🤖 **AI integration** for:

  * Smart task suggestions
  * Auto-prioritization
  * Deadline prediction
* 📅 **Calendar view** for scheduling
* 📈 **Analytics dashboard** for project stats
* 🌓 **Dark mode support**

---

## 🤝 Contributing

Contributions, ideas, and improvements are welcome!
Please open an issue or submit a pull request.

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 💬 Contact

**Biruk Tesfaye**
📫 [biruktesfayeakabu@gmail.com](mailto:biruktesfayeakabu@gmail.com)

---

*Built with ❤️, coffee, and Socket.IO ping-pong packets.*

```

---
