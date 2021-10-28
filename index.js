const restify = require("restify");
const mongoose = require("mongoose");

mongoose
  .connect("LINKMONGO")
  .then((_) => {
    const server = restify.createServer({
      name: "my-rest-api",
      version: "1.0.0",
    });

    server.use(restify.plugins.bodyParser());

    const alunoSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
    });

    const Aluno = mongoose.model("Aluno", alunoSchema);

    server.get("/alunos", (req, res, next) => {
      Aluno.find().then((alunos) => {
        res.json(alunos);
        return next();
      });
    });

    server.get("/alunos/:id", (req, res, next) => {
      Aluno.findById(req.params.id).then((aluno) => {
        if (aluno) {
          res.json(aluno);
        } else {
          res.status(404);
          res.json({ message: "not Found" });
        }
        return next();
      });
    });

    server.post("/alunos", (req, res, next) => {
      let aluno = new Aluno(req.body);
      aluno
        .save()
        .then((aluno) => {
          res.json(aluno);
        })
        .catch((error) => {
          res.status(400);
          res.json({ message: error.message });
        });
    });
    server.listen(8000, () => {
      console.log("Api listen on 3000");
    });
  })
  .catch(console.error);
