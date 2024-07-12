const API_BASE_URL = 'http://localhost:5000';

const URLS = {
    ADICIONA_TICKET: `${API_BASE_URL}/ticket`,
    BUSCAR_TICKETS: `${API_BASE_URL}/tickets`,
    BUSCAR_TICKET_POR_ID: `${API_BASE_URL}/ticket`,
    BUSCAR_TICKET_POR_NOME: `${API_BASE_URL}/busca_ticket`,
    ATUALIZAR_TICKET: `${API_BASE_URL}/ticket`,
    EXCLUIR_TICKET: `${API_BASE_URL}/ticket`,
};



class Validacao {

    /*
    --------------------------------------------------------------------------------------
    Função para inicializar a máscara dos campos e validar o CPF
    --------------------------------------------------------------------------------------
    */
    static init() {
        $(document).ready(function () {
            $('#cep').mask('00000-000', { reverse: true });
        });
    }

    /*
    --------------------------------------------------------------------------------------
    Função para validar se todos os campos estão preenchidos, exceto o 'cep'
    --------------------------------------------------------------------------------------
    */
    static validarCamposExcetoCEP() {
        let todosPreenchidos = true;
        var formData = $('#formCadastro').serializeArray();

        // Itera sobre cada item no array de objetos formData
        formData.forEach(item => {
            if (item.name !== 'cep' && item.value.trim() === '') {
                todosPreenchidos = false;
                return false;  // Interrompe o loop
            }
        });

        return todosPreenchidos;
    }
}


// Chama a função para obter os tickets quando a página carregar
$(document).ready(function () {
    buscarTickets();
    Validacao.init();
});

/*
  --------------------------------------------------------------------------------------
  Função que busca os tickets cadastrados e adiciona na tabela
  --------------------------------------------------------------------------------------
*/

function buscarTickets() {
    limparTabelaTickets();
    $.ajax({
        url: URLS.BUSCAR_TICKETS,
        method: 'GET',
        contentType: 'application/json',
        success: function (data) {
            if (data && Array.isArray(data.tickets)) { // Verifica se data.tickets é um array
                data.tickets.forEach(function (ticket) {
                    adicionarTicketNaTabela(ticket);
                });
            } else {
                console.error('Formato inesperado da resposta da API:', data);
            }
        },
        error: function (error) {
            Swal.fire({
                title: "Erro ao obter tickets:",
                text: error.responseText,
                icon: "error"
            });
        }
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para excluir ticket, via requisição DELETE
  --------------------------------------------------------------------------------------
*/

window.excluirTicket = function (id) {
    Swal.fire({
        title: "Você tem certeza que deseja excluir este ticket?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Não, cancelar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${URLS.EXCLUIR_TICKET}?id=${encodeURIComponent(id)}`,
                type: 'DELETE',
                success: function (response) {
                    Swal.fire({
                        title: "Ticket excluído!",
                        icon: "success"
                    }).then(() => {
                        buscarTickets(); // Atualiza a lista de tickets após a exclusão
                    });
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        title: "Erro ao excluir ticket",
                        text: xhr.responseText,
                        icon: "error"
                    });
                }
            });
        }
    });
}

/*
  --------------------------------------------------------------------------------------
  Funções de filtros
  --------------------------------------------------------------------------------------
*/

function filtrarTicketsPorNome() {
    const nomeFiltro = $('#nome').val().toLowerCase();
    $.ajax({
        url: `${URLS.BUSCAR_TICKET_POR_NOME}?termo=${encodeURIComponent(nomeFiltro)}`,
        type: 'GET',
        success: function (data) {
            limparTabelaTickets();
            if (data && Array.isArray(data.tickets)) { // Verifica se data.tickets é um array
                data.tickets.forEach(ticket => {
                    adicionarTicketNaTabela(ticket);
                });
            } else {
                $('#ticketsTableBody').append('<tr><td colspan="10">Ticket não encontrado</td></tr>');
            }
        },
        error: function () {
            limparTabelaTickets();
            $('#ticketsTableBody').append('<tr><td colspan="10">Erro ao buscar tickets</td></tr>');
        }
    });
}




function filtrarTicketsPorId() {
    const ticketFiltro = $('#ticket').val().toLowerCase();
 
    $.ajax({
        url: `${URLS.BUSCAR_TICKET_POR_ID}?id=${encodeURIComponent(ticketFiltro)}`,
        type: 'GET',
        success: function (data) {
            limparTabelaTickets();
            if (data && data.id) { // Verifica se data.tickets é um array
                adicionarTicketNaTabela(data);
            } else {
                $('#ticketsTableBody').append('<tr><td colspan="10">Ticket não encontrado</td></tr>');
                
            }
        },
        error: function () {
            $('#ticketsTableBody')//.append('<tr><td colspan="10">Erro ao buscar tickets</td></tr>');
        }
    });
}

