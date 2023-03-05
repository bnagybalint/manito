module.exports = {
    moduleDirectories: ['node_modules', 'src'],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    transform: {
        // '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.[t|j]sx?$': 'babel-jest',
    },
    testEnvironment: 'node',
    testRegex: '.*\\.(test|spec)?\\.(ts|tsx)$',
};
