import express from 'express';
import cors from 'cors';
import * as fs from 'fs';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

 

app.get('/', (req,res)=> {
    res.send('Il server sta funzionando correttamente. \n Per visuallizzare tutti i dati basta andare al seguente ip: http://localhost:3000/films')
})

let films= [
    {"titolo":"Blue is the Warmest Color",
    "autore":"Jul' Maroh",
    "datadipubblicazione":"2013-10-24",
    "regista":"Abdellatif Kechiche",
    "copertina":"https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRCeqFKAQoX779iNCMHjUkt_vsPUJK-9hSI_skIa6p269zTTaFr",
    "id":0}];

//LETTURA FILE 
fs.open("./dati.json", "wx+", (err,f) => {
    if(err){
        fs.readFile("../ApiRest Film/dati.json", (erro,data) => {
            if(erro) console.error(erro);
            else {
                console.log("Letto!");
                console.log(JSON.parse(data));
                films = JSON.parse(data);
            }
        });
        return;
    }
    fs.writeFile("./dati.json", JSON.stringify(films), (err) => {
        if(err) console.error(err);
        else console.log("File FILM Salvato!")
    })
})


//WEB API PER INSERIMENTO!
app.post('/film', (req,res)=>{
    //const film = req.body;
    const film = JSON.parse(JSON.stringify(req.body));

    film.id = films.length; //Aggiungo un id ai film, che si autoincrementa.
    films.push(film);

    fs.writeFile('dati.json',JSON.stringify(films),(err) =>{ if(err)console.error(err)});

    res.send('Film aggiunto al database!')

})

//RITORNA LA LISTA DEI FILM CON METODO GET 
app.get('/films', (req,res)=>{
    res.json(films)
})

//MOSTRA SINGOLO FILM GET CON ID
app.get('/film/:id',(req, res)=> {
    const id = req.params.id;
    for (let film of films){
            if(film.id === +id){
                res.json(film)
                return;
            }
    }
    res.status(404).send('Film non trovato!');
})



//METODO PER CANCELLARE UN FILM
app.delete('/film/:id', (req, res) => {
    const id = req.params.id;
    films = films.filter(i =>{
        if(i.id !== +id){
            return true;
        }
        return false;
    })
    res.send('Il film è stato cancellato!')
})

//MODIFICA LIBRO METODO POST
app.post('/film/:id', (req, res) => {
    const id = req.params.id;
    const newFilm = req.body;

    
    for(let i = 0;  i < films.length; i++){
        let film = films[i]     
        if(film.id = +id){
            films[i] = newFilm;
        }
    }
    res.send('Modifica avvenuta correttamente')
})


app.listen(port, ()=> console.log("L'app sta funzionando"));