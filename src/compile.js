const fs = require('fs');
const path = require('path');
const { registerTransforms } = require('@tokens-studio/sd-transforms');
const style_dictionary = require('style-dictionary');
let config = require('./config.json');

// Step 1: Compile our design tokens from their folders into a single JSON file

const base_combined_tokens = {};
const theme_combined_tokens = {};

// Get literal folder paths from config
config.base_folder = path.join(__dirname, config.base_folder);
config.theme_folder = path.join(__dirname, config.theme_folder);
config.output_JSON_path = path.join(__dirname, config.output_JSON_path);
config.sd_build_path = path.join(__dirname, config.sd_build_path);

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

// Run the base folder through the processor and save the result to distribution folder
processFolder(config.base_folder, base_combined_tokens);
const base_combined_tokens_JSON = JSON.stringify(base_combined_tokens, null, 2);
fs.writeFileSync(config.output_JSON_path + config.base_JSON_filename, base_combined_tokens_JSON);

console.log('Base design tokens combined and saved to:' + config.output_JSON_path + config.base_JSON_filename);

// Run the theme folder through the processor and save the result to distribution folder
processFolder(config.theme_folder, theme_combined_tokens);

const theme_combined_tokens_JSON = JSON.stringify(theme_combined_tokens, null, 2);
fs.writeFileSync(config.output_JSON_path + config.theme_JSON_filename, theme_combined_tokens_JSON);

console.log('Theme design tokens combined and saved to:' + config.output_JSON_path + config.theme_JSON_filename);


// Step 2: Take our compiled JSON file and convert it to CSS and JS variables

// Register the Token Studio transform with Style Dictionary
registerTransforms(style_dictionary);

// Add a custom transform to insure that math calculations are wrapped within "calc()" when output to CSS variables
style_dictionary.registerTransform({
  type: `value`,
  transitive: true,
  name: `figma/calc`,
  matcher: ({ value }) => typeof value === 'string' && value?.includes('*'),
  transformer: ({ value }) => `calc(${value})`,
});

const sd = style_dictionary.extend({
  source: [config.output_JSON_path + config.base_JSON_filename],
  platforms: {
      css: {
          transforms: [
              'ts/opacity',
              'ts/size/lineheight',
              'ts/typography/fontWeight',
              'ts/size/css/letterspacing',
              'ts/typography/css/fontFamily',
              'ts/typography/css/shorthand',
              'ts/border/css/shorthand',
              'ts/shadow/css/shorthand',
              'ts/color/css/hexrgba',
              'ts/color/modifiers',
              'name/cti/kebab',
              'figma/calc'
          ],
          prefix: config.css_var_prefix,
          buildPath: config.sd_build_path + 'css/',
          files: [
              {
                  destination: config.sd_base_filename + '.css',
                  format: 'css/variables',
              },
          ],
          options: {
            "outputReferences": true,

          }
      },
  },
});

sd.cleanAllPlatforms();
sd.buildAllPlatforms();

console.log('Base design tokens converted to CSS variables and saved to:' + config.sd_build_path + 'css/variables.css');
console.log('Base design tokens converted to JS variables and saved to:' + config.sd_build_path + 'js/variables.js');

const sd_theme = style_dictionary.extend({
  include: [config.output_JSON_path + config.base_JSON_filename],
  source: [config.output_JSON_path + config.theme_JSON_filename],
  platforms: {
      css: {
          transforms: [
              'ts/opacity',
              'ts/size/lineheight',
              'ts/typography/fontWeight',
              'ts/size/css/letterspacing',
              'ts/typography/css/fontFamily',
              'ts/typography/css/shorthand',
              'ts/border/css/shorthand',
              'ts/shadow/css/shorthand',
              'ts/color/css/hexrgba',
              'ts/color/modifiers',
              'name/cti/kebab',
              'figma/calc'
          ],
          prefix: config.css_var_prefix,
          buildPath: config.sd_build_path + 'css/',
          files: [
              {
                  destination: config.sd_theme_filename + '.css',
                  format: 'css/variables',
              },
          ],
          options: {
            "outputReferences": true,
            transitive: true
          }
      },
  },
});

sd_theme.cleanAllPlatforms();
sd_theme.buildAllPlatforms();