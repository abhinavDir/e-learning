const fs = require('fs');
const createCourse = fs.readFileSync('./src/pages/CreateCourse.jsx', 'utf8');
const base = fs.readFileSync('./EditCourse.jsx.base', 'utf8');

const styleBlock = createCourse.substring(createCourse.indexOf('<style dangerouslySetInnerHTML'));
const finalCss = styleBlock.replace(/CreateCourse/g, 'EditCourse');

const complete = base + '\n      ' + finalCss;

fs.writeFileSync('./src/pages/EditCourse.jsx', complete);
