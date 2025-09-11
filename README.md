#JKL Veículos - Back-end
Este é o servidor responsável por gerenciar os dados do site JKL Veículos, conectando-se a um banco de dados MySQL.

##Passos para Instalação

###1. Pré-requisitos
Node.js: Instale o Node.js (versão LTS recomendada).

MySQL: Tenha um servidor de banco de dados MySQL instalado e rodando.

###2. Configurar o Banco de Dados
Abra seu gerenciador de banco de dados preferido (DBeaver, HeidiSQL, etc.).

Copie e execute o código do arquivo schema.sql para criar o banco de dados jkl_veiculos e a tabela cars.

###3. Configurar o Servidor
Abra o arquivo server.js.

Localize a seção dbConfig e substitua as credenciais (user, password) pelas suas próprias credenciais do MySQL.

###4. Instalar Dependências
Abra o terminal na pasta backend.

Rode o seguinte comando para instalar os pacotes necessários (express, cors, mysql2):

npm install

###5. Iniciar o Servidor
Ainda no terminal, na pasta backend, rode o comando:

npm start

Se tudo estiver correto, você verá a mensagem "🚀 Servidor rodando na porta 3001".

Pronto! Seu back-end está no ar e pronto para receber solicitações do front-end.
