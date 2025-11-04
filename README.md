# jabes-sender

Passo a Passo:

1 - Instale o Node.js "https://nodejs.org/pt"
2 - Instale o DBbrowser for SQLite "https://sqlitebrowser.org/dl"
3 - Rodar o comando "npm install" no terminal
4 - Rodar o comando "node database.js"
5 - Adicionar os dados ao Banco de dados utilizando DBbrowser,
  5.1 Modelo de SQL 
      INSERT INTO contatos (nome, cnpj, telefone) VALUES
      ('Contato-um', '1234567890123', '+5544999123456'), 
      ('Contado-dois', '9876543210987', '+5544999765432'); 
6 - Rodar o comando "node server.js" e aguardar
7 - Quando o QR-code aparecer você escaneia com a camêra do celular para conectar no WhatsApp web

Assim que a validação for concluida o sistema começará a disparar as mensagens para os respectivos contatos, vale notar que o PDF a ser carimbado e enviado
deve estar na pasta raiz do projeto com o nome "exemplo.pdf" ou se quiser usar outro nome de pdf você deve alterar a linha 9 do "server.js"
