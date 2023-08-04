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
  const users = await prisma.user.findMany();
  return res.status(200).json(users)
})

app.post('/api/users', async (req, res) => {
  const data = req.body;

  const userCreated = await prisma.user.create({
    data: {
      fullname: data.fullname,
      address: data.address,
      email: data.email,
      phone: data.phone,
      role: data.role
    }
  })
  return res.status(201).json(userCreated)
})

app.put('/api/users', async (req, res) => {
  const data = req.body;

  const userUpdated = await prisma.user.update({
    where: {
      id: data.id
    },
    data: {
      ...data //¿Cómo puedo restringir la actualización de un campo?
      //por dónde es recomendable pasar el id, por el body o en url
    }
  })
  return res.status(200).json(userUpdated)
})

app.delete('/api/users', async (req, res) => {
  const data = req.body;
  console.log(data);

  const userDeleted = await prisma.user.delete({
    where: {
      email: data.email //este campo debe ser unique para borrar. Borra todo el user. si quisiera borrar solo un campo, esto se hace con update?
    }
  })
  return res.status(200).json(userDeleted)
})

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
