
const express = require('express');
const app = express();
const PORT = 4000;

const http = require('http').Server(app);//це телефонна лінія для прийому дзвінків (HTTP-запитів).
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.json());


const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


app.get('/experts', async (req, res) => {
    
    try {

        const experts = await prisma.expert.findMany();
        res.json(experts);
        
    } catch (error) {
        
        console.error('Не вдалося отримати список експертів');
    }
})

app.post('/experts', async (req, res) => {

    try {

        const { name, experience, position, competence } = req.body;

        const newExpert = await prisma.expert.create({
            data: {
                name,
                experience,
                position,
                competence
            }
        })

        res.status(201).json(newExpert);
        
    } catch (error) {
        console.error('Error creating expert');
        res.status(500).json('Не вдалося створити експерта');
    }
})


app.delete('/experts/:id', async (req, res) => {

    try {

        const {id} = req.params;

        const existingExpert = await prisma.expert.findUnique({
            where: { id: Number(id)}
        })

        if(!existingExpert) {
            return res.status(404).json('Експерта не знайдено');
        }
        
        await prisma.expert.delete({
            where: { id: Number(id)}
        })

        res.json({message: 'Експерта видалено'})


    } catch (error) {
        console.error('Error deleting expert');
        res.status(500).json('Не вдалося видалити експерта');
    }
})
    


http.listen(PORT, () => {
    console.log('Server is working');
});
