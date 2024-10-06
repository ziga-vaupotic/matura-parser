const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');
const { emit } = require('process');
const e = require('express');

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
      return fs.statSync(path+'/'+file).isDirectory();
    });
  }
dirs = getDirectories("FIZIKA/")
pdfs = {}

MAXIMUM_ID = 1000000000

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/kviz.html');
});
app.get('/pdf', (req, res) => {
    res.sendFile(__dirname + '/FIZIKA/' + pdfs[req.query.id][0] + "/" + pdfs[req.query.id][1] + ".pdf");
  });

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/public/game.html');
});

app.get('/end', (req, res) => {
  res.sendFile(__dirname + '/public/end.html');
});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }


class Player {
  #player_username = ""

  constructor(username) {
    this.#player_username = username
  }
}

class Question {
  #matura = ""
  #num = 0
  #answer = ""
  #answered = ""

  constructor()
  {
    /* Choose a random matura and a random question*/

    this.#matura = dirs[getRandomInt(dirs.length)]
    this.#num = this.generateRandomQuestion()

    /* Call async answer questions, therefore we shall not expect a return*/
    this.#answer = this.parseAnswer()
  }


  generateRandomQuestion() 
  {
    const quest = (getRandomInt(35) + 1)
    return quest
  }

  parseAnswer()
  {
    /* Read a JSON parse of the asnwer PDF */
    const data = fs.readFileSync(__dirname + "/FIZIKA/" + this.#matura + "/res.json", 'utf8')
    const obj = JSON.parse(data);
    return obj["res"][this.#num]
  }

  getAnswer()
  {
    return this.#answer
  }

  getRecord()
  {
    return {"CA": this.#answer, "UA": this.#answered}
  }

  wasRecordCorrect()
  {
    return this.#answer == this.#answered
  }
  
  getQuestion()
  {
    return [this.#matura, this.#num]
  }


  setAnswered(answer)
  {
    this.#answered = answer
  }

  isAnswered()
  {
    return this.#answered
  }
}

class Game {
  #id = ""
  #player = null
  #questions = []
  #answered = []

  constructor(data) {
    this.#id = getRandomInt(MAXIMUM_ID)
    this.#player = new Player(data["username"])
    for (var i = 0; i < data["questions"]; i++)
    {
      this.#questions.push(new Question())
    }
  }

  emitQuestion(socket){
    try 
    {
      if(this.#questions.at(-1).isAnswered())
      {
          this.#questions.pop()
      }
    }
    catch
    {
      socket.emit("error")
      return
    }

    if(this.#questions.length > 0)
    {
      let question = this.#questions.at(-1)
      if (question) 
      {
        pdfs[this.#id] = question.getQuestion()
        socket.emit("question")
      }
    }
    else
    {
      socket.emit("end_game")
    }
  }
  emitAnswer(socket, answer){
    let question = this.#questions.at(-1)
    //add this question to already answered
    console.log( question.getAnswer(), answer)
    socket.emit("answer", question.getAnswer() == answer)
    question.setAnswered(answer)
    this.#answered.push(question)
  }

  emitFinal(socket)
  {
    var return_list = []
    var correct_num = 0;
    this.#answered.forEach(element => {
      return_list.push(element.getRecord())
      if(element.wasRecordCorrect())
      {
        correct_num += 1
      }
    });
    var obj = JSON.stringify({"answers": return_list, "gamescore": 0, "average": correct_num /  this.#answered.length, "grade": "1"})
    console.log(obj)
    socket.emit("answers", obj)
  }

  get game_id() {
    return this.#id
  }

}

active_game_list = []



io.on('connection', (socket) => {
  console.log(socket.handshake.query)

  if(socket.handshake.query.id)
  {
    // find game
    if (!socket.game)
    {
      active_game_list.forEach(element => {
        if(element.game_id == socket.handshake.query.id)
          socket.game = element
      });
      // emit first question if the game is valid
      if(socket.game)
      {
        socket.game.emitQuestion(socket)
      }
    }

    socket.on("answer", data => {
      socket.game.emitAnswer(socket, data)
    })

    socket.on("new_question", data => {
      socket.game.emitQuestion(socket)
    })
  }
  else if (socket.handshake.query.eid)
  {
    if (!socket.game)
      {
        active_game_list.forEach(element => {
          if(element.game_id == socket.handshake.query.eid)
            socket.game = element
        });
        // emit first answers
        if(socket.game)
        {
          socket.game.emitFinal(socket)
        }
      }
  }
  else 
  {
    socket.on("create_quiz", data => {
      game_obj = new Game(data)
      active_game_list.push(game_obj)
      socket.emit("new_game", game_obj.game_id)
    })
  }

  console.log('a user connected');
});

server.listen(27017, () => {
  console.log('listening on *:3100');
});
