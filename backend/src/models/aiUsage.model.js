import mongoose, { mongo } from "mongoose";

const aiUsageSchema = new mongoose.Schema(
    {
        userId :{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        action: {
            type:String,
            required:true,
            trim:true,
        },

        status : {
            type: String,
            enum:['success','failed'],
            required:true,
        },

        inputLength : {
            type: Number,
            required: true,
            min:0,
        },

        errorCode: {
            type:Number,
            default:null,
        },
    },
    {
        timestamps: true,
    }
);

aiUsageSchema.index({userId: 1, createdAt: -1});

const AIUsage = mongoose.model("AIUsage", aiUsageSchema);

export default AIUsage;