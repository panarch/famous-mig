#Famous-mig
> Famous Migrator (from 0.3.5 to 0.7.x)

###Installation

* In your project,
```
npm install famous-mig
npm install babelify
// Add babelify transform to your package.json
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
