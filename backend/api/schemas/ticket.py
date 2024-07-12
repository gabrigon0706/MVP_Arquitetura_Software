from pydantic import BaseModel
from typing import Optional, List
from models.ticket import Ticket


class TicketSchema(BaseModel):
    """ Define como um novo ticket deve ser representado para inserção.
    """
    title: str = "Internet lenta"
    stats: str = "Em aberto"
    description: str = "A internet está muito lenta, não consigo trabalhar!"
    cep: str = "01031-970"
    endereco: str = "Praça do Correio, s/n	Centro"


class TicketViewSchema(BaseModel):
    """ Define como um ticket deve ser representado para visualização.
    """
    title: str = "Internet lenta"
    stats: str = "Em aberto"
    description: str = "A internet está muito lenta, não consigo trabalhar!"
    cep: str = "01031-970"
    endereco: str = "Praça do Correio, s/n	Centro"


class TicketBuscaPorNomeSchema(BaseModel):
    """ Define a estrutura para busca de ticket por nome.
    """
    termo: str = "Internet lenta"


class TicketBuscaPorIDSchema(BaseModel):
    """ Define a estrutura para busca de ticket por ID.
    """
    id: int = 1


class ListagemTicketsSchema(BaseModel):
    """ Define a estrutura para listagem de tickets.
    """
    tickets: List[TicketViewSchema]


def apresenta_tickets(tickets: List[Ticket]):
    """ Retorna uma representação de uma lista de tickets conforme o schema definido em
        ListagemTicketsSchema.
    """
    result = []
    for ticket in tickets:
        result.append({
            "id": ticket.id,
            "title": ticket.title,
            "stats": ticket.stats,
            "description": ticket.description,
            "cep": ticket.cep,
            "endereco": ticket.endereco,
        })

    return {"tickets": result}


class TicketDelSchema(BaseModel):
    """ Define a estrutura do dado retornado após uma requisição de remoção de ticket.
    """
    message: str
    id: int


def apresenta_ticket(ticket: Ticket):
    """ Retorna uma representação de um ticket conforme o schema definido em
        TicketViewSchema.
    """
    return {
        "id": ticket.id,
        "title": ticket.title,
        "stats": ticket.stats,
        "description": ticket.description,
        "cep": ticket.cep,
        "endereco": ticket.endereco,
    }

# Esquema Pydantic para receber dados de atualização
class PutTicketSchema(BaseModel):
    id: int
    title: str
    stats: str
    description: str

# Esquema Pydantic para representação de um ticket
class TicketViewSchema(BaseModel):
    id: int
    title: str
    stats: str
    description: str
