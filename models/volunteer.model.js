import mongoose from "mongoose";

const volunteerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        delivered: {
            type: Number,
            default: 0,
        }
    },
    { timestamps: true }
); // createdAt, updatedAt

const volunteer = mongoose.model("Volunteer", volunteerSchema);
export default volunteer;
