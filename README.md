# Evala

A web app that shows the time, the weather and brings your terminal in the browser.

![Evala](./src/static-files/img/screenshot_1280x800.png)
![Evala](./src/static-files/img/screenshot_1280x800_2.png)

It is available as:

* [Chrome extension](https://chrome.google.com/webstore/detail/evala/bmaojegjknddmkhfbkhfijcblmamgino)
* [Firefox extension](https://addons.mozilla.org/en-US/firefox/addon/evala/)
* Web page at http://0.0.0.0:9788 (or http://127.0.0.1:9788)

## How to use it

### Install and run Evala server

The Evala server acts as a bridge between the browser and the actual terminal. Without it you'll only see the clock and the weather.

```
> npm install evala -g
> evala --shell=$SHELL
```

Make sure that you pass the `--shell` argument or Evala will use the default `bash` (or `cmd.exe` under Windows) shell.

You may register Evala server as a service so you get it running when you reboot your machine. What I did is registering an alias that allows me to run it quickly as a background process.

```
# Run Evala server with the default shell
# Save the output to a log file
# Run `evala` in a background
alias run-evala="evala --shell=$SHELL > ~/log/evala &"
```

### To see the app:

* Install this [Chrome](https://chrome.google.com/webstore/detail/evala/bmaojegjknddmkhfbkhfijcblmamgino) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/evala/) browser extension and open a new tab.
* Open [http://0.0.0.0:9788](http://0.0.0.0:9788) (or [http://127.0.0.1:9788](http://127.0.0.1:9788)).