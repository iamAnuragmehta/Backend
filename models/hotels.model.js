import mongoose from "mongoose";

const hotelsSchema = mongoose.Schema(
  {
    hotelname: {
      type: String,
      required: true,
    },
    ownername: {
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
    address: {
      type: String,
      required: true,
    },
    fssai: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    contributions: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
); // createdAt, updatedAt

const Hotels = mongoose.model("Hotels", hotelsSchema);
export default Hotels;
