const KEY = 'sunnan_admin_token';

export function saveToken(token) { localStorage.setItem(KEY, token); }
export function getToken() { return localStorage.getItem(KEY); }
export function logout() { localStorage.removeItem(KEY); }

export function isLoggedIn() {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
