# Contributing to CareerOS

Thank you for your interest in contributing to CareerOS! As a high-fidelity, tactical career management platform, we maintain rigorous standards for code quality, design and documentation.

## 🛠 Development Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/CareerOS.git
   cd CareerOS
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env.local` file based on `.env.example` and populate it with your Firebase credentials.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 📐 Coding Standards

### JavaScript & React

- Use **functional components** and **hooks**.
- Follow the **Atomic Design** pattern for components.
- Maintain **JSDoc** documentation for all exported functions and components.
- Ensure all components are **responsive** and adhere to the **Void-Indigo** design system.

### Styling

- Use **Tailwind CSS** with the predefined utility classes in `globals.css`.
- Avoid hardcoded hex values; use theme variables (e.g., `text-indigo-400`).

## 🧪 Testing Protocol

Before submitting a PR, ensure all tests pass:

```bash
npm run test
```

New features should include corresponding unit or component tests using **Vitest** and **React Testing Library**.

## 🚀 Pull Request Process

1. **Branching**: Create a feature branch (`feat/your-feature` or `fix/your-fix`).
2. **Linting**: Ensure `npm run lint` passes without errors.
3. **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat: add encryption to vault`).
4. **Description**: Provide a clear description of the changes and any related issues.

## 🤝 Community

Join our mission to revolutionize career acquisition. Be respectful and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).
