// Importando as tabelas do DB
const sala = require('../model/sala');
const aluno = require('../model/aluno');
const fs = require('fs');

module.exports = {
    async salas(req, res) {
        // Parâmetro é a sala que vai ser editada
        const parametro = req.params.id;
        console.log(`parâmetro: ${parametro}`);
        const salasEditar = await sala.findByPk(parametro, {
            raw: true,
            attributes: ['IDSala', 'Nome', 'Capacidade']
        });

        res.render('../views/editarSala', {salasEditar});
    },

    // Ver pq ele n ta atualizando
    async atualizar(req, res) {
        // Dados é object object e id é a sala que está selecionada
        const dados = req.body;
        const id = req.params.id;
        // console.log(`id: ${id}`);
        // console.log(`dados: ${dados}`);

        await sala.update ({
            Nome: dados.nomeSala,
            Capacidade: dados.capacidadeSala
        },
        {
            where: { IDSala: id }
        });

        res.redirect('/');

    },

    async alunos(req, res){
        // Recebendo o id da URL
        const parametro = req.params.id;
        const alunos = await aluno.findByPk(parametro, {
            raw: true, //Retorna os somente os valores de uma tabela, sem os metadados
            attributes: ['IDAluno', 'Nome', 'Idade', 'Sexo', 'Foto', 'IDSala']
        });

        const salas = await sala.findAll({ raw: true, attributes: ['IDSala', 'Nome'] });
        res.render('../views/editarAluno', {salas, alunos});
    },

    async adicionar(req, res){
        const dados = req.body;
        const id = req.params.id;
        // console.log(`dados: ${dados}`);

        if (req.file) {
            // Recebendo a antiga foto do aluno
            const antigaFoto = await aluno.findAll({
                raw: true,
                attributes: ['Foto'],
                where: { IDAluno: id }
                });
                // Excluindo a foto da pasta
            if (antigaFoto[0].Foto != 'usuario.png') fs.unlink(`public/img/${antigaFoto[0].Foto}`, ( err => { if(err) console.log(err); } ));

            await aluno.update (
                { Foto: req.file.filename },
                { where: { IDAluno: id } }
            );
        }

        // Dando upgrade nas novas informações
        await aluno.update({
            Nome: dados.nome,
            Idade: dados.idade,
            Sexo: dados.sexo,
            IDSala: dados.sala
        },

        {
            where: { IDAluno: id }
        });
            res.redirect('/');
    },

    async deletar(req, res) {
        const id = req.params.id;

        const room = await sala.findByPk(id);

        if (room != null) {
            await room.destroy();
        }

        res.redirect("/");
    }
}