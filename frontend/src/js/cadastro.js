const API_BASE_URL = 'http://localhost:5000';

const URLS = {
  ADICIONA_TICKET: `${API_BASE_URL}/ticket`,
  BUSCA_ENDERECO_POR_CEP: 'https://viacep.com.br/ws/'
};

// Inicializa a máscara dos campos
$(document).ready(function () {
  $('#cep').mask('00000-000');
});

// Função para adicionar uma nova task, via requisição POST
function adicionaTask() {
  if (validarCampos()) {
    const formData = obterFormData();

    // Realiza a requisição GET para buscar o endereço com base no CEP
    buscarEnderecoPorCEP(formData.get('cep'))
      .then(endereco => {
        formData.set('endereco', endereco);

        // Faz a requisição POST para adicionar a task
        $.ajax({
          url: URLS.ADICIONA_TICKET,
          method: 'POST',
          data: formData,
          contentType: false,
          processData: false,
          success: function (response) {
            Swal.fire({
              title: "Task cadastrada com sucesso!",
              icon: "success"
            });

            // Limpa o formulário após o sucesso
            $('#formCadastro')[0].reset();
          },
          error: function () {
            mostrarAlerta('error', 'Erro ao cadastrar task');
          }
        });
      })
      .catch(() => {
        mostrarAlerta('error', 'CEP não encontrado');
      });
  } else {
    mostrarAlerta('warning', 'Por favor, preencha todos os campos obrigatórios.');
  }
}

// Função para validar os campos do formulário
function validarCampos() {
  return $('#nome').val() !== '' && $('#descricao').val() !== '' && $('#cep').val() !== '' && $('#endereco').val() !== '' && $('#status').val() !== '';
}

// Função para obter FormData com tratamento específico
function obterFormData() {
  const form = document.getElementById('formCadastro');
  console.log(form);
  const formData = new FormData(form);
  console.log(formData.forEach((value, key) => console.log(key, value)));

  // Remover máscaras de campos específicos, se houver
  ['cep'].forEach(campo => {
    const valor = formData.get(campo);
    if (valor) {
      formData.set(campo, valor.replace(/\D/g, ''));
    }
  });

  return formData;
}

// Função para buscar o endereço com base no CEP
function buscarEnderecoPorCEP(cep) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${URLS.BUSCA_ENDERECO_POR_CEP}${cep}/json/`,
      method: 'GET',
      success: function (data) {
        if (!data.erro) {
          const endereco = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
          resolve(endereco);
        } else {
          reject();
        }
      },
      error: function () {
        reject();
      }
    });
  });
}

// Função para mostrar alertas
function mostrarAlerta(icon, title) {
  Swal.fire({
    icon: icon,
    title: title,
  });
}
