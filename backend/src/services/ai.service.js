
import AIUsage from "../models/aiUsage.model.js";
import { generateAIResponse } from "../providers/ai.provider.js";

const recordUsage = async ({
  userId,
  action,
  status,
  inputLength,
  errorCode = null,
}) => {
  try {
    await AIUsage.create({
      userId,
      action,
      status,
      inputLength,
      errorCode,
    });
  } catch (error) {
    // Tracking failures should not break AI generation.
    console.error("Failed to record AI usage:", error.message);
  }
};

const generate = async ({ userId, action, input, context, options }) => {
  try {
    const response = await generateAIResponse({
      action,
      input,
      context,
      options,
    });

    await recordUsage({
      userId,
      action,
      status: "success",
      inputLength: input.length,
    });

    return response;
  } catch (error) {
    await recordUsage({
      userId,
      action,
      status: "failed",
      inputLength: input.length,
      errorCode: error.statusCode || 500,
    });

    throw error;
  }
};

export { generate };
