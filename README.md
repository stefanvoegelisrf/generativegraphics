# Getting p5.sound to work

p5.sound is a plugin for p5. To get it to work with typescript with vite, I needed to add `@rollup/plugin-inject` and add it to the vite config like so:

```javascript
    plugins: [
        inject({
            p5: 'p5'
        }),
    ],
```

Then I needed to change the compiler options in tsconfig.json to:
```javascript
{
  "compilerOptions": {
    "types": ["vite/client"],
    "esModuleInterop": true
  }
}
```