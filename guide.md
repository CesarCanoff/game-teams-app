### To use Path Mapping

Install babel-plugin-module-resolver
```bash
npm install --save-dev babel-plugin-module-resolver
```

Configure babel.config.js
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".ts", ".tsx", ".js", ".json"],
          alias: {
            "@assets": "./src/assets",
            "@components": "./src/components",
            "@routes": "./src/routes",
            "@screens": "./src/screens",
            "@storage": "./src/storage",
            "@theme": "./src/theme",
            "@utils": "./src/utils",
          },
        },
      ],
    ],
  };
};

```

Configure tsconfig.json
```js
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": "./",
    "paths": {
      "@assets/*": ["./src/assets/*"],
      "@components/*": ["./src/components/*"],
      "@routes/*": ["./src/routes/*"],
      "@screens/*": ["./src/screens/*"],
      "@storage/*": ["./src/storage/*"],
      "@theme/*": ["./src/theme/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}
```