const fs = require('fs');
const path = require('path');
const { registerTransforms } = require('@tokens-studio/sd-transforms');
const style_dictionary = require('style-dictionary');
let config = require('./config.json');

// The processFolder() function recursively processes a folder and its sub-folders, looking for .js files to convert into JSON
// The JSON files are combined into a single JSON object, with the key references being driven by the folder and file names

// Important: The folder structure is intentional and should be followed for creating themes, as it will drive the final naming structure of the CSS variables -> which need to be 100% consistent with the naming structure our modified version of USWDS expects

// Example:
// color/
//   blue.js
//   red.js
//   green.js
// box-shadow.js
// spacing.js

// Will result in a JSON object that looks more or less like this:
// {
//   "color": {
//     "blue": {
//       "value": "#0000FF",
//       "type": "color",
//       "description": "Blue color"
//     },
//     "red": {
//       "value": "#FF0000",
//       "type": "color",
//       "description": "Red color"
//     },
//     "green": {
//       "value": "#00FF00",
//       "type": "color",
//       "description": "Green color"
//     }
//   },
//   "box-shadow": {
//     "value": "0 0 0 1px rgba(0,0,0,0.05)",
//     "type": "box-shadow",
//     "description": "Box shadow"
//   },
//   "spacing": {
//     "value": "1rem",
//     "type": "sizing",
//     "description": "Spacing"
//   }
// }

function processFolder(folder_path, target) {
  // Read the folder contents from 'folder_path' and process each file and sub-folder
  // 'target' is the JSON object we're building, and can be passed in blank or with existing data to be added to
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
      // IE: 'spacing.js' becomes 'spacing' on the parent JSON object
      const tokens = require(file_path);
      const key_name = path.parse(file).name;
      target[key_name] = tokens;
    }
  });
}


const base_combined_tokens = {};
const theme_collection = [];

// Get literal folder paths from config
config.base_folder = path.join(__dirname, config.base_folder);
config.theme_folder = path.join(__dirname, config.theme_folder);
config.output_JSON_path = path.join(__dirname, config.output_JSON_path);
config.output_CSS_path = path.join(__dirname, config.output_CSS_path);

// Run the base folder through the processor and save the result to the distribution folder
processFolder(config.base_folder, base_combined_tokens);
const base_combined_tokens_JSON = JSON.stringify(base_combined_tokens, null, 2);
fs.writeFileSync(config.output_JSON_path + config.base_filename + '.json', base_combined_tokens_JSON);

console.log('Base design tokens combined and saved to:' + config.output_JSON_path + config.base_filename + '.json');

// Base JSON tokens are done!


// Theme JSON tokens are next and are processed similarly, but abstracted a step back to loop through the theme folder from the config file and then run the processFolder() function on each sub-folder found. This is down outside of the processFolder() function to allow for proper naming of the theme JSON variables wihtout prefixing the theme name to the beginning of them

// Example
// uswds-theme/
//   light/
//     color/
//     etc...
//   dark/
//     color/
//     etc...

// Will result in individual JSON objects and files that look more or less like this:
// uswds-theme-light.json
// {
//   "color": {
//     "ink": {
//       "value": "{color.black}",
//       "type": "color",
//       "description": "Base color for foreground text"
//     },
// }
// uswds-theme-dark.json
// {
//   "color": {
//     "ink": {
//       "value": "{color.white}",
//       "type": "color",
//       "description": "Base color for foreground text"
//     },
// }

fs.readdirSync(config.theme_folder).sort((a, b) => b.localeCompare(a)).forEach(folder => {
  const new_obj = {};
  const folder_path = path.join(config.theme_folder, folder);
  const is_folder = fs.statSync(folder_path);
  if (is_folder) {
    processFolder(folder_path, new_obj);
    theme_collection.push({
      name: folder,
      tokens: new_obj
    });
  } else return
});

// Generate JSON files for each theme
theme_collection.forEach(theme => {
  const theme_tokens_JSON = JSON.stringify(theme.tokens, null, 2);
  const path = config.output_JSON_path + config.theme_fileprefix + '-' + theme.name + '.json';
  fs.writeFileSync(path, theme_tokens_JSON);
  console.log(theme.name + ' design tokens combined and saved to:' + path);
})

// To better integrate with Token Studio in Figma, we will combine the base and theme JSON files into a single JSON object with the base variable collection and each theme collection as a sub-objects

// Example:
// uswds-full.json
// {
//   "base": {
//     "color": {
//       "black": {
//         "value": "#000",
//         "type": "color",
//         "description": "Black color"
//       },
//       "white": {
//         "value": "#fff",
//         "type": "color",
//         "description": "White color"
//       },
//     },
//   "light": {
//     "color": {
//       "ink": {
//         "value": "{color.black}",
//         "type": "color",
//         "description": "Base color for foreground text"
//       },
//     }
//   },
//   "dark": {
//     "color": {
//       "ink": {
//         "value": "{color.white}",
//         "type": "color",
//         "description":  "Base color for foreground text"
//       },
//     }
//   }
// }

let full_tokens = {
  base: base_combined_tokens
};
theme_collection.forEach(theme => {
  full_tokens[theme.name] = theme.tokens;
});

const full_tokens_JSON = JSON.stringify(full_tokens, null, 2);
fs.writeFileSync(config.output_JSON_path + config.full_filename + '.json', full_tokens_JSON);

console.log('Base and theme design tokens combined and saved to:' + config.output_JSON_path + config.full_filename + '.json');


// Step 2: Take our JSON files and convert them to CSS variables

// Register the Token Studio transform with Style Dictionary
registerTransforms(style_dictionary);

// Add a custom transform to insure that math calculations are wrapped within "calc()" when output to CSS variables
style_dictionary.registerTransform({
  type: `value`,
  transitive: true,
  name: `aem/calc`,
  matcher: ({ value }) => typeof value === 'string' && (value?.includes('*') || value?.includes('/') || value?.includes('+') || (value?.indexOf(' - ') > -1)),
  transformer: ({ value }) => `calc(${value})`,
});

// The JSON objects are then passed to Style Dictionary, which converts them into CSS variables

theme_collection.forEach(theme => {
  style_dictionary.extend({
    include: [config.output_JSON_path + config.base_filename + '.json'],
    source: [config.output_JSON_path + config.theme_fileprefix + '-' + theme.name + '.json'],
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
          'aem/calc'
        ],
        prefix: config.css_var_prefix,
        buildPath: config.output_CSS_path + '/',
        files: [
          {
            destination: config.theme_fileprefix + '-' + theme.name + '-variables.css',
            format: 'css/variables',
          },
        ],
        options: {
          "outputReferences": true
        }
      },
    },
  }).buildAllPlatforms()
});

console.log('Full design tokens converted to CSS variables and saved to:' + config.output_CSS_path + config.full_filename + '-variables.css');
