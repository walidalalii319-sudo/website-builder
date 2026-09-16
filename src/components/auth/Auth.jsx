import React, { useState, useEffect, createContext, useContext } from 'react';

/**
 * Authentication Service
 * Handles user registration, login, sessions, roles, and permissions
 */
class AuthService {
  constructor() {
    this.usersKey = 'website-builder-users';
    this.sessionKey = 'website-builder-session';
    this.users = this.loadUsers();
  }

  loadUsers() {
    try {
      const stored = localStorage.getItem(this.usersKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveUsers() {
    try {
      localStorage.setItem(this.usersKey, JSON.stringify(this.users));
    } catch (e) {
      console.error('Failed to save users:', e);
    }
  }

  getCurrentSession() {
    try {
      const stored = localStorage.getItem(this.sessionKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  saveSession(session) {
    try {
      if (session) {
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
      } else {
        localStorage.removeItem(this.sessionKey);
      }
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  }

  // User management
  getUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  getUserById(id) {
    return this.users.find(u => u.id === id);
  }

  createUser(userData) {
    const existingUser = this.getUserByEmail(userData.email);
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    const user = {
      id: `user-${Date.now()}`,
      email: userData.email,
      password: this.hashPassword(userData.password),
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      avatar: userData.avatar || null,
      role: userData.role || 'user',
      emailVerified: false,
      twoFactorEnabled: false,
      socialAccounts: [],
      createdAt: new Date().toISOString(),
      lastLogin: null,
      status: 'active'
    };

    this.users.push(user);
    this.saveUsers();

    return { success: true, user: { ...user, password: undefined } };
  }

  hashPassword(password) {
    // Simple hash for demo (use bcrypt in production)
    return btoa(password + '-salt-website-builder');
  }

  verifyPassword(password, hashedPassword) {
    return this.hashPassword(password) === hashedPassword;
  }

  // Authentication
  login(email, password) {
    const user = this.getUserByEmail(email);
    
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (user.status !== 'active') {
      return { success: false, error: 'Account is deactivated' };
    }

    if (!this.verifyPassword(password, user.password)) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    this.saveUsers();

    // Create session
    const session = {
      userId: user.id,
      email: user.email,
      role: user.role,
      token: `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };

    this.saveSession(session);

    return { 
      success: true, 
      user: { ...user, password: undefined },
      session
    };
  }

  logout() {
    this.saveSession(null);
    return { success: true };
  }

  isAuthenticated() {
    const session = this.getCurrentSession();
    if (!session) return false;

    const expiresAt = new Date(session.expiresAt);
    if (expiresAt < new Date()) {
      this.logout();
      return false;
    }

    return true;
  }

  getCurrentUser() {
    const session = this.getCurrentSession();
    if (!session) return null;

    const user = this.getUserById(session.userId);
    return user ? { ...user, password: undefined } : null;
  }

  // Password reset
  requestPasswordReset(email) {
    const user = this.getUserByEmail(email);
    
    if (!user) {
      // Don't reveal if email exists
      return { success: true, message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token (in production, send via email)
    const resetToken = `reset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
    this.saveUsers();

    // In production, send email with reset link
    console.log('Password reset token:', resetToken);

    return { 
      success: true, 
      message: 'If the email exists, a reset link has been sent',
      resetToken // Remove in production
    };
  }

  resetPassword(token, newPassword) {
    const user = this.users.find(u => u.resetToken === token);
    
    if (!user || new Date(user.resetTokenExpires) < new Date()) {
      return { success: false, error: 'Invalid or expired reset token' };
    }

    user.password = this.hashPassword(newPassword);
    delete user.resetToken;
    delete user.resetTokenExpires;
    this.saveUsers();

    return { success: true };
  }

  // Profile updates
  updateProfile(userId, updates) {
    const user = this.getUserById(userId);
    if (!user) return { success: false, error: 'User not found' };

    Object.assign(user, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    this.saveUsers();
    return { success: true, user: { ...user, password: undefined } };
  }

  changePassword(userId, currentPassword, newPassword) {
    const user = this.getUserById(userId);
    if (!user) return { success: false, error: 'User not found' };

    if (!this.verifyPassword(currentPassword, user.password)) {
      return { success: false, error: 'Current password is incorrect' };
    }

    user.password = this.hashPassword(newPassword);
    this.saveUsers();

    return { success: true };
  }

  // Email verification
  verifyEmail(token) {
    const user = this.users.find(u => u.emailVerificationToken === token);
    
    if (!user) {
      return { success: false, error: 'Invalid verification token' };
    }

    user.emailVerified = true;
    delete user.emailVerificationToken;
    this.saveUsers();

    return { success: true };
  }

  sendVerificationEmail(userId) {
    const user = this.getUserById(userId);
    if (!user) return { success: false, error: 'User not found' };

    if (user.emailVerified) {
      return { success: false, error: 'Email already verified' };
    }

    const token = `verify-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    user.emailVerificationToken = token;
    this.saveUsers();

    // In production, send email with verification link
    console.log('Email verification token:', token);

    return { success: true, token };
  }

  // Roles and permissions
  hasRole(user, roles) {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }

  can(user, permission) {
    if (!user) return false;
    
    const permissions = {
      admin: ['*'],
      editor: ['content.create', 'content.edit', 'content.delete', 'media.upload'],
      user: ['content.view', 'media.view']
    };

    const userPermissions = permissions[user.role] || [];
    
    if (userPermissions.includes('*')) return true;
    return userPermissions.includes(permission);
  }

  // Social login (simplified)
  socialLogin(provider, profile) {
    let user = this.users.find(u => 
      u.socialAccounts?.some(acc => acc.provider === provider && acc.providerId === profile.id)
    );

    if (user) {
      // Existing user - log them in
      return this.login(user.email, 'social-login-placeholder');
    }

    // New user - create account
    const newUser = this.createUser({
      email: profile.email,
      password: Math.random().toString(36).slice(-10), // Random password
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatar: profile.avatar
    });

    if (newUser.success) {
      newUser.user.socialAccounts = [{ provider, providerId: profile.id }];
      this.saveUsers();
      
      // Auto login
      return this.login(newUser.user.email, 'social-login-placeholder');
    }

    return newUser;
  }
}

export const auth = new AuthService();

// Auth Context
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = auth.login(email, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const register = async (userData) => {
    const result = auth.createUser(userData);
    if (result.success) {
      // Auto login after registration
      const loginResult = auth.login(userData.email, userData.password);
      if (loginResult.success) {
        setUser(loginResult.user);
      }
    }
    return result;
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  const updateUser = (updates) => {
    if (!user) return Promise.resolve({ success: false, error: 'Not authenticated' });
    
    const result = auth.updateProfile(user.id, updates);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login, 
      register, 
      logout,
      updateUser,
      isAuthenticated: !!user,
      hasRole: (roles) => auth.hasRole(user, roles),
      can: (permission) => auth.can(user, permission)
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * LoginForm Component
 */
export function LoginForm({ onSuccess, onError, theme = {} }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      onSuccess?.(result.user);
    } else {
      setError(result.error);
      onError?.(result.error);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && (
        <div className="form-error" style={{ 
          padding: '0.75rem', 
          background: '#fef2f2', 
          color: '#dc2626', 
          borderRadius: theme.radius || '0.375rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: `1px solid ${theme.borderColor || '#d1d5db'}`,
            borderRadius: theme.radius || '0.375rem'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: `1px solid ${theme.borderColor || '#d1d5db'}`,
            borderRadius: theme.radius || '0.375rem'
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.875rem',
          background: theme.accent || '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: theme.radius || '0.375rem',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

/**
 * RegisterForm Component
 */
export function RegisterForm({ onSuccess, onError, theme = {} }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password
    });
    
    if (result.success) {
      onSuccess?.(result.user);
    } else {
      setError(result.error);
      onError?.(result.error);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      {error && (
        <div className="form-error" style={{ 
          padding: '0.75rem', 
          background: '#fef2f2', 
          color: '#dc2626', 
          borderRadius: theme.radius || '0.375rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${theme.borderColor || '#d1d5db'}`,
              borderRadius: theme.radius || '0.375rem'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${theme.borderColor || '#d1d5db'}`,
              borderRadius: theme.radius || '0.375rem'
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: `1px solid ${theme.borderColor || '#d1d5db'}`,
            borderRadius: theme.radius || '0.375rem'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Password
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          required
          minLength={6}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: `1px solid ${theme.borderColor || '#d1d5db'}`,
            borderRadius: theme.radius || '0.375rem'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Confirm Password
        </label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: `1px solid ${theme.borderColor || '#d1d5db'}`,
            borderRadius: theme.radius || '0.375rem'
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.875rem',
          background: theme.accent || '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: theme.radius || '0.375rem',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}

/**
 * ProtectedRoute Component
 */
export function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to access this page.</div>;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <div>You don't have permission to access this page.</div>;
  }

  return children;
}

/**
 * UserProfile Component
 */
export function UserProfile({ theme = {} }) {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || ''
  });

  const handleSave = async () => {
    await updateUser(formData);
    setEditing(false);
  };

  if (!user) return null;

  return (
    <div className="user-profile" style={{
      padding: '1.5rem',
      border: `1px solid ${theme.borderColor || '#e5e7eb'}`,
      borderRadius: theme.radius || '0.5rem',
      background: '#fff'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.firstName}
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: theme.accent || '#3b82f6',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
        )}
        
        <div>
          <h3 style={{ margin: 0 }}>{user.firstName} {user.lastName}</h3>
          <p style={{ margin: '0.25rem 0 0', color: '#6b7280' }}>{user.email}</p>
          <span style={{ 
            fontSize: '0.75rem', 
            padding: '0.25rem 0.5rem', 
            background: '#e0e7ff', 
            color: '#4338ca',
            borderRadius: '9999px',
            textTransform: 'capitalize'
          }}>
            {user.role}
          </span>
        </div>
      </div>

      {editing ? (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: `1px solid ${theme.borderColor || '#d1d5db'}`,
                  borderRadius: theme.radius || '0.375rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: `1px solid ${theme.borderColor || '#d1d5db'}`,
                  borderRadius: theme.radius || '0.375rem'
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleSave}
              style={{
                padding: '0.5rem 1rem',
                background: theme.accent || '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: theme.radius || '0.375rem',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{
                padding: '0.5rem 1rem',
                background: '#f3f4f6',
                color: '#1f2937',
                border: 'none',
                borderRadius: theme.radius || '0.375rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          style={{
            padding: '0.5rem 1rem',
            background: '#f3f4f6',
            color: '#1f2937',
            border: 'none',
            borderRadius: theme.radius || '0.375rem',
            cursor: 'pointer'
          }}
        >
          Edit Profile
        </button>
      )}
    </div>
  );
}
