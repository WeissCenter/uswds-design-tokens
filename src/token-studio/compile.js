const fs = require('fs');
const path = require('path');
const { registerTransforms } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');


// Step 1: Compile our design tokens from their folders into a single JSON file

const base_folder = path.join(__dirname, 'tokens/uswds-base');
const theme_folder = path.join(__dirname, 'tokens/uswds-theme');
const base_output_JSON_path = path.join(__dirname, '../../dist/json/uswds-base.json');
const theme_output_JSON_path = path.join(__dirname, '../../dist/json/uswds-theme.json');

const base_combine_tokens = {};

function processFolder(folder_path, target) {
  fs.readdirSync(folder_path).forEach(file => {
    // Run through the folder looking for files and sub-folders
    const file_path = path.join(folder_path, file);
    const stat = fs.statSync(file_path);

    if (stat.isDirectory()) {
      // If we find a sub-folder, process it as well after setting the key reference to be the folder name
      // IE: 'colors/' becomes 'colors' on the parent JSON object, and we recurse into the folder
      target[file] = {};
      processFolder(file_path, target[file]);
    } else if (file.endsWith('.js')) {
      // If we find a js file, require it and set the key reference to be the file name
      // IE: 'spacing-units.js' becomes 'spacing-units' on the parent JSON object
      const tokens = require(file_path);
      const key_name = path.parse(file).name;
      target[key_name] = tokens;
    }
  });
}

// Run the base folder through the processor and save the result to ditribution folder
processFolder(base_folder, base_combine_tokens);

const base_combine_tokens_JSON = JSON.stringify(base_combine_tokens, null, 2);
fs.writeFileSync(base_output_JSON_path, base_combine_tokens_JSON);

console.log('Base design tokens combined and saved to:' + base_output_JSON_path);


// Step 2: Take our compiled JSON file and convert it to CSS and JS variables

// Register the Token Studio transform with Style Dictionary
registerTransforms(StyleDictionary);

const sd_build_path = '../../dist/';

const sd = StyleDictionary.extend({
  source: [base_output_JSON_path],
  platforms: {
      js: {
          transformGroup: 'tokens-studio',
          buildPath: sd_build_path + 'js/',
          files: [
              {
                  destination: 'variables.js',
                  format: 'javascript/es6',
              },
          ],
      },
      css: {
          transforms: [
              'ts/opacity',
              'ts/size/lineheight',
              'ts/typography/fontWeight',
              'ts/resolveMath',
              'ts/size/css/letterspacing',
              'ts/typography/css/fontFamily',
              'ts/typography/css/shorthand',
              'ts/border/css/shorthand',
              'ts/shadow/css/shorthand',
              'ts/color/css/hexrgba',
              'ts/color/modifiers',
              'name/cti/kebab',
          ],
          buildPath: sd_build_path + 'css/',
          files: [
              {
                  destination: 'variables.css',
                  format: 'css/variables',
              },
          ],
      },
  },
});

sd.cleanAllPlatforms();
sd.buildAllPlatforms();

console.log('Base design tokens converted to CSS variables and saved to:' + sd_build_path + 'css/variables.css');
console.log('Base design tokens converted to JS variables and saved to:' + sd_build_path + 'js/variables.js');

