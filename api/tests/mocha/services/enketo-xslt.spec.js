const fs = require('fs'),
      sinon = require('sinon'),
      chai = require('chai'),
      service = require('../../../src/services/enketo-xslt');

const BASE_DATA_DIR = `${__dirname}/../../xforms`;
const INPUT_DATA_DIR = `${BASE_DATA_DIR}/input`;
const EXPECTED_DATA_DIR = `${BASE_DATA_DIR}/output`;

describe.only('enketo-xslt service', () => {

  afterEach(() => {
    sinon.restore();
  });

  const read = filename => fs.readFileSync(filename).toString('utf8');

  const readFiles = filename => {
    const formFileName = filename.replace(/\.xml$/, '.html.xml');
    const modelFileName = filename.replace(/\.xml$/, '.model.xml');
    return {
      xform: read(`${INPUT_DATA_DIR}/${filename}`),
      expected: {
        form: read(`${EXPECTED_DATA_DIR}/${formFileName}`),
        model: read(`${EXPECTED_DATA_DIR}/${modelFileName}`)
      }
    };    
  };

  const stripWhitespace = xml => {
    return xml.trim().replace(/>\s*</g, '>\n<');
  };

  // const files = fs.readdirSync(INPUT_DATA_DIR);
  const files = ['assessment.xml'];

  files.forEach(file => {
    it(`transform ${file}`, () => {
      const files = readFiles(file);
      return service.transform(files.xform).then(({ form, model }) => {
        console.log(form);
        // console.log(model);
        // chai.expect(form).to.equal(files.expected.form);
        chai.expect(stripWhitespace(form)).to.equal(stripWhitespace(files.expected.form));
        // chai.expect(stripWhitespace(model)).to.equal(stripWhitespace(files.expected.model));
      })
    });
  });
});
