
(() => {
    if (window.__smartAssistInitialized) return;
    window.__smartAssistInitialized = true;

    const API_BASE_URL = "http://localhost:5000/api/v1";

    const ACTIONS = [
        { id: "rewrite", label: "Rewrite", description: "Improve clarity and wording" },
        { id: "summarize", label: "Summarize", description: "Make the text shorter" },
        { id: "reply", label: "Reply", description: "Write a suitable response" },
        { id: "translate", label: "Translate", description: "Translate into another language" },
        { id: "grammar", label: "Fix grammar", description: "Correct grammar and spelling" },
        { id: "explain", label: "Explain", description: "Explain the selected text" },
        { id: "action-items", label: "Action items", description: "Extract tasks and next steps" },
        { id: "meeting-notes", label: "Meeting notes", description: "Create structured notes" },
        { id: "generate-sql", label: "Generate SQL", description: "Create an SQL query" },
        { id: "generate-regex", label: "Generate Regex", description: "Create a regular expression" },
        { id: "jira-ticket", label: "Jira ticket", description: "Draft a Jira ticket" }
    ];

    const TONES = [
        "Professional",
        "Friendly",
        "Formal",
        "Casual",
        "Concise"
    ];

    const LANGUAGES = [
        "English",
        "Hindi",
        "Spanish",
        "French",
        "German"
    ];

    let accessToken = null;
    let selectedText = "";
    let selectedAction = "rewrite";
    let selectedTone = "Professional";
    let selectedLanguage = "English";
    let popupPosition = { left: 20, top: 100 };
    let floatingButton = null;
    let popup = null;
    let isGenerating = false;

    // --------------------------------------------------
    // Helpers
    // --------------------------------------------------

    function createElement(tag, text, styles = {}) {
        const element = document.createElement(tag);

        if (text !== undefined && text !== null) {
            element.textContent = text;
        }

        Object.assign(element.style, styles);
        return element;
    }

    function createButton(text, onClick, primary = false) {
        const button = createElement("button", text, {
            width: "100%",
            paddingInline: "10px 12px",
            marginTop: "8px",
            marginLeft:"0px",
            border: primary ? "none" : "1px solid #e0e0e0",
            borderRadius: "8px",
            background: primary ? "#5b4bdb" : "#ffffff",
            color: primary ? "#ffffff" : "#202124",
            fontSize: "13px",
            fontWeight: "600",
            textAlign: "center",
            cursor: "pointer",
            boxSizing: "border-box"
        });

        button.type = "button";
        button.addEventListener("click", onClick);

        return button;
    }

    function showMessage(container, message, isError = false) {
        const messageElement = createElement("p", message, {
            margin: "10px 0 0",
            fontSize: "12px",
            lineHeight: "1.5",
            color: isError ? "#c62828" : "#555555",
            overflowWrap: "anywhere"
        });

        container.appendChild(messageElement);
        return messageElement;
    }

    function addStyles() {
        if (document.getElementById("smart-assist-styles")) return;

        const style = document.createElement("style");
        style.id = "smart-assist-styles";

        style.textContent = `
      #smart-assist-floating-button:hover {
        background: #4033b4 !important;
      }

      #smart-assist-action-popup button:hover {
        filter: brightness(0.97);
      }

      #smart-assist-action-popup input:focus,
      #smart-assist-action-popup select:focus {
        outline: 2px solid #aaa0ff;
        outline-offset: 1px;
      }

      #smart-assist-action-popup button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `;

        (document.head || document.documentElement).appendChild(style);
    }

    function removeFloatingButton() {
        floatingButton?.remove();
        floatingButton = null;
    }

    function closePopup() {
        popup?.remove();
        popup = null;
    }

    function getPopupPosition() {
        const width = 320;
        const height = 450;
        const margin = 12;

        let left = popupPosition.left;
        let top = popupPosition.top;

        if (left + width > window.innerWidth - margin) {
            left = window.innerWidth - width - margin;
        }

        if (top + height > window.innerHeight - margin) {
            top = popupPosition.top - height - 20;
        }

        left = Math.max(margin, left);
        top = Math.max(margin, top);

        return { left, top };
    }

    function createPopupShell() {
        closePopup();

        popup = createElement("div", undefined, {
            position: "fixed",
            width: "320px",
            maxWidth: "calc(100vw - 24px)",
            maxHeight: "min(520px, calc(100vh - 24px))",
            overflowY: "auto",
            padding: "16px",
            background: "#ffffff",
            color: "#202124",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            zIndex: "2147483647",
            boxSizing: "border-box",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            lineHeight: "1.4"
        });

        popup.id = "smart-assist-action-popup";

        const position = getPopupPosition();
        popup.style.left = `${position.left}px`;
        popup.style.top = `${position.top}px`;

        document.body.appendChild(popup);

        const header = createElement("div", undefined, {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            marginBottom: "12px"
        });

        const title = createElement("strong", "✦ SmartAssist AI", {
            fontSize: "16px",
            color: "#202124"
        });

        const closeButton = createElement("button", "×", {
            border: "none",
            background: "transparent",
            color: "#666666",
            fontSize: "23px",
            cursor: "pointer",
            padding: "0 4px"
        });

        closeButton.type = "button";
        closeButton.setAttribute("aria-label", "Close SmartAssist AI");
        closeButton.addEventListener("click", closePopup);

        header.append(title, closeButton);
        popup.appendChild(header);

        return popup;
    }

    function addSelectedTextPreview(container) {
        const label = createElement("div", "Selected text", {
            fontWeight: "600",
            fontSize: "12px",
            marginBottom: "6px"
        });

        const preview = createElement("div", selectedText, {
            background: "#f5f5fa",
            border: "1px solid #ececf3",
            borderRadius: "8px",
            padding: "10px",
            fontSize: "12px",
            lineHeight: "1.5",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            maxHeight: "95px",
            overflowY: "auto",
            color: "#333333",
            marginBottom: "12px"
        });

        container.append(label, preview);
    }

    function addFieldLabel(container, text, control) {
        const wrapper = createElement("div", undefined, {
            marginTop: "12px"
        });

        const label = createElement("label", text, {
            display: "block",
            fontWeight: "600",
            fontSize: "12px",
            marginBottom: "6px"
        });

        wrapper.append(label, control);
        container.appendChild(wrapper);

        return control;
    }

    function createSelect(options, value) {
        const select = document.createElement("select");

        Object.assign(select.style, {
            width: "100%",
            paddingInline: "10px",
            border: "1px solid #dddddd",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#202124",
            fontSize: "13px",
            boxSizing: "border-box"
        });

        options.forEach((optionValue) => {
            const option = document.createElement("option");
            option.value = optionValue;
            option.textContent = optionValue;
            select.appendChild(option);
        });

        select.value = value;
        return select;
    }

    // --------------------------------------------------
    // Login
    // --------------------------------------------------

    function showLoginScreen() {
        const container = createPopupShell();

        container.appendChild(
            createElement("p", "Log in to use your AI writing assistant.", {
                color: "#666666",
                fontSize: "13px",
                margin: "0 0 14px"
            })
        );

        const email = document.createElement("input");
        email.type = "email";
        email.placeholder = "Email address";
        email.autocomplete = "username";

        const password = document.createElement("input");
        password.type = "password";
        password.placeholder = "Password";
        password.autocomplete = "current-password";

        [email, password].forEach((input) => {
            Object.assign(input.style, {
                display: "block",
                width: "100%",
                padding: "11px",
                marginTop: "9px",
                border: "1px solid #dddddd",
                borderRadius: "8px",
                boxSizing: "border-box",
                fontSize: "13px"
            });

            container.appendChild(input);
        });

        const messageArea = createElement("div");
        container.appendChild(messageArea);

        const loginButton = createButton("Log in", async () => {
            if (!email.value.trim() || !password.value) {
                showMessage(messageArea, "Enter your email and password.", true);
                return;
            }

            loginButton.disabled = true;
            loginButton.textContent = "Logging in...";
            messageArea.replaceChildren();

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.value.trim(),
                        password: password.value
                    })
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || "Login failed.");
                }

                accessToken = result.data.accessToken;

                // Keep the token in memory only. It is not persisted.
                showActionScreen();
            } catch (error) {
                showMessage(
                    messageArea,
                    error instanceof Error
                        ? error.message
                        : "Unable to log in. Check your backend connection.",
                    true
                );
            } finally {
                if (loginButton.isConnected) {
                    loginButton.disabled = false;
                    loginButton.textContent = "Log in";
                }
            }
        }, true);

        container.appendChild(loginButton);

        email.addEventListener("keydown", (event) => {
            if (event.key === "Enter") password.focus();
        });

        password.addEventListener("keydown", (event) => {
            if (event.key === "Enter") loginButton.click();
        });

        email.focus();
    }

    // --------------------------------------------------
    // Select an AI action
    // --------------------------------------------------

    function showActionScreen() {
        const container = createPopupShell();

        container.appendChild(
            createElement("p", "What would you like to do?", {
                margin: "0 0 12px",
                color: "#666666",
                fontSize: "13px"
            })
        );

        addSelectedTextPreview(container);

        const actionsContainer = createElement("div", undefined, {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "7px"
        });

        ACTIONS.forEach((action) => {
            const button = createElement("button", action.label, {
                paddingInline: "11px 8px",
                border: selectedAction === action.id
                    ? "2px solid #5b4bdb"
                    : "1px solid #e0e0e0",
                borderRadius: "8px",
                background: selectedAction === action.id ? "#f1efff" : "#ffffff",
                color: "#202124",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                minWidth: "0",
                overflowWrap: "anywhere"
            });

            button.type = "button";
            button.title = action.description;

            button.addEventListener("click", () => {
                selectedAction = action.id;
                showSettingsScreen();
            });

            actionsContainer.appendChild(button);
        });

        container.appendChild(actionsContainer);

        container.appendChild(
            createButton("Log out", () => {
                accessToken = null;
                showLoginScreen();
            })
        );
    }

    // --------------------------------------------------
    // Configure action and submit
    // --------------------------------------------------

    function showSettingsScreen() {
        const container = createPopupShell();
        const action = ACTIONS.find((item) => item.id === selectedAction);

        container.appendChild(
            createElement("p", action?.description || "Configure your request.", {
                margin: "0 0 12px",
                color: "#666666",
                fontSize: "13px"
            })
        );

        addSelectedTextPreview(container);

        const toneSelect = createSelect(TONES, selectedTone);
        toneSelect.addEventListener("change", () => {
            selectedTone = toneSelect.value;
        });
        addFieldLabel(container, "Tone", toneSelect);

        const languageSelect = createSelect(LANGUAGES, selectedLanguage);
        languageSelect.addEventListener("change", () => {
            selectedLanguage = languageSelect.value;
        });
        addFieldLabel(container, "Language", languageSelect);

        const messageArea = createElement("div");
        container.appendChild(messageArea);

        container.appendChild(
            createButton("Back to actions", showActionScreen)
        );

        const generateButton = createButton("Generate response", async () => {
            if (!accessToken) {
                showLoginScreen();
                return;
            }

            if (isGenerating) return;

            isGenerating = true;
            generateButton.disabled = true;
            generateButton.textContent = "Generating...";
            messageArea.replaceChildren();

            try {
                const response = await fetch(`${API_BASE_URL}/ai/generate`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        action: selectedAction,
                        input: selectedText,
                        options: {
                            tone: selectedTone,
                            language: selectedLanguage
                        }
                    })
                });

                const result = await response.json();

                if (response.status === 401) {
                    accessToken = null;
                    showLoginScreen();
                    showMessage(
                        popup,
                        "Your session expired. Please log in again.",
                        true
                    );
                    return;
                }

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "AI response generation failed."
                    );
                }

                showResponseScreen(result.data.response);
            } catch (error) {
                showMessage(
                    messageArea,
                    error instanceof Error
                        ? error.message
                        : "Unable to generate a response. Check your backend connection.",
                    true
                );
            } finally {
                isGenerating = false;

                if (generateButton.isConnected) {
                    generateButton.disabled = false;
                    generateButton.textContent = "Generate response";
                }
            }
        }, true);

        container.appendChild(generateButton);
    }

    // --------------------------------------------------
    // Show the AI response in the same popup
    // --------------------------------------------------

    function showResponseScreen(responseText) {
        const container = createPopupShell();

        container.appendChild(
            createElement("p", "Your AI response is ready.", {
                margin: "0 0 12px",
                color: "#666666",
                fontSize: "13px"
            })
        );

        const responseBox = createElement("div", responseText, {
            padding: "12px",
            border: "1px solid #e5e7eb",
            borderRadius: "9px",
            background: "#f8f8fc",
            color: "#202124",
            fontSize: "13px",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            maxHeight: "250px",
            overflowY: "auto"
        });

        container.appendChild(responseBox);

        container.appendChild(
            createButton("Try another action", showActionScreen)
        );

        container.appendChild(
            createButton("Generate again", showSettingsScreen, true)
        );
    }

    // --------------------------------------------------
    // Floating button on selected webpage text
    // --------------------------------------------------

    function showFloatingButton() {
        console.log("[SmartAssist] Floating button created");
        removeFloatingButton();

        floatingButton = createElement("button", "✦ SmartAssist AI", {
            position: "fixed",
            left: `${Math.max(8, Math.min(
                popupPosition.left,
                window.innerWidth - 160
            ))}px`,
            top: `${Math.max(8, Math.min(
                popupPosition.top,
                window.innerHeight - 48
            ))}px`,
            zIndex: "2147483647",
            paddingInline: "10px 14px",
            border: "none",
            borderRadius: "10px",
            background: "#202124",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)"
        });

        floatingButton.id = "smart-assist-floating-button";
        floatingButton.type = "button";

        // Prevent the click from clearing the page selection.

        floatingButton.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            event.stopPropagation();

            console.log("[SmartAssist] Button pressed");
            console.log("[SmartAssist] Selected text:", selectedText);

            if (!selectedText) {
                console.error("[SmartAssist] No selected text found");
                return;
            }

            removeFloatingButton();

            if (accessToken) {
                console.log("[SmartAssist] Opening action screen");
                showActionScreen();
            } else {
                console.log("[SmartAssist] Opening login screen");
                showLoginScreen();
            }
        });


        document.body.appendChild(floatingButton);
    }

    function handleTextSelection(event) {
        // Ignore selections made inside SmartAssist's own popup.
        if (
            event?.target instanceof Element &&
            event.target.closest("#smart-assist-action-popup")
        ) {
            return;
        }

        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (!text || !selection || selection.rangeCount === 0) {
            return;
        }

        // Avoid showing the button for extremely large selections.
        if (text.length > 10000) return;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        if (!rect.width && !rect.height) return;

        selectedText = text;
        selectedAction = "rewrite";

        popupPosition = {
            left: rect.left,
            top: rect.bottom + 8
        };

        addStyles();
        showFloatingButton();
    }

    // Hide the floating button when clicking elsewhere.
    document.addEventListener("mousedown", (event) => {
        if (
            event.target instanceof Element &&
            (
                event.target.closest("#smart-assist-floating-button") ||
                event.target.closest("#smart-assist-action-popup")
            )
        ) {
            return;
        }

        removeFloatingButton();
    });

    document.addEventListener("mouseup", handleTextSelection);
    document.addEventListener("keyup", handleTextSelection);
})();
