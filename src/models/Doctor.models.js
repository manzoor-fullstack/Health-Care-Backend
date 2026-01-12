import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // link to auth user
    name: { type: String, required: true },
    phone: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    qualification: { type: String },
    bio: { type: String },
    clinicName: { type: String },
    address: { type: String },
    fee: { type: Number },
    profilePic: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "blocked"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", DoctorSchema);
