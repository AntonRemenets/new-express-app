import app from './app'
import dotenv from 'dotenv'
import prisma from './services/prisma.service'

dotenv.config({ quiet: true })

const PORT = process.env.PORT || 3000

app.listen(3000, () => {
  console.log(`Server => http://localhost:${PORT}`)
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})
