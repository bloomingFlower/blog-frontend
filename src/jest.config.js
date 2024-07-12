module.exports = {
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "^axios$": require.resolve('axios')
    },
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    },
    transformIgnorePatterns: [
        "/node_modules/(?!(axios|react-toastify)/)"
    ],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']
};