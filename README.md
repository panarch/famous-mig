#Famous-mig
> Famous Migrator (from 0.3.5 to 0.7.x)

###Installation

1. In your project,
```
npm install famous-mig
npm install babelify
// Add babelify transform to your package.json
```
2. Remove loading famous.css
3. Insert this to your html which engine#0.7 uses
```
<style>
  html, body {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
  }
  body {
    position: absolute;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
    -webkit-perspective: 0;
    perspective: none;
    overflow: hidden;
  }
</style>
```

Currently, it depends on engine's develop branch, not 0.7.1.

Waiting for the new version

https://github.com/Famous/engine/issues/365

https://github.com/Famous/engine/issues/470

###Usage

It's simple, rename all the "famous" to "famous-mig"
```require('famous') --> require('famous-mig')```

In case of "Surface", if you need to use access _currentTarget, you should add ```useTarget: true``` option when you create Surface

---

###Development
Install dependencies ```npm install```

Run the dev server with ```npm run dev```

Now the dev server should be running on localhost:1618

Run the linters with ```npm run lint```

---

###LICENSE

MIT
