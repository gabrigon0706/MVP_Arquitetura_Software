# Solicitações e Atendimento de Serviços Públicos Web

O objetivo principal desta API é fornecer endpoints para solicitação de serviços públicos, edição de informações existentes, consulta e exclusão de solicitações quando necessário.

As principais tecnologias utilizadas são:

- [Flask](https://flask.palletsprojects.com/en/2.3.x/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [OpenAPI3](https://swagger.io/specification/)
- [SQLite](https://www.sqlite.org/index.html)

---

### Instalação

Para instalar as dependências, certifique-se de ter todas as bibliotecas listadas no `requirements.txt`. Após clonar o repositório, navegue até o diretório raiz via terminal e execute os seguintes comandos:

> É fortemente indicado o uso de ambientes virtuais do tipo [virtualenv](https://virtualenv.pypa.io/en/latest/installation.html).

```bash
(env)$ pip install -r requirements.txt
```

Este comando instala todas as dependências/bibliotecas descritas no arquivo `requirements.txt`.

---

### Executando o Servidor

Para iniciar a API, execute o seguinte comando:

```bash
(env)$ flask run --host 0.0.0.0 --port 5000
```

Em ambiente de desenvolvimento, utilize o parâmetro `--reload` para reiniciar automaticamente o servidor após alterações no código-fonte:

```bash
(env)$ flask run --host 0.0.0.0 --port 5000 --reload
```

---

### Acesso no Navegador

Abra [http://localhost:5000/#/](http://localhost:5000/#/) no navegador para verificar o status da API em execução.

---

## Como Executar Através do Docker

Certifique-se de ter o Docker instalado e em execução em sua máquina.

Navegue até o diretório que contém o Dockerfile em `./backend/api`. Execute como administrador o seguinte comando para construir a imagem Docker:

```bash
$ docker-compose up --build
```

Uma vez criada a imagem, para executar o container basta executar, **como administrador**, o seguinte comando:

```bash
$ docker-compose up
```

Para acessar a API, basta abrir [http://localhost:5000/#/](http://localhost:5000/#/) no navegador.