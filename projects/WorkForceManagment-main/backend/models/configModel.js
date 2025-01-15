import mongoose from'mongoose';

const ConfigSchema =  mongoose.Schema({

  duration: {
    type: Number,
    required: true,
  },

  startAt:{
    type: Number,
    required: true,
  },

  endAt:{
    type: Number,
    required: true,
  },
  
  editedBy:{
    type: String,
    required: true,
  },
},
  {
    timestamps: true,
  }
);

export const ConfigModel =  mongoose.model("configs", ConfigSchema);
