import Appointment from "../models/Appointment.models.js";
import User from "../models/User.models.js";
import Doctor from '../models/Doctor.models.js'

// Patient → Create Appointment
const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, symptoms } = req.body;


    const doctorExists = await Doctor.findById(doctorId);
    console.log("doctor exists", doctorExists);
    if (!doctorExists) {
      return res.status(400).json({ message: "Doctor not found" });
    }

    if (!date || !time) {
      return res.status(400).json({ message: "Date and time are required" });
    }

    // ✅ combine date + time
    const appointmentDateTime = new Date(`${date}T${time}`);

    if (appointmentDateTime < new Date()) {
      return res.status(400).json({ message: "Cannot book past appointment" });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      appointmentDateTime,
      symptoms,
      fee: 2000,
    });

    res.status(201).json({
      success: true,
      message: "Appointment created",
      appointment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Doctor → Approve Appointment
const approveAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    if (appointment.status === "approved") {
      return res
        .status(400)
        .json({ success: false, message: "Appointment already approved" });
    }

    if (appointment.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Cannot approve a rejected appointment",
      });
    }

    appointment.status = "approved";
    appointment.approvedAt = new Date();
    await appointment.save();

    res
      .status(200)
      .json({ success: true, message: "Appointment approved", appointment });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error approving appointment",
      error: error.message,
    });
  }
};

// Doctor → Reject Appointment
const rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    if (appointment.status === "rejected") {
      return res
        .status(400)
        .json({ success: false, message: "Appointment already rejected" });
    }

    if (appointment.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Cannot reject an approved appointment",
      });
    }

    appointment.status = "rejected";
    appointment.rejectedAt = new Date();
    await appointment.save();

    res
      .status(200)
      .json({ success: true, message: "Appointment rejected", appointment });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error rejecting appointment",
      error: error.message,
    });
  }
};

// Admin → Delete Appointment
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    // await appointment.remove();
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET Appointments (Role-based)
const getAppointments = async (req, res) => {
  try {
    const user = req.user; // comes from auth middleware
    let filter = {};

    // Patient → only their appointments
    if (user.role === "patient") {
      filter.patient = user._id;
    }

    // Doctor → appointments assigned to them
    if (user.role === "doctor") {
      filter.doctor = user._id;
    }

    // Admin → no filter (get all)

    const appointments = await Appointment.find(filter)
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

export {
  createAppointment,
  approveAppointment,
  rejectAppointment,
  deleteAppointment,
  getAppointments,
};
