class SistemaUsuarios {
  constructor() {
    this.usuarios = [];
  }

  criar(nome, email) {
    const existe = this.usuarios.find(u => u.email === email);

    if (existe) {
      console.log("Usuário já existe.");
      return;
    }

    this.usuarios.push({ nome, email });
    console.log("Usuário criado com sucesso.");
  }

  listar() {
    if (this.usuarios.length === 0) {
      console.log("Nenhum usuário cadastrado.");
      return;
    }

    console.log("Lista de usuários:");
    this.usuarios.forEach((u, i) => {
      console.log(`${i + 1}. ${u.nome} - ${u.email}`);
    });
  }

  atualizar(email, novoNome) {
    const usuario = this.usuarios.find(u => u.email === email);

    if (!usuario) {
      console.log("Usuário não encontrado.");
      return;
    }

    usuario.nome = novoNome;
    console.log("Usuário atualizado.");
  }

  deletar(email) {
    const index = this.usuarios.findIndex(u => u.email === email);

    if (index === -1) {
      console.log("Usuário não encontrado.");
      return;
    }

    this.usuarios.splice(index, 1);
    console.log("Usuário removido.");
  }
}

const sistema = new SistemaUsuarios();

sistema.criar("Lucas", "lucas@email.com");
sistema.criar("Maria", "maria@email.com");

console.log("");
sistema.listar();

console.log("");
sistema.atualizar("lucas@email.com", "Lucas Ribeiro");

console.log("");
sistema.listar();

console.log("");
sistema.deletar("maria@email.com");

console.log("");
sistema.listar();