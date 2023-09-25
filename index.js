import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
const date = new Date();
const app = express();
const port =  3000;
let versesData = [];
//I have removed my api key from the below you can login and add your own.
const API_KEY = "";
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));  

async function getData(chapterNumber, res) {
    versesData = [];
    const chapterURL = `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterNumber}/`;

    const versesURL = `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterNumber}/verses/`;

    const optionsForChapter = {headers: {'X-RapidAPI-Key': API_KEY, 'X-RapidAPI-Host': 'bhagavad-gita3.p.rapidapi.com'}};

    const optionsForVerses = {headers: {'X-RapidAPI-Key': API_KEY,'X-RapidAPI-Host': 'bhagavad-gita3.p.rapidapi.com'}};

    try{
        const response = await axios.get(chapterURL, optionsForChapter)

        const data = response.data;

        const getVerse = await axios.get(versesURL, optionsForVerses); 
        let verseArray = getVerse.data; 
        for(let verse of verseArray) {
            const numberOfVerse = verse
            const desiredBlock = numberOfVerse.translations.find(translation => translation.author_name === "Swami Sivananda");
            versesData.push(desiredBlock.description)
        }
        
        res.render("index.ejs", {
            chapterNumber: data.chapter_number,
            chapterName: data.name_translated,
            chapterSummary: data.chapter_summary,
            slokArray: versesData,
            currentYear: date.getFullYear()

    });
        
    } catch(error){
        
        console.log("There is an error", error);
    }   
    
}
app.get("/", async(req,res)=>{
    getData(1, res)
})

app.post("/chapter", async(req,res)=>{
    let oldString = req.body.chapter;
     const newString = oldString.replace("Chapter ", "");
     getData(newString, res);

})

app.listen(port, ()=>{
    console.log(`server is listning on port ${port}`)
})
