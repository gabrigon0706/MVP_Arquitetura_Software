# Solicitações e Atendimento de Serviços Públicos Web

O objetivo principal desta API é fornecer endpoints para solicitação de serviços públicos, edição de informações existentes, consulta e exclusão de solicitações quando necessário.

A partir de **solicitações**, é possível solicitar serviços para a prefeitura da sua cidade.

Nesta primeira versão, é possível:

- Criar solicitações de serviços
- Verificar serviços solicitados
- Deletar serviços solicitados
- Buscar serviços pelo título da solicitação
- Buscar serviços pelo ticket ID da solicitação
- Editar solicitações

---

## Como Executar o Projeto com Docker

### Pré-requisitos

- Docker instalado no seu sistema operacional. Se ainda não tiver, você pode baixar e instalar a versão adequada para o seu sistema em [Docker Hub](https://hub.docker.com/).

### Como Executar através do Docker

Certifique-se de ter o [Docker](https://docs.docker.com/engine/install/) instalado e em execução em sua máquina.

Navegue até o diretório que contém o Dockerfile em **./backend/api** e **./frontend**. Execute como administrador o seguinte comando para construir a imagem Docker:

```bash
$ docker-compose up --build
```

Uma vez executando, para acessar o front-end, basta abrir [http://localhost:80/index.html](http://localhost:80/index.html) no navegador.

Para acessar a API backend, basta abrir [http://localhost:5000/#/](http://localhost:5000/#/) no navegador.