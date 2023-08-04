const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client')


const app = express();
const port = 8080;
const prisma = new PrismaClient();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/healthcheck', ( _, res) => {
  res.status(200).json('Server OK')
})

app.get('/api/users', async ( _, res) => {

  try{
    const users = await prisma.user.findMany();
    res.status(200).json(users)
  } catch(error) {
    console.log(`${error}`);
    res.status(400).json(error.message)
  }

})

app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try{
    const userById = await prisma.user.findUnique({
      where: {
        id
      }
    })
    res.status(200).json(userById)
  } catch(error) {
      res.status(400).json({
      error: error.message,
      message: '¡Algo salió mal!'
    })
    console.log(error.message);
  }

})

app.post('/api/users', async (req, res) => {
  const data = req.body;
  try{
    const userCreated = await prisma.user.create({
      data: {
        fullname: data.fullname,
        address: data.address,
        email: data.email,
        phone: data.phone,
        role: data.role
      }
    })
    res.status(201).json(userCreated)
  } catch(error){
      res.status(400).json({
      error: error.message,
      message: '¡Algo salió mal!'
    })
    console.log(error.message);
  }

})

app.put('/api/users/:id', async (req, res) => {
  const data = req.body;
  const { id } = req.params
  /* ¿Cómo puedo restringir la actualización de un campo?: 
  const updateUser = req.body;
  const { id } = req.params

  const prevUser = await prisma.user.findUnique(id)

  if(updateUser.email !== prevUser.email) {
    throw new Error('El email no se puede actualizar')
  } */

  try {
    const userUpdated = await prisma.user.update({
      where: {
        id
      },
      data: {
        ...data
      }
    })
    res.status(200).json(userUpdated)
  } catch(error) {
      res.status(400).json({
      error: error.message,
      message: '¡Algo salió mal!'
    })
    console.log(error.message);
  }
})

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const userDeleted = await prisma.user.delete({
      where: {
        id
      }
    })
    res.status(200).json(userDeleted)
  } catch(error){
    res.status(400).json({
      error: error.message,
      message: '¡Algo salió mal!'
    })
    console.log(error.message);
  }
})

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
