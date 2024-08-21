// Importando o Multer
const multer = require('multer');

// Configuração de armazenamento
const multerConfig = multer.diskStorage({

    // Criar destino de armazenamento
    destination: (req, file, cb) => {
        cb(null, 'public/img'); // Caso de erro no local de destino
    },

    // Renomear o arquivo
    filename: (req, file, cb) => {

        // Criando um novo nome para o arquivo (Data em milisegundos - nome original)
        const fileName = `${new Date().getTime()}-${file.originalname}`;

        // Alterando efetivamente o nome
        cb(null, fileName); // cb = CallBack
    }
});

// Exportando configurações
module.exports = { storage:multerConfig};