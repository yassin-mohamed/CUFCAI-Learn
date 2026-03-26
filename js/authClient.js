(function () {
  const AUTH_BASE = "/api/auth";

  async function request(path, options) {
    const response = await fetch(`${AUTH_BASE}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch (_error) {
      payload = null;
    }

    return {
      ok: response.ok,
      status: response.status,
      data: payload,
    };
  }

  window.AuthClient = {
    register(body) {
      return request("/register", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    login(body) {
      return request("/login", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    logout() {
      return request("/logout", {
        method: "POST",
      });
    },
    me() {
      return request("/me", {
        method: "GET",
      });
    },
  };
})();
