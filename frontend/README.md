# Solicitações e Atendimento de Serviços Públicos Web

O objetivo principal desta API é fornecer endpoints para solicitação de serviços públicos, edição de informações existentes, consulta e exclusão de solicitações quando necessário.

As principais tecnologias utilizadas são:

- [Flask](https://flask.palletsprojects.com/en/2.3.x/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [OpenAPI3](https://swagger.io/specification/)
- [SQLite](https://www.sqlite.org/index.html)

---

## Como Executar o Projeto com Docker

Este projeto é uma aplicação front-end que utiliza HTML, CSS e JavaScript, e é executado dentro de um contêiner Docker.

### Pré-requisitos

- Docker instalado no seu sistema operacional. Se ainda não tiver, você pode baixar e instalar a versão adequada para o seu sistema em [Docker Hub](https://hub.docker.com/).

### Como Executar Através do Docker

Certifique-se de ter o [Docker](https://docs.docker.com/engine/install/) instalado e em execução em sua máquina.

Navegue até o diretório que contém o Dockerfile em `./frontend`. Execute como administrador o seguinte comando para construir a imagem Docker:

```bash
$ docker-compose up --build
```

Uma vez criada a imagem, para executar o contêiner, basta executar, **como administrador**, o seguinte comando:

```bash
$ docker-compose up
```

Para acessar a aplicação, abra [http://localhost:8080/views/index.html](http://localhost:8080/views/index.html) no navegador.