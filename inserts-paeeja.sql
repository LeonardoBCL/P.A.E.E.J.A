INSERT INTO `avatar`(`id`,`nome`,`preco`) VALUES
(1,'avatar-1',50),
(2,'avatar-2',50),
(3,'avatar-fem',50),
(4,'avatar-fem2',50);

INSERT INTO `cursos`(`id`,`nome`) VALUES(1,'Português');
INSERT INTO `modulos`(`id`,`curso_id`,`nome`) VALUES(1,1,'Ensino Médio');
INSERT INTO `aulas`(`id`,`modulo_id`,`titulo`) VALUES(1,1,'Gramática');
INSERT INTO `questionarios`(`id`,`aula_id`) VALUES(1,1);

INSERT INTO `questoes`(`id`,`questionario_id`,`enunciado`,`alternativa_a`,`alternativa_b`,`alternativa_c`,`alternativa_d`,`alternativa_e`,`correta`) VALUES
(1,1,'Leia o trecho da propaganda a seguir:  “Não é pelo prazer de fumar, é pelo prazer de saber que você fuma o melhor.” (Revista O Cruzeiro, 1953. Apud: VARGAS, M. A. Cigarro: prazer e poder na mídia impressa brasileira. Revista Eco-Pós, n. 8, jul.-dez. 2007.) Na construção da propaganda, o uso da vírgula no trecho destacado tem como objetivo principal:',' Separar orações coordenadas que se contradizem.','Marcar a omissão de um termo anteriormente citado.',' Separar elementos com a mesma função sintática.','Destacar uma enumeração de ideias centrais.',' Introduzir uma explicação acessória.','A'),
(2,1,'Então por que o sr. me fez prometer que nunca diria a ninguém?  — Porque eu pretendia esquecer também — respondeu ele —, e esperava nunca mais ver o tal homem. (DICKENS, C. Grandes esperanças. São Paulo: Cia. das Letras, 2012.) A pontuação empregada no trecho “— Porque eu pretendia esquecer também — respondeu ele —, e esperava nunca mais ver o tal homem.” contribui para','Evitar a ambiguidade de sentido.','Enfatizar a dramaticidade do relato.',' Separar a fala do narrador da fala do personagem.','Evidenciar o discurso indireto da narrativa.',' Garantir a omissão de termos repetidos.','C'),
(3,1,'Eu vos direi: “Amai para entendê-las! Porque só o amor pode entendê-las!”  (MEIRELES, C. Obra poética. Rio de Janeiro: Nova Aguilar, 2001.) No poema, o uso da forma verbal “vos direi” e da construção exclamativa “Porque só o amor pode entendê-las!” evidencia um recurso expressivo da linguagem literária. Esse recurso consiste em','Recorrer à impessoalidade da linguagem.','Atribuir às palavras sentidos objetivos.','Expressar subjetividade por meio da linguagem.','Aproximar o autor e o leitor pelo discurso direto.','Substituir as marcas do eu lírico pela narração.','C');