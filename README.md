<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Gg0gnrJUvw8u9q-bpHb0XmncXtAION-P

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Configure the backend API URL:
   - Copy `.env.example` to `.env`
   - Set `VITE_API_URL` to your backend API URL (default: `http://localhost:3000/api`)
4. Run the app:
   `npm run dev`

## API Integration

This frontend is integrated with a backend API that provides authentication and data management. The services are organized by functionality following React best practices with complete separation of concerns:

### Project Structure

```
services/
  api/
    axiosConfig.ts       - Axios instance configuration with interceptors
    index.ts             - Central export file
    auth/
      types.ts           - Authentication type definitions
      authService.ts     - Authentication service
      index.ts           - Auth module exports
    usuario/
      types.ts           - User type definitions
      usuarioService.ts  - User management service
      index.ts           - Usuario module exports
    dashboard/
      types.ts           - Dashboard type definitions
      dashboardService.ts - Dashboard statistics service
      index.ts           - Dashboard module exports
contexts/
  AuthContext.tsx        - Authentication context and hooks
```

### Services

#### Auth Service (`services/api/auth/`)

**Types:** `LoginRequest`, `LoginResponse`, `AuthMeResponse`

**Methods:**
- `authService.login(email, senha)` - Login and get JWT token
- `authService.me()` - Get current authenticated user
- `authService.logout()` - Logout and clear token

#### Usuario Service (`services/api/usuario/`)

**Types:** `UpdateSenhaRequest`, `PromoverUsuarioRequest`

**Methods:**
- `usuarioService.listar()` - List all users
- `usuarioService.buscarPorId(id)` - Get user by ID
- `usuarioService.criar(usuario)` - Create new user
- `usuarioService.atualizar(id, usuario)` - Update existing user
- `usuarioService.promover(id, novaRole)` - Promote user (change role)
- `usuarioService.deletar(id)` - Delete user
- `usuarioService.atualizarSenha(id, senhaAtual, novaSenha)` - Update user password

#### Dashboard Service (`services/api/dashboard/`)

**Types:** `DashboardEstatisticas`, `HierarquiaNode`

**Methods:**
- `dashboardService.obterEstatisticas()` - Get dashboard statistics
- `dashboardService.obterHierarquia()` - Get user hierarchy

### Authentication Context (`contexts/AuthContext.tsx`)

Manages authentication state throughout the app:
- Automatically checks for saved JWT token on app load
- Provides `user`, `token`, `isLoading` state
- Provides `login`, `logout`, `refreshUser` functions

### Usage Example

```tsx
import { useAuth } from './contexts/AuthContext';
import { usuarioService, dashboardService } from './services/api';

function MyComponent() {
  const { user, login, logout } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login('email@example.com', 'password123');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  const loadUsers = async () => {
    try {
      const users = await usuarioService.listar();
      console.log(users);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };
  
  const loadDashboard = async () => {
    try {
      const stats = await dashboardService.obterEstatisticas();
      console.log(stats);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  };
  
  return (
    <div>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Backend Routes

The backend provides the following routes:

```typescript
// Public routes
POST   /auth/login           - Login

// Authenticated routes (require JWT token)
GET    /auth/me              - Get current user
POST   /auth/logout          - Logout

// Users
GET    /usuarios             - List all users
GET    /usuarios/:id         - Get user by ID
POST   /usuarios             - Create user
PUT    /usuarios/:id         - Update user
PATCH  /usuarios/:id/promover - Promote user
DELETE /usuarios/:id         - Delete user
PATCH  /usuarios/:id/senha   - Update password

// Dashboard
GET    /dashboard/estatisticas - Get statistics
GET    /dashboard/hierarquia   - Get hierarchy
```
