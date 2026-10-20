import * as aiService from "../services/ai.service.js";


const generate = async (req, res) => {
    const response = await aiService.generate({
        ...req.body,
        userId: req.user.sub,
    });

    res.status(200).json({
        success: true,
        message: "AI response generated successfully",
        data: {
            response,
        },
    });
}

export {
    generate,
}