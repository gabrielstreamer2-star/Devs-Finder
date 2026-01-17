document.addEventListener("DOMContentLoaded", () => {

  // ELEMENTOS
  const loginScreen = document.getElementById("loginScreen");
  const app = document.getElementById("app");
  const overlay = document.getElementById("configOverlay");
  const toast = document.getElementById("toast");

  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");

  const userLabel = document.getElementById("userLabel");
  const pfp = document.getElementById("pfp");
  const configBtn = document.getElementById("configBtn");
  const closeConfigBtn = document.getElementById("closeConfigBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const saveConfig = document.getElementById("saveConfig");
  const pfpInput = document.getElementById("pfpInput");
  const newName = document.getElementById("newName");
  const oldPass = document.getElementById("oldPass");
  const newPass = document.getElementById("newPass");

  const searchUser = document.getElementById("searchUser");
  const roleFilter = document.getElementById("roleFilter");
  const userList = document.getElementById("userList");
  const chatBox = document.getElementById("chatBox");
  const chatTitle = document.getElementById("chatTitle");
  const messages = document.getElementById("messages");
  const msgInput = document.getElementById("msgInput");
  const sendBtn = document.getElementById("sendBtn");

  // DADOS
  let user = JSON.parse(localStorage.getItem("user"));
  let chats = JSON.parse(localStorage.getItem("chats")) || {};
  let currentChat = null;

  const devs = [
    { name: "BuilderPro", role: "Builder" },
    { name: "LuaMaster", role: "Scripter" },
    { name: "AnimX", role: "Animator" },
    { name: "UIWolf", role: "UI" }
  ];

  // FUNCOES
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  }

  function showLogin() {
    loginScreen.classList.remove("hidden");
    loginScreen.classList.add("show");
    app.classList.remove("show");
    app.classList.add("hidden");
  }

  function showApp() {
    loginScreen.classList.remove("show");
    loginScreen.classList.add("hidden");
    app.classList.remove("hidden");
    app.classList.add("show");
    userLabel.textContent = user.name;
    pfp.src = user.pfp || "https://via.placeholder.com/44";
    applyFilters();
  }

  function applyFilters() {
    const search = searchUser.value.toLowerCase();
    const role = roleFilter.value;

    userList.innerHTML = "";

    const filtered = devs.filter(d =>
      (role === "all" || d.role === role) &&
      d.name.toLowerCase().includes(search)
    );

    filtered.forEach((d, i) => {
      const div = document.createElement("div");
      div.className = "devCard";
      div.style.transition = `all 0.4s ease ${i*0.05}s`;
      div.innerHTML = `<b>${d.name}</b><br>${d.role}`;
      div.onclick = () => openChat(d.name);
      userList.appendChild(div);

      // animação entrada
      setTimeout(() => div.classList.add("show"), 50);
    });
  }

  function openChat(name) {
    currentChat = name;
    chats[name] ??= [];
    chatBox.classList.remove("hidden");
    chatBox.style.opacity = "0";
    setTimeout(() => chatBox.style.opacity = "1", 50);
    chatTitle.textContent = "Chat com " + name;
    renderMessages();
  }

  function renderMessages() {
    messages.innerHTML = "";
    chats[currentChat].forEach(m => {
      const div = document.createElement("div");
      div.textContent = `${m.from}: ${m.text}`;
      div.style.opacity = "0";
      messages.appendChild(div);
      setTimeout(() => div.style.opacity = "1", 50);
    });
    messages.scrollTop = messages.scrollHeight;
  }

  // EVENTOS
  loginBtn.onclick = () => {
    if (!username.value || !password.value) return;
    user = { name: username.value, password: password.value };
    localStorage.setItem("user", JSON.stringify(user));
    showToast("Logado!");
    showApp();
  };

  sendBtn.onclick = () => {
    if (!msgInput.value || !currentChat) return;
    chats[currentChat].push({ from: user.name, text: msgInput.value });
    localStorage.setItem("chats", JSON.stringify(chats));
    msgInput.value = "";
    renderMessages();
  };

  searchUser.oninput = applyFilters;
  roleFilter.onchange = applyFilters;

  configBtn.onclick = () => overlay.classList.remove("hidden");
  closeConfigBtn.onclick = () => overlay.classList.add("hidden");

  logoutBtn.onclick = () => {
    localStorage.clear();
    showToast("Deslogado!");
    showLogin();
  };

  deleteBtn.onclick = () => {
    if (!confirm("Certeza que quer deletar a conta?")) return;
    localStorage.clear();
    showToast("Conta deletada!");
    showLogin();
  };

  saveConfig.onclick = () => {
    if (oldPass.value !== user.password) {
      showToast("Senha antiga incorreta!");
      return;
    }
    if (newName.value) user.name = newName.value;
    if (newPass.value) user.password = newPass.value;

    if (pfpInput.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        user.pfp = reader.result;
        pfp.src = user.pfp;
        localStorage.setItem("user", JSON.stringify(user));
        showToast("Alterações salvas!");
      };
      reader.readAsDataURL(pfpInput.files[0]);
    } else {
      localStorage.setItem("user", JSON.stringify(user));
      showToast("Alterações salvas!");
    }
  };

  // INICIALIZAÇÃO
  if (user) showApp();
  else showLogin();

});
