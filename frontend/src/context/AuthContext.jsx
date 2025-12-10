import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error al parsear JWT:", e);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { token, email, roles: [] }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);

      // ajustamos segun el formato del token que viene del backend
      let roles = [];
      if (payload) {
        if (payload.role) {
          roles = [payload.role];
        } else if (payload.roles) {
          roles = Array.isArray(payload.roles) ? payload.roles : [payload.roles];
        } else if (payload.authorities) {
          roles = payload.authorities;
        }
      }

      setUser({
        token,
        email: payload?.sub || payload?.email || null,
        roles,
      });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const payload = parseJwt(token);

    let roles = [];
    if (payload) {
      if (payload.role) {
        roles = [payload.role];
      } else if (payload.roles) {
        roles = Array.isArray(payload.roles) ? payload.roles : [payload.roles];
      } else if (payload.authorities) {
        roles = payload.authorities;
      }
    }

    setUser({
      token,
      email: payload?.sub || payload?.email || null,
      roles,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAuthenticated = !!user?.token;

  const hasRole = (role) => {
    if (!user?.roles) return false;
    return user.roles.includes(role) || user.roles.includes(`ROLE_${role}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        hasRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
