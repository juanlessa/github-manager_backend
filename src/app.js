const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;
    const id = uuid();
    repositories.push({ id, title, url, techs, likes: 0 });
    return response.json({ id, title, url, techs, likes: 0 });
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;

    // find id index in repository
    const repositoryIndex = repositories.findIndex(
        (repository) => repository.id == id
    );
    // verify if id exists
    if (repositoryIndex < 0) {
        return response.status(400).json({ error: "repository not found" });
    }
    // get repository new informations
    const { title, url, techs } = request.body;
    const likes = repositories[repositoryIndex].likes;
    const repository = { id, title, url, techs, likes };
    // update repositories
    repositories[repositoryIndex] = repository;
    return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const repositoryIndex = repositories.findIndex(
        (repository) => repository.id === id
    );
    if (repositoryIndex > 0) {
        repositories.splice(repositoryIndex, 1);
    } else {
        return response.status(400).json({ error: "repository not found" });
    }
    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;
    repositoryIndex = repositories.findIndex(
        (repository) => repository.id == id
    );
    if (repositoryIndex < 0) {
        return response.status(400).json({ error: "repository not found" });
    }

    repositories[repositoryIndex].likes++;
    return response.json(repositories[repositoryIndex]);
});

module.exports = app;
