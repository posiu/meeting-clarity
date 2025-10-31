# 🧩 Meeting Clarity

A minimal web app that helps teams end every meeting with **clear decisions, action items, and ownership** — not confusion.

Built with **Next.js**, **TypeScript**, **Prisma (SQLite)**, **Tailwind CSS**, and **shadcn/ui**.

---

## 🚀 Features

- 📝 Create a meeting with key questions or topics for decision  
- ⚡ Capture decisions and action items during or after the meeting  
- 📧 Automatically email a summary to all participants  
- 🗂️ View a clean, public meeting summary link (`/m/[shareToken]`)  
- 🧠 Minimalist, fast, and frictionless UI  

---

## 🧱 Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | [Next.js 15](https://nextjs.org/) + [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/) |
| Backend | [Prisma ORM](https://www.prisma.io/) with SQLite |
| UI Kit | [shadcn/ui](https://ui.shadcn.com/) |
| Email | [Nodemailer](https://nodemailer.com/) + [Mailpit](https://mailpit.axllent.org/) |
| Language | TypeScript |
| Dev Tools | VS Code, Git, GitHub |

---

## 🧰 Local Development Setup


### 1️⃣ Clone the Repository
```bash
git clone https://github.com/posiu/meeting-clarity.git
cd meeting-clarity
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a .env file at the project root:
```bash
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
Add .env to your .gitignore to keep it out of GitHub.

### 4️⃣ Initialize the Database
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5️⃣ Start the Dev Server
```bash
npm run dev
```
Visit: http://localhost:3000/new

### 6️⃣ (Optional) Email Testing with Mailpit
Install and start Mailpit (local email viewer):
```bash
brew install mailpit
mailpit
```
Open http://localhost:8025 to view sent emails.

### 🧪 Project Structure
```
src/
├── app/
│   ├── (dashboard)/
│   │   └── new/              # Create a meeting
│   ├── host/[hostToken]/     # Host view for capturing actions/decisions
│   ├── m/[shareToken]/       # Public meeting summary
│   └── api/                  # API routes (create, close, etc.)
├── lib/
│   ├── db.ts                 # Prisma client
│   ├── mailer.ts             # Nodemailer configuration
│   └── id.ts                 # Token generation utility
prisma/
├── schema.prisma             # Database schema
├── dev.db                    # SQLite database
```

### 🧠 Core User Flows
1. Create Meeting → /new
Enter title, team name, participants, and decision topics.

2. Capture Actions/Decisions → /host/[hostToken]
Assign action items and decision owners.

3. Close Meeting → /api/meetings/[id]/close
Generates and sends email summaries to all participants.

4. Public Summary → /m/[shareToken]
Anyone with the link can view the summary.

### 🪄 Git Commands Reference

Stage, commit, and push your work:
```bash
git add .
git commit -m "feat: describe your change here"
git push
```

To pull updates:
```bash
git pull --rebase origin main
```

### 🧩 License
This project is licensed under the MIT License.
You’re free to use, modify, and distribute it with attribution.

### 💡 Author

@posiu
- creator of Meeting Clarity

>Built for learning, experimenting, and bringing clarity to every meeting.
