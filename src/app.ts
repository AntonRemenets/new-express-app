import express from 'express'
import { errorHandler } from './middlewares/errors-handler.middleware'
import userRoutes from './routes/user.routes'

const app = express()

app.use(express.json())

// Routes
app.use('/api/user', userRoutes)

// Middlewares
app.use(errorHandler)

export default app
