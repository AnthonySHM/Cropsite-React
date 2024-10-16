let token = null;

export const auth = {
  setToken(newToken) {
    token = newToken;
  },
  getToken() {
    return token;
  },
  clearToken() {
    token = null;
  },
};