// Adiciona evento de input aos campos de filtro
$('#nome').on('input', filtrarTicketsPorNome);
$('#ticket').on('input', filtrarTicketsPorId);
/*
  --------------------------------------------------------------------------------------
  Função que adiciona tickets na Tabela
  --------------------------------------------------------------------------------------
*/

function adicionarTicketNaTabela(ticket) {
    $('#ticketsTableBody').append(`
        <tr>
            <td class="nome-column">${ticket.id}</td>
            <td class="nome-column">${ticket.title}</td>
            <td>${ticket.stats}</td>
            <td class="email-column">${ticket.description}</td>
            <td>${ticket.endereco}</td>
            <td>${mascararCEP(ticket.cep)}</td>
            <td>                
                <button class="btn btn-sm btn-edit" style="color:#ffffff;background:#ff6600"
    onclick="abrirModalEditar(${ticket.id})">
    <i class="fas fa-edit"></i> Editar
</button>

                <button class="btn btn-danger btn-sm btn-delete" onclick="excluirTicket(${ticket.id})"><i class="fas fa-trash"></i> Excluir</button>
            </td>
        </tr>
    `);

    Validacao.init();
}


// Adiciona evento de input aos campos de filtro
$('#nome').on('input', filtrarTicketsPorNome);
$('#ticket').on('input', filtrarTicketsPorId);

function abrirModalEditar(id) {
    // Realiza a requisição GET para buscar o ticket por ID
    fetch(`${URLS.BUSCAR_TICKET_POR_ID}?id=${encodeURIComponent(id)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar ticket');
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                // Monta o HTML do modal de edição
                const modalHtml = `
                    <div class="modal fade" id="modalEditarTicket" tabindex="-1" role="dialog" aria-labelledby="modalEditarTicketLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalEditarTicketLabel">Editar Ticket</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <form id="formEditarTicket">
                                        <input type="hidden" id="editarId" name="id" value="${data.id}">
                                        <div class="form-group">
                                            <label for="editarNome">Título:</label>
                                            <input type="text" class="form-control" id="editarNome" name="nome" value="${data.title}" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="editarDescricao">Descrição:</label>
                                            <textarea class="form-control" id="editarDescricao" name="descricao" rows="3">${data.description}</textarea>
                                        </div>
                                        <div class="form-group">
                                            <label for="editarStatus">Status:</label>
                                            <select id="editarStatus" class="form-control" name="status">
                                                <option value="Pendente" ${data.stats === 'Pendente' ? 'selected' : ''}>Pendente</option>
                                                <option value="Em andamento" ${data.stats === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
                                                <option value="Concluída" ${data.stats === 'Concluída' ? 'selected' : ''}>Concluída</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="editarCEP">CEP:</label>
                                            <input type="text" class="form-control" id="editarCEP" name="cep" value="${data.cep}">
                                        </div>
                                        <div class="form-group">
                                            <label for="editarEndereco">Endereço:</label>
                                            <input type="text" class="form-control" id="editarEndereco" name="endereco" value="${data.endereco}">
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                                    <button type="button" class="btn btn-primary" onclick="salvarEdicaoTicket()">Salvar Mudanças</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Adiciona o modal ao corpo do documento
                document.body.insertAdjacentHTML('beforeend', modalHtml);

                // Abre o modal de edição
                $('#modalEditarTicket').modal('show');
            } else {
                mostrarAlerta('error', 'Ticket não encontrado');
            }
        })
        .catch(error => {
            mostrarAlerta('error', error.message || 'Erro ao buscar ticket');
        });
}


// Função para salvar as mudanças no ticket
function salvarEdicaoTicket() {
    const formData = obterFormDataEdicao();
 

    $.ajax({
        url: URLS.ATUALIZAR_TICKET,
        method: 'PUT',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            Swal.fire({
                title: "Ticket atualizado com sucesso!",
                icon: "success"
            });

            // Fecha o modal após sucesso
            $('#modalEditarTicket').modal('hide');
            // Atualiza a tabela de tickets
            buscarTickets();
        },
        error: function () {
            mostrarAlerta('error', 'Erro ao atualizar ticket');
        }
    });
}

// Função para obter FormData com tratamento específico para edição
function obterFormDataEdicao() {
    const formData = new FormData();

    formData.append('id', document.getElementById('editarId').value);
    formData.append('title', document.getElementById('editarNome').value);
    formData.append('description', document.getElementById('editarDescricao').value);
    formData.append('stats', document.getElementById('editarStatus').value);
    formData.append('cep', document.getElementById('editarCEP').value);
    formData.append('endereco', document.getElementById('editarEndereco').value);

    return formData;
}

// Função para mostrar alertas
function mostrarAlerta(icon, title) {
    Swal.fire({
        icon: icon,
        title: title,
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para limpar tabela de Tickets
  --------------------------------------------------------------------------------------
*/

function limparTabelaTickets() {
    $('#ticketsTableBody').empty();
}

function mascararCEP(cep) {
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}
