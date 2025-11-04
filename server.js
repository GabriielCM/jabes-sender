// server.js
const path = require('path');
const fs = require('fs');
const { getAllContatos } = require('./database');
const { stampPdf } = require('./pdf-reader');
const { initializeWhatsApp, sendPdfToContact } = require('./disparar');

// Caminho do PDF original
const PDF_ORIGINAL = path.join(__dirname, 'exemplo.pdf');

// Verifica se o PDF existe
if (!fs.existsSync(PDF_ORIGINAL)) {
  console.error('ERRO: Arquivo "exemplo.pdf" não encontrado na pasta do projeto!');
  console.error('   → Coloque um PDF chamado "exemplo.pdf" na raiz do projeto.');
  process.exit(1);
}

// Controla execução única
let executando = false;

async function main() {
  if (executando) {
    console.log('Envio já em andamento. Ignorando nova execução.');
    return;
  }
  executando = true;

  console.log('INICIANDO ENVIO ATIVO PARA CONTATOS...\n');
  
  try {
    // 1. Inicializa WhatsApp
    const client = await initializeWhatsApp();

    // 2. Lê contatos do banco
    getAllContatos(async (contatos) => {
      if (contatos.length === 0) {
        console.log('Nenhum contato encontrado no banco de dados.');
        executando = false;
        return;
      }

      console.log(`Encontrados ${contatos.length} contato(s). Iniciando envios...\n`);

      // 3. Loop por cada contato
      for (const [index, contato] of contatos.entries()) {
        try {
          console.log(`[${index + 1}/${contatos.length}] Processando: ${contato.nome}`);
          console.log(`   Telefone: ${contato.telefone}`);

          // Gera PDF carimbado
          const pdfCarimbado = await stampPdf(PDF_ORIGINAL, contato);
          const nomeArquivo = `Doc_${contato.nome.replace(/\s+/g, '_')}.pdf`;

          // Envia ATIVAMENTE
          await sendPdfToContact(contato.telefone, pdfCarimbado, nomeArquivo);

          console.log(`ENVIADO COM SUCESSO → ${contato.nome}\n`);

          // Pausa anti-ban (5 segundos)
          if (index < contatos.length - 1) {
            console.log('Aguardando 5 segundos antes do próximo envio...\n');
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        } catch (error) {
          console.error(`FALHA AO ENVIAR PARA ${contato.nome}:`);
          console.error(`   Erro: ${error.message}\n`);
        }
      }

      // Finalização
      console.log('TODOS OS ENVIOS CONCLUÍDOS!');
      console.log('Fechando WhatsApp em 5 segundos...');

      setTimeout(() => {
        client.destroy()
          .then(() => {
            console.log('WhatsApp desconectado.');
            process.exit(0);
          })
          .catch(() => process.exit(0));
      }, 5000);

    });
  } catch (error) {
    console.error('ERRO CRÍTICO:', error.message);
    executando = false;
    process.exit(1);
  }
}

// Executa apenas se chamado diretamente
if (require.main === module) {
  main();
}