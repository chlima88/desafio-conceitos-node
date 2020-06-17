const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


app.get("/repositories", (request, response) => {
  /* Rota que lista todos os repositórios */
  
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  /*A rota deve receber title, url e techs dentro do corpo da requisição, sendo a URL o link para o 
  github desse repositório. Ao cadastrar um novo projeto, ele deve ser armazenado dentro de um 
  objeto no seguinte formato: { id: "uuid", title: 'Desafio Node.js', url: 'http://github.com/...', 
  techs: ["Node.js", "..."], likes: 0 }; Certifique-se que o ID seja um UUID, e de sempre iniciar 
  os likes como 0. */

  const { title, url, techs } = request.body

  if (!title || !url || !techs){
    return response.status(400).json({message:"Request body should contains title, url and techs"})
  }

  repository = {
    title,
    url,
    techs,
    id: uuid(),
    likes: 0 }

    repositories.push(repository)

    return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  /*  A rota deve alterar apenas o title, a url e as techs do repositório que possua o id igual 
  ao id presente nos parâmetros da rota. */
 
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found"})
  }

  const storedRepository = repositories[repositoryIndex]

  const repository = {
    title: title || storedRepository.title,
    url: url || storedRepository.url,
    techs: techs || storedRepository.techs,
    id,
    likes: storedRepository.likes
  };

  repositories[repositoryIndex] = repository

  response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  // A rota deve deletar o repositório com o id presente nos parâmetros da rota;

  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found"})
  };

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  /*A rota deve aumentar o número de likes do repositório específico escolhido através do id 
  presente nos parâmetros da rota, a cada chamada dessa rota, o número de likes deve ser 
  aumentado em 1. */

  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: "Repository not found"});
  }

  const [ repository ] = repositories.filter(repository => repository.id === id );
  repository.likes += 1;
  repositories[repositoryIndex] = repository;

  return response.json(repository);
   

});

module.exports = app;
