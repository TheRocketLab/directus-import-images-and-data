# directus-import-images-and-data
This repo allows bulk upload images and associate them with a collection in a single import. 

## Steps to run
1. Run `npm i` in terminal
2. Export your data to `data-sample.json` making sure the object looks like the existing
3. Copy the `.env.sample` file to `.env` and fill in using your Directus credentials
4. Check the `uploadJsonData.js` as you may need to adjust some values to suit your requirements
5. Run `node uploadJsonData.js` to run the import
