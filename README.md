## React Starter

This project is a React starter for quick personal projects. I've added the project with the following file structure:

```text
React-Starter/
└── src/
    ├── components/
    │   └── // All Components in their own folders with .jsx and .scss files
    ├── global/
    │   └── _util.jsx // Util js functions
    ├── images/
    │   └── favicon.png
    ├── styles/
    │   ├── partials/ // Partial styling util classes
    │   └── main.scss // Import all styling components
    ├── app.jsx
    ├── index.html
    └── index.jsx
├── .crcf.config.js
├── .crcfrc
├── .eslintignore
├── .eslintrc
├── .gitignore
├── .prettierrc
├── babel.config.js
├── package.json
├── README.md
└── webpack.config.js
```

## Available Scripts

## `npm run build`

Build Current Project into the `dist/` folder.

## `npm run start`

Start project from `dist/` file. Automatically opens in [Local Host Host 9000](localhost:9000).

## `npm run combine`

Builds and starts project

## `npx crcf src/components/{Component Name}`

Using the `Create React Component folder` package. Creates scss and jsx files
