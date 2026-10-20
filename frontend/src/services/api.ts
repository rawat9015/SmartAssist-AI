
const API_BASE_URL = "http://localhost:5000/api/v1";

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: {
            _id: string;
            name: string;
            email: string;
            role: string;
        };
        accessToken: string;
        refreshToken: string;
    };
}

export interface GenerateRequest {
    action: string;
    input: string;
    context?: string;
    options?: {
        tone?: string;
        language?: string;
    };
}

export interface GenerateResponse {
    success: boolean;
    message: string;
    data: {
        response: string;
    };
}

export const loginUser = async (
    email: string,
    password: string
): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const result = (await response.json()) as LoginResponse;

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Login failed.");
    }

    return result;
};

export const generateAIResponse = async (
    payload: GenerateRequest,
    accessToken: string
): Promise<GenerateResponse> => {
    const response = await fetch(`${API_BASE_URL}/ai/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    });

    const result = (await response.json()) as GenerateResponse;

    if (!response.ok || !result.success) {
        throw new Error(result.message || "AI response generation failed.");
    }

    return result;
};
