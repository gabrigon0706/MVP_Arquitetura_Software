from flask_openapi3 import OpenAPI, Info, Tag
from flask import redirect
from urllib.parse import unquote

from sqlalchemy.exc import IntegrityError

from models import Session, Ticket
from logger import logger
from schemas import *
from flask_cors import CORS

info = Info(title="Minha API", version="1.0.0")
app = OpenAPI(__name__, info=info)
CORS(app)

# definindo tags
home_tag = Tag(name="Documentação", description="Seleção de documentação: Swagger, Redoc ou RapiDoc")
ticket_tag = Tag(name="Ticket", description="Adição, visualização e remoção de tickets à base")


@app.get('/', tags=[home_tag])
def home():
    """Redireciona para /openapi, tela que permite a escolha do estilo de documentação.
    """
    return redirect('/openapi')


@app.post('/ticket', tags=[ticket_tag],
          responses={"200": TicketViewSchema, "409": ErrorSchema, "400": ErrorSchema})
def add_ticket(form: TicketSchema):
    """Adiciona um novo Ticket à base de dados

    Retorna uma representação dos Tickets.
    """
    print(form)
    ticket = Ticket(
        title=form.title,
        stats=form.stats,
        description=form.description,
        cep=form.cep,
        endereco=form.endereco
    )
    logger.info(f"Adicionando Ticket de nome: '{ticket.title}'")
    try:
        # criando conexão com a base
        session = Session()
        # adicionando Ticket
        session.add(ticket)
        # efetivando o camando de adição de novo item na tabela
        session.commit()

        logger.info("Adicionado ticket: ", ticket)
        return apresenta_ticket(ticket), 200

    except IntegrityError as e:
        # como a duplicidade do nome é a provável razão do IntegrityError
        error_msg = "Ticket de mesmo nome e marca já salvo na base :/"
        logger.warning(f"Erro ao adicionar ticket '{ticket.title}', {error_msg}")
        return {"mesage": error_msg}, 409

    except Exception as e:
        # caso um erro fora do previsto
        error_msg = "Não foi possível salvar novo item :/"
        logger.warning(f"Erro ao adicionar ticket '{ticket.title}', {error_msg}")
        return {"mesage": error_msg}, 400


@app.get('/tickets', tags=[ticket_tag],
         responses={"200": ListagemTicketsSchema, "404": ErrorSchema})
def get_tickets():
    """Faz a busca por todos os Tickets cadastrados

    Retorna uma representação da listagem de tickets.
    """
    logger.info(f"Coletando tickets ")
    # criando conexão com a base
    session = Session()
    # fazendo a busca
    tickets = session.query(Ticket).all()

    if not tickets:
        # se não há tickets cadastrados
        return {"tickets": []}, 200
    else:
        logger.info(f"%d tickets encontrados" % len(tickets))
        # retorna a representação de tickets
        return apresenta_tickets(tickets), 200


@app.get('/ticket', tags=[ticket_tag],
         responses={"200": TicketViewSchema, "404": ErrorSchema})
def get_ticket(query: TicketBuscaPorIDSchema):
    """Faz a busca por um Ticket a partir do id do ticket

    Retorna uma representação dos tickets e comentários associados.
    """
    ticket_id = query.id
    logger.info(f"Coletando dados sobre ticket #{ticket_id}")
    # criando conexão com a base
    session = Session()
    # fazendo a busca
    ticket = session.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        # se o ticket não foi encontrado
        error_msg = "Ticket não encontrado na base :/"
        logger.warning(f"Erro ao buscar ticket '{ticket_id}', {error_msg}")
        return {"mesage": error_msg}, 404
    else:
        logger.info("Ticket encontrado: %s" % ticket)
        # retorna a representação de ticket
        return apresenta_ticket(ticket), 200


@app.delete('/ticket', tags=[ticket_tag],
            responses={"200": TicketDelSchema, "404": ErrorSchema})
def del_ticket(query: TicketBuscaPorIDSchema):
    """Deleta um Ticket a partir do id informado

    Retorna uma mensagem de confirmação da remoção.
    """
    ticket_id = query.id
    logger.info(f"Deletando dados sobre ticket #{ticket_id}")
    # criando conexão com a base
    session = Session()
    # fazendo a remoção
    count = session.query(Ticket).filter(Ticket.id == ticket_id).delete()
    session.commit()

    if count:
        # retorna a representação da mensagem de confirmação
        logger.info(f"Deletado ticket #{ticket_id}")
        return {"mesage": "Ticket removido", "id": ticket_id}
    else:
        # se o ticket não foi encontrado
        error_msg = "Ticket não encontrado na base :/"
        logger.warning(f"Erro ao deletar ticket #'{ticket_id}', {error_msg}")
        return {"mesage": error_msg}, 404


@app.get('/busca_ticket', tags=[ticket_tag],
         responses={"200": ListagemTicketsSchema, "404": ErrorSchema})
def busca_ticket(query: TicketBuscaPorNomeSchema):
    """Faz a busca por tickets em que o termo passando Ticket a partir do nome

    Retorna uma representação dos tickets e comentários associados.
    """
    termo = unquote(query.termo)
    logger.info(f"Fazendo a busca por nome com o termo: {termo}")
    # criando conexão com a base
    session = Session()
    # fazendo a busca
    tickets = session.query(Ticket).filter(Ticket.title.ilike(f"%{termo}%")).all()
    
    if not tickets:
        # se não há tickets cadastrados
        return {"tickets": []}, 200
    else:
        logger.info(f"%d tickets encontrados" % len(tickets))
        # retorna a representação de tickets
        return apresenta_tickets(tickets), 200

@app.put('/ticket', tags=[ticket_tag], 
responses={"200": ListagemTicketsSchema, "404": ErrorSchema})
def update_ticket(form: PutTicketSchema):
    """Atualiza um ticket na base de dados pelo ID."""
    try:
        ticket_id = form.id
        logger.info(f"Atualizando ticket #{ticket_id}")

        # Conexão com o banco de dados e busca pelo ticket
        session = Session()
        ticket = session.query(Ticket).filter(Ticket.id == ticket_id).first()

        if not ticket:
            # Se o ticket não for encontrado
            error_msg = f"Ticket com ID {ticket_id} não encontrado na base de dados."
            logger.warning(error_msg)
            return {"message": error_msg}, 404

        # Atualiza os dados do ticket com base nos dados recebidos
        ticket.title = form.title
        ticket.stats = form.stats
        ticket.description = form.description


        # efetivando o camando de adição de novo item na tabela
        session.commit()

        logger.info("Ticket Atualizado: ", ticket)
        return apresenta_ticket(ticket), 200

    except IntegrityError as e:
        # como a duplicidade do nome é a provável razão do IntegrityError
        error_msg = "Ticket de mesmo nome e marca já salvo na base :/"
        logger.warning(f"Erro ao adicionar ticket '{ticket.title}', {error_msg}")
        return {"mesage": error_msg}, 409

    except Exception as e:
        # caso um erro fora do previsto
        error_msg = "Não foi possível salvar novo item :/"
        logger.warning(f"Erro ao adicionar ticket '{ticket.title}', {error_msg}")
        return {"mesage": error_msg}, 400
        
        # Retorna a representação do ticket atualizado
        return apresenta_tickets(ticket), 200
    except Exception as e:
        # Se ocorrer um erro inesperado
        error_msg = "Não foi possível atualizar o ticket."
        logger.warning(error_msg)
        return {"message": error_msg}, 400
