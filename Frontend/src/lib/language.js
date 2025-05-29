export function getLanguageName(languageId) {
    const LANGUAGE_NAMES = {
        74: "TypeScript",
        63: "JavaScript",
        71: "Python",
        62: "Java",
        64: "C++",
    };

    return LANGUAGE_NAMES[languageId || "Unknown"];
}

export function getLanguageId(language) {
    const languageMap = {
        PYTHON: 71,
        JAVASCRIPT: 63,
        JAVA: 62,
        TYPESCRIPT: 74,
    };

    return languageMap[language.toUpperCase()];
}
