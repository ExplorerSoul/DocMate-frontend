### 📄 `CONTRIBUTING.md`

````markdown
# 🤝 Contributing to DocMate

Thank you for considering contributing to **DocMate**! 🚀  
We welcome contributions that help us improve the platform. Please follow this guide to make the process smooth for everyone.

---

## 🧩 Project Structure

- `main` – Stable production-ready code.
- `dev` – Integration branch for all ongoing development.
- `feature/<name>` – Your personal feature branch (e.g., `feature/login-page`).

---

## 🚀 Getting Started

1. **Fork** the repository
2. **Clone** your forked repo:
   ```bash
   git clone https://github.com/ExplorerSoul/DocMate-frontend.git
   cd DocMate-frontend
````

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Create a `.env` file** based on `.env.example` and fill in the required values.

---

## 🌿 Git Branch Workflow

> All development should happen on the `dev` branch or feature branches.

### 📌 Steps to Follow:

1. Checkout to `dev`:

   ```bash
   git checkout dev
   ```

2. Create a feature branch:

   ```bash
   git checkout -b feature/<your-feature-name>
   ```

3. Make your changes and commit:

   ```bash
   git add .
   git commit -m "Add: meaningful commit message"
   ```

4. Push to GitHub:

   ```bash
   git push --set-upstream origin feature/<your-feature-name>
   ```

5. Go to GitHub and open a **Pull Request** to merge your feature branch into `dev`.

---

## 🧹 Code Quality and Standards

* Keep commit messages clear and consistent (e.g., `Fix: typo in login`, `Add: student dashboard`)
* Use `.env.example` to guide secret/environment variable usage.
* Avoid committing `node_modules`, `.env`, or build files.

---

## ✅ Pull Request Checklist

* [ ] Your code builds cleanly
* [ ] Your changes are documented and commented where needed
* [ ] You followed the branch and commit conventions
* [ ] Your `.env` file is not pushed
* [ ] You’ve tested your changes locally

---

Happy coding! 💻🔥
