# Directus import images and map them to collection items
This repo assumes two things: 
1. that you are trying to bulk import data to Directus that includes an image associated with a collection item. 
2. You have formatted your JSON file to match the collection you are trying to import to in Directus.

## Steps to run
1. Run `npm i` or `yarn` in terminal
2. Export your data to `./data/data-sample.json` making sure the object looks like the existing
3. Copy the `.env.sample` file to `.env` and fill in using your Directus credentials
4. Run `node index` to run the import
