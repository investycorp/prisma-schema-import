const SCHEMA_SCRIPT = `const fs = require('fs');\n\nconst loadSchema = function () {\n\tconst schema = fs.readFileSync(\`${__dirname}/schema.prisma\`, 'utf-8');\n\n\treturn schema;\n};\n\nmodule.exports = loadSchema;\n`;

export { SCHEMA_SCRIPT };
