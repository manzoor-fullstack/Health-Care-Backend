import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

import authRoutes from './routes/auth.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';

import doctorRoutes from './routes/doctor.routes.js'
import patientRoutes from './routes/patient.routes.js'

import adminRoutes from './routes/admin.routes.js';

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, server-side calls
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);

app.use("/api/admin", adminRoutes);

export default app;
