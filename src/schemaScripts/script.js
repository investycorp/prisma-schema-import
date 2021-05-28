const path = require('path');
const fs = require('fs');

function loadSchema() {
  let schema = fs.readFileSync(`${__dirname}/schema.prisma`, 'utf-8');

  if (schema.includes('@import')) {
    const importSyntaxes = schema.match(/@import(.+)/g);

    importSyntaxes.forEach((importSyntax) => {
      const schemaPathname = importSyntax.match(/'.+'/g)[0].replace(/'/gi, '');
      const schemaPath = path.resolve(__dirname, schemaPathname);
      const importedSchema = fs.readFileSync(schemaPath, 'utf-8');

      schema = schema.replace(importSyntax, importedSchema);
    });
  }

  return schema;
}

module.exports = loadSchema;
