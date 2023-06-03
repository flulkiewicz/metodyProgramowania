module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$", // Wzorzec plików testowych
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Mapowanie ścieżek aliasów
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transformacja plików TypeScript
  },
  collectCoverage: true, // Raport pokrycia kodu
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"], // Pliki, z których zostanie zebrane pokrycie kodu
  coverageDirectory: "coverage", // Katalog, w którym zostanie wygenerowany raport pokrycia kodu
};
