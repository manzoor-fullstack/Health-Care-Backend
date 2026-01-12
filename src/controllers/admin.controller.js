import User from "../models/User.models.js";
import Appointment from "../models/Appointment.models.js";
import Doctor from '../models/Doctor.models.js';
import Patient from "../models/Patient.models.js";

const adminDashboard = async (req, res) => {
  try {
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalAppointments = await Appointment.countDocuments();

    // Today's appointments
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysAppointments = await Appointment.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });


    res.status(200).json({
      success: true,
      stats: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        todaysAppointments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
      error: error.message
    });
  }
};


// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if(!users){
        res.status(404).json({success: false, message: "Users not found"});
    }

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
};

// Get all the doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");

    if(!doctors){
        res.status(404).json({success: false, message: "doctors not found"});
    }

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
      error: error.message
    });
  }
};

// Get All patients
const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("-password");

    if(!patients){
        res.status(404).json({success: false, message: "patients not found"});
    }

    res.status(200).json({
      success: true,
      count: patients.length,
      patients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
      error: error.message
    });
  }
};

// approve doctor
 const approveDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );

  if (!doctor)
    return res.status(404).json({ message: "Doctor not found" });

  res.json({ message: "Doctor approved", doctor });
};

// Reject doctor
const rejectDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );

  if (!doctor)
    return res.status(404).json({ message: "Doctor not found" });

  res.json({ message: "Doctor rejected", doctor });
};

// Block doctor
const blockDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    { status: "blocked" },
    { new: true }
  );

  if (!doctor)
    return res.status(404).json({ message: "Doctor not found" });

  res.json({ message: "Doctor blocked", doctor });
};

// Unlock doctor
const unblockDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    { status: "active" },
    { new: true }
  );

  if (!doctor)
    return res.status(404).json({ message: "Doctor not found" });

  res.json({ message: "Doctor unblocked", doctor });
};

// Block Patient
const blockPatient = async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    { status: "blocked" },
    { new: true }
  );

  if (!patient)
    return res.status(404).json({ message: "Patient not found" });

  res.json({ message: "Patient blocked", patient });
};

// Unblock Patient
const unblockPatient = async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    { status: "active" },
    { new: true }
  );

  if (!patient)
    return res.status(404).json({ message: "Patient not found" });

  res.json({ message: "Patient unblocked", patient });
};


export { adminDashboard, getAllUsers, getDoctors, getPatients, approveDoctor, rejectDoctor, blockDoctor, unblockDoctor, blockPatient, unblockPatient };
