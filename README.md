[![Actions](https://github.com/fluentc/i18next-fluentc-backend/workflows/node/badge.svg)](https://github.com/fluentc/i18next-fluentc-backend/actions?query=workflow%3Anode)
[![Travis](https://img.shields.io/travis/fluentc/i18next-fluentc-backend/master.svg?style=flat-square)](https://travis-ci.org/fluentc/i18next-fluentc-backend)
[![npm version](https://img.shields.io/npm/v/i18next-fluentc-backend.svg?style=flat-square)](https://www.npmjs.com/package/i18next-fluentc-backend)
[![David](https://img.shields.io/david/fluentc/i18next-fluentc-backend.svg?style=flat-square)](https://david-dm.org/fluentc/i18next-fluentc-backend)

This is an [i18next backend plugin](https://www.i18next.com/principles/plugins) to be used for [fluentc](http://fluentc.io) service. It will load resources from fluentc server using http fetch or xhr as fallback.

If you're not familiar with i18next and how i18next backend plugins works, please first have a look at the [i18next documentation](https://www.i18next.com/how-to/add-or-load-translations#load-using-a-backend-plugin).

It will allow you to save missing keys containing both **default value** and **context information** by calling:

```js
i18next.t(key, defaultValue, tDescription);
i18next.t(key, { defaultValue, tDescription });
```


# Troubleshooting

Make sure you set the `debug` option of i18next to `true`. This will maybe log more information in the developer console.

**SaveMissing is not working**

Did you wait 5-10 seconds before refreshing the fluentc UI? It may take a couple of seconds until the missing keys are sent and saved.

Per default only `localhost` is allowed to send missing keys ([or update missing keys](https://www.i18next.com/overview/configuration-options#missing-keys)) (to avoid using this feature accidentally [in production](https://docs.fluentc.io/guides-tips-and-tricks/going-production)). If you're not using `localhost` during development you will have to set the `allowedAddOrUpdateHosts: ['your.domain.tld']` for the [backend options](https://github.com/fluentc/i18next-fluentc-backend#backend-options).


**Loading translations not working**

Make sure the translations are published, either by having enabled auto publishing for your version or by [manually publishing](https://docs.fluentc.io/more/general-questions/how-to-manually-publish-a-specific-version) the version. Alternatively, you can publish via [CLI](https://github.com/fluentc/fluentc-cli#publish-version) or directly by consuming the [API](https://docs.fluentc.io/integration/api#publish-version).

In case you're using the private publish mode, make sure you're using the correct api key and are setting the `private` option to `true`.

```javascript
import i18next from "i18next";
import Fluentc from "i18next-fluentc-backend";

i18next.use(Fluentc).init({
  backend: {
    environmentId: "[ENVIRONMENTID]",
    referenceLng: "en"
  }
});
```


**On server side: process is not exiting**

In case you want to use i18next-fluentc-backend on server side for a short running process, you might want to set the `reloadInterval` option to `false`:

```javascript
{
  reloadInterval: false,
  environmentId: "[ENVIRONMENTID]",
  referenceLng: 'en',
}
```

# Getting started

Source can be loaded via [npm](https://www.npmjs.com/package/i18next-fluentc-backend), `yarn`, `bower` or [downloaded](https://cdn.rawgit.com/fluentc/i18next-fluentc-backend/master/i18nextFluentcBackend.min.js) from this repo.

```bash
# npm package
$ npm install i18next-fluentc-backend

# yarn
$ yarn add i18next-fluentc-backend

# bower
$ bower install i18next-fluentc-backend
```

Wiring up:

```js
import i18next from 'i18next';
import Fluentc from 'i18next-fluentc-backend';
// or
const i18next = require('i18next');
const Fluentc = require('i18next-fluentc-backend');

i18next.use(Fluentc).init(i18nextOptions);
```

for Deno:

```js
import i18next from 'https://deno.land/x/i18next/index.js'
import Backend from 'https://deno.land/x/i18next_fluentc_backend/index.js'

i18next.use(Backend).init(i18nextOptions);
```

- As with all modules you can either pass the constructor function (class) to the i18next.use or a concrete instance.
- If you don't use a module loader it will be added to `window.i18nextFluentcBackend`

## Backend Options

**IMPORTANT** make sure you do not add your apiKey in the production build to avoid misuse by strangers

```js
{
  // the id of your Fluentc environment
  environmentId: "[ENVIRONMENTID]",

  // add an api key if you want to send missing keys
  apiKey: '[APIKEY]',

  // the reference language of your project
  referenceLng: '[LNG]',

// optional event triggered on saved to backend
  onSaved: (lng, ns) => { ... },

  // can be used to reload resources in a specific interval (useful in server environments)
  reloadInterval: typeof window !== 'undefined' ? false : 60 * 60 * 1000,
}
```

To load translations only `environmentId` needs to be filled. To use the **saveMissing** feature of i18next additional to the environmentId both `apiKey` and `referenceLng` have to be set.

Options can be passed in:

**preferred** - by setting options.backend in i18next.init:

```js
import i18next from "i18next";
import Fluentc from "i18next-fluentc-backend";

i18next.use(Fluentc).init({
  backend: options
});
```

on construction:

```js
import Fluentc from "i18next-fluentc-backend";
const fluentc = new Fluentc(options);
```

via calling init:

```js
import Fluentc from "i18next-fluentc-backend";
const fluentc = new Fluentc();
fluentc.init(options);
```

## Additional API endpoints

### backend.getLanguages

Will return a list of all languages in your project including percentage of translations done per version.

```js
import Fluentc from "i18next-fluentc-backend";
const fluentc = new Fluentc(options);

fluentc.getLanguages((err, data) => {
  /*
  data is:

  {
    "en": {
      "name": "English",
      "nativeName": "English",
      "isReferenceLanguage": true,
      "translated": {
        "latest": 1
      }
    },
    "de": {
      "name": "German",
      "nativeName": "Deutsch",
      "isReferenceLanguage": false,
      "translated": {
        "latest": 0.9
      }
    }
  }
  */
});

// or
const data = await fluentc.getLanguages();

// or
i18next.services.backendConnector.backend.getLanguages(callback);

// or
const data = await i18next.services.backendConnector.backend.getLanguages();
```

### backend.getOptions

Will return an object containing useful informations for the i18next init options.

```js
import Fluentc from "i18next-fluentc-backend";
const fluentc = new Fluentc(options);

fluentc.getOptions((err, data) => {
  /*
  data is:

  {
    fallbackLng: 'en',
    referenceLng: 'en',
    supportedLngs: ['en', 'de'],
    load: 'languageOnly|all' // depending on your supportedLngs has locals having region like en-US
  }
  */
});

// or
const data = await fluentc.getOptions();

// or
i18next.services.backendConnector.backend.getOptions(callback);

// or
const data = await i18next.services.backendConnector.backend.getOptions();
```

You can set a threshold for languages to be added to supportedLngs by setting translatedPercentageThreshold in backend options (eg: 1 = 100% translated, 0.9 = 90% translated).

## SPECIAL - let the backend determine some options to improve loading

You can load some information from the backend to eg. set supportedLngs for i18next just supporting languages you got in your fluentc environment.

You will get i18next options for (same as above backend.getOptions):

- fallbackLng
- supportedLngs
- load

```js
import i18next from "i18next";
import Fluentc from "i18next-fluentc-backend";

const fluentc = new Fluentc(
  {
    environmentId: "[environmentId]",
    apiKey: "[APIKEY]",
    // referenceLng -> not needed as will be loaded from API
  },
  (err, opts, lngs) => {
    i18next.use(fluentc).init({ ...opts, ...yourOptions }); // yourOptions should not include backendOptions!
  }
);
```

### Special usage with react-i18next without using Suspense

Use `setI18n` to pass in the i18next instance before initializing:

```js
import i18n from "i18next";
import { initReactI18next, setI18n } from "react-i18next";
import FluentcBackend from "i18next-fluentc-backend";

const backendOptions = {
  environmentId: "1d0aa5aa-4660-4154-b6d9-907dbef10bb3"
};

const yourOptions = {
  debug: true,
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
};

// this is only used if not using suspense
i18n.options.react = yourOptions.react;
setI18n(i18n);

const backend = new FluentcBackend(backendOptions, (err, opts) => {
  if (err) return console.error(err);
  i18n
    .use(backend)
    // .use(initReactI18next) // keep this if using suspense
    // yourOptions should not include backendOptions!
    .init({ ...opts, ...yourOptions }, (err, t) => {
      if (err) return console.error(err);
    });
});

export default i18n;
```

## TypeScript

To properly type the backend options, you can import the `FluentcBackendOptions` interface and use it as a generic type parameter to the i18next's `init` method, e.g.:

```ts
import i18n from 'i18next'
import FluentcBackend, { FluentcBackendOptions } from 'i18next-fluentc-backend'

i18n
  .use(FluentcBackend)
  .init<FluentcBackendOptions>({
    backend: {
      // fluentc backend options
    },

    // other i18next options
  })
```