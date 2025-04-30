import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: "happy-dom",
        include: ['**/*.test.js'],
        exclude: ['node_modules/**/*'],
        coverage: {
            provider: "v8",
            reporter: ['text', 'lcov', 'json', 'html'],
            threshold: {
                global: {
                    branches: 80,
                    functions: 80,
                    lines: 80,
                    statements: 80,
                },
            },
        },
    },
    watch: {
        include: ['**/*.test.js'],
        exclude: ['node_modules/**/*'],
    },
    threads: false,
    reporters: ['default', 'summary'],
});