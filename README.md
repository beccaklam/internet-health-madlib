# science.typeoutloud.org

For historical reasons, this repo is going to be used for science.typeoutloud.org, and we are not going to change the name, just delete it when it's done. Future typeoutloud.org projects are going to be in https://github.com/mozilla/www.typeoutloud.org

## For when something goes bad and we need to turn off input.

1. First if Scott is online, you can just ask him. If not, email emergency@mozillafoundation.org
2. For devs, switch the DISABLE_INPUT env to true. This redirects the main page to a page with some copy and no input.
3. Optional. Disable sheets so it's read only. Do this for each sheet. Do this only after step 1 and 2 are complete.
    1. Go to the sheet.
    2. In the top nav menu, click "Form". It's up there with "File", "Edit", "View", etc.
    3. Inside that menu, click "Edit Form".
    4. In the edit form, click "RESPONSES" next to "QUESTIONS".
    5. Toggle off "Accepting responses".

## Environment Variables

You can configure the following environment variables:

|Variable|About|
|--------|-----|
| PORT | Port for the app, defaults to 7000, feel free to change this to any 4 digit number.
| APPLICATION_URI | For local dev, this is just http://localhost:7000 unless you changed PORT, which if you did you should update the port here to match.
| DISABLE_INPUT | Set this to true if things go sidways. It'll switch the form to a static read only version of what's currently in the sheets.

## Setup

```
$> npm install
$> cp sample.env .env
```

## To run

```
$> npm start
```
