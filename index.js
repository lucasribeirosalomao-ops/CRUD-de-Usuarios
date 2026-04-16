class SistemaUsuarios {
  constructor() {
    this.usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  }

  salvarNoLocalStorage() {
    localStorage.setItem("usuarios", JSON.stringify(this.usuarios));
  }

  emailValido(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  criar(nome, email) {
    nome = nome.trim();
    email = email.trim().toLowerCase();

    if (!nome || !email) {
      return { sucesso: false, mensagem: "Preencha todos os campos." };
    }

    if (nome.length < 3) {
      return { sucesso: false, mensagem: "O nome deve ter pelo menos 3 caracteres." };
    }

    if (!this.emailValido(email)) {
      return { sucesso: false, mensagem: "Digite um e-mail válido." };
    }

    const usuarioExiste = this.usuarios.find(usuario => usuario.email === email);

    if (usuarioExiste) {
      return { sucesso: false, mensagem: "Já existe um usuário com esse e-mail." };
    }

    this.usuarios.push({ nome, email });
    this.salvarNoLocalStorage();

    return { sucesso: true, mensagem: "Usuário cadastrado com sucesso." };
  }

  atualizar(indice, nome, email) {
    nome = nome.trim();
    email = email.trim().toLowerCase();

    if (!nome || !email) {
      return { sucesso: false, mensagem: "Preencha todos os campos." };
    }

    if (nome.length < 3) {
      return { sucesso: false, mensagem: "O nome deve ter pelo menos 3 caracteres." };
    }

    if (!this.emailValido(email)) {
      return { sucesso: false, mensagem: "Digite um e-mail válido." };
    }

    const emailExiste = this.usuarios.find(
      (usuario, i) => usuario.email === email && i !== indice
    );

    if (emailExiste) {
      return { sucesso: false, mensagem: "Já existe outro usuário com esse e-mail." };
    }

    this.usuarios[indice] = { nome, email };
    this.salvarNoLocalStorage();

    return { sucesso: true, mensagem: "Usuário atualizado com sucesso." };
  }

  deletar(indice) {
    this.usuarios.splice(indice, 1);
    this.salvarNoLocalStorage();
    return { sucesso: true, mensagem: "Usuário excluído com sucesso." };
  }

  listar() {
    return this.usuarios;
  }

  buscarPorNome(texto) {
    texto = texto.trim().toLowerCase();

    return this.usuarios.filter(usuario =>
      usuario.nome.toLowerCase().includes(texto)
    );
  }
}

const sistema = new SistemaUsuarios();

const form = document.getElementById("form-usuario");
const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const indiceEdicaoInput = document.getElementById("indice-edicao");
const tabelaUsuarios = document.getElementById("tabela-usuarios");
const mensagem = document.getElementById("mensagem");
const contador = document.getElementById("contador");
const buscaInput = document.getElementById("busca");
const btnCancelar = document.getElementById("btn-cancelar");

function mostrarMensagem(texto, sucesso = true) {
  mensagem.textContent = texto;
  mensagem.style.color = sucesso ? "green" : "red";

  setTimeout(() => {
    mensagem.textContent = "";
  }, 3000);
}

function limparFormulario() {
  form.reset();
  indiceEdicaoInput.value = "";
  btnCancelar.style.display = "none";
}

function renderizarUsuarios(lista = sistema.listar()) {
  tabelaUsuarios.innerHTML = "";

  contador.textContent = `Total de usuários cadastrados: ${sistema.listar().length}`;

  if (lista.length === 0) {
    tabelaUsuarios.innerHTML = `
      <tr>
        <td colspan="3" class="sem-usuarios">Nenhum usuário encontrado.</td>
      </tr>
    `;
    return;
  }

  lista.forEach((usuario, indiceLista) => {
    const indiceReal = sistema.usuarios.findIndex(
      u => u.nome === usuario.nome && u.email === usuario.email
    );

    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>${usuario.nome}</td>
      <td>${usuario.email}</td>
      <td>
        <button class="btn-editar" onclick="editarUsuario(${indiceReal})">Editar</button>
        <button class="btn-excluir" onclick="excluirUsuario(${indiceReal})">Excluir</button>
      </td>
    `;

    tabelaUsuarios.appendChild(linha);
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = nomeInput.value;
  const email = emailInput.value;
  const indiceEdicao = indiceEdicaoInput.value;

  let resultado;

  if (indiceEdicao === "") {
    resultado = sistema.criar(nome, email);
  } else {
    resultado = sistema.atualizar(Number(indiceEdicao), nome, email);
  }

  mostrarMensagem(resultado.mensagem, resultado.sucesso);

  if (resultado.sucesso) {
    limparFormulario();
    renderizarUsuarios();
  }
});

function editarUsuario(indice) {
  const usuario = sistema.usuarios[indice];

  nomeInput.value = usuario.nome;
  emailInput.value = usuario.email;
  indiceEdicaoInput.value = indice;
  btnCancelar.style.display = "inline-block";
}

function excluirUsuario(indice) {
  const confirmar = confirm("Tem certeza que deseja excluir este usuário?");

  if (!confirmar) return;

  const resultado = sistema.deletar(indice);
  mostrarMensagem(resultado.mensagem, resultado.sucesso);
  renderizarUsuarios();
}

btnCancelar.addEventListener("click", function () {
  limparFormulario();
});

buscaInput.addEventListener("input", function () {
  const textoBusca = buscaInput.value;

  if (textoBusca === "") {
    renderizarUsuarios();
  } else {
    const resultadoBusca = sistema.buscarPorNome(textoBusca);
    renderizarUsuarios(resultadoBusca);
  }
});

renderizarUsuarios();

fetch("http://localhost:3000/usuarios")
  .then(res => res.json())
  .then(data => {
    console.log("Dados da API:", data);
  })
  .catch(err => console.error("Erro:", err));