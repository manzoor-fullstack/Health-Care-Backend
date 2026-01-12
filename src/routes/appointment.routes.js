import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import {
  createAppointment,
  approveAppointment,
  rejectAppointment,
  deleteAppointment,
  getAppointments,
} from "../controllers/appointment.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Create an appointment (Patient only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - date
 *               - time
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: 66c9a2f0a9b8c123456789ab
 *                 description: Doctor MongoDB ID
 *               date:
 *                 type: string
 *                 example: 2026-01-15
 *                 description: Appointment date (YYYY-MM-DD)
 *               time:
 *                 type: string
 *                 example: 14:30
 *                 description: Appointment time (HH:mm)
 *               symptoms:
 *                 type: string
 *                 example: Fever and headache
 *                 description: Patient symptoms
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Doctor not found or invalid data
 *       403:
 *         description: Access forbidden (not patient)
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, roleMiddleware("patient"), createAppointment);

/**
 * @swagger
 * /api/appointments/{id}/approve:
 *   patch:
 *     summary: Approve an appointment (Doctor only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment approved successfully
 *       403:
 *         description: Access forbidden (not the assigned doctor)
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("doctor"),
  approveAppointment
);

/**
 * @swagger
 * /api/appointments/{id}/reject:
 *   patch:
 *     summary: Reject an appointment (Doctor only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment rejected successfully
 *       403:
 *         description: Access forbidden (not the assigned doctor)
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware("doctor"),
  rejectAppointment
);

/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Delete an appointment (Admin only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *       403:
 *         description: Access forbidden (not admin)
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteAppointment
);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Get appointments (role-based)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments for the user role
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   patient:
 *                     type: string
 *                   doctor:
 *                     type: string
 *                   date:
 *                     type: string
 *                   status:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
// GET appointments (Patient / Doctor / Admin)
router.get(
  "/",
  authMiddleware,
  roleMiddleware("patient", "doctor", "admin"),
  getAppointments
);

export default router;
