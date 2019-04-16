# Fight For Subs Extension 
Extension created to display the FFS ranking during the streams.

Use VueJs

## Done
- Extension matching the Twitch requirements
- Getting data from FFS server

## Doing
- Ranking pages
- Little design to visualize the first data [preview](https://i.imgur.com/CuXGkbu.png)
- Panel view

## TODO
- Design
- Mobile view

## Prepare to dev
See [the Twitch extension getting started](https://dev.twitch.tv/docs/extensions/)

## Dependencies

You will need:
 * [docker](https://docs.docker.com/engine/installation/)
 * [docker-compose](https://docs.docker.com/compose/install/)

## Generate self-signed certs
```bash
cd certs
./generate_local_ssl.sh
    # Requires a sudo password so that the cert can be installed on the root keychain
    # If this install fails, see the README in ./certs for manual override.
```

## To add a new page to your frontend.
```bash
npm run generator
```

## To start the Extensions Boilerplate service
```bash
docker-compose up --build
```

## To build your extension

[env] is the targeted environment. Default is `production`
```bash
npm run build
npm run build [env]
npm run build production
```

# Generated Files
You can find generated files on the dist/ folder.

Compress these files as a .zip file and upload it to your Twitch extension.

## Credit
Based on [Breci's VueJS Extension Boilerplate](https://github.com/Breci/Twitch_extension_Vue_Express_Boilerplate)
