from sqlalchemy import Column, String, Integer, DateTime, Float, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from typing import Union

from  models import Base


class Ticket(Base):
    """
    Represents a ticket object.

    Attributes:
        id (int): The unique identifier of the ticket.
        title (str): The title of the ticket.
        stats (str): The status of the ticket.
        description (str): The description of the ticket.
        data_insercao (datetime, optional): The date and time of ticket insertion.

    Methods:
        to_dict(): Returns a dictionary representation of the ticket.
    """

    __tablename__ = 'ticket'

    id = Column("pk_ticket", Integer, primary_key=True)
    title = Column(String(2000)) 
    stats = Column(String(20)) 
    description = Column(String(2000))
    cep = Column(String(2000))
    endereco = Column(String(2000))
    data_insercao = Column(DateTime, default=datetime.now())

    __table_args__ = (UniqueConstraint("title", "description", name="ticket_unique_id"),)

    def __init__(self, title, stats, description,cep, endereco ,data_insercao: Union[DateTime, None] = None):
        """
        Initializes a new instance of the Ticket class.

        Args:
            title (str): The title of the ticket.
            stats (str): The status of the ticket.
            description (str): The description of the ticket.
            data_insercao (datetime, optional): The date and time of ticket insertion.
        """
        self.title = title
        self.stats = stats
        self.description = description
        self.cep = cep
        self.endereco = endereco

        if data_insercao:
            self.data_insercao = data_insercao

    def to_dict(self):
        """
        Returns a dictionary representation of the ticket.

        Returns:
            dict: A dictionary containing the ticket information.
        """
        return {
            "id": self.id,
            "title": self.title,
            "stats": self.stats,
            "description": self.description,
            "cep": self.cep,
            "endereco": self.endereco,
            "data_insercao": self.data_insercao,
        }

    def __repr__(self):
        """
        Returns a string representation of the ticket.

        Returns:
            str: A string representation of the ticket.
        """
        return f"Ticket(id={self.id}, title='{self.title}', stats='{self.stats}', cep='{self.cep}', endereco='{self.endereco}' ,description='{self.description}')"

