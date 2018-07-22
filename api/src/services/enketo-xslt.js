const { spawn } = require('child_process');

const FORM_XSLT = `${__dirname}/../../node_modules/enketo-xslt/xsl/openrosa2html5form.xsl`;
const MODEL_XSLT = `${__dirname}/../../node_modules/enketo-xslt/xsl/openrosa2xmlmodel.xsl`;

const process = (xsltPath, xml) => {
  return new Promise((resolve, reject) => {
    const xsltproc = spawn('xsltproc', ['--nonet', xsltPath, '-']);
    const errors = [];
    const output = [];

    xsltproc.stdin.write(xml);
    xsltproc.stdin.end();

    xsltproc.stdout.on('data', data => {
      output.push(data.toString('utf8'));
    });

    xsltproc.stderr.on('data', data => {
      errors.push(data.toString('utf8'));
    });

    xsltproc.on('close', code => {
      if (code === 0) {
        return resolve(output.join(''));
      }
      return reject(new Error(`xsltproc exited with error code "${code}"\n${errors.join('\n')}`));
    });

  });
};

const removeRoot = xml => {
  return xml
    .replace(/<root [^>]*>/, '')
    .replace(/<\/root>/, '')
};

module.exports = {
  transform: xform => {
    return Promise.all([
      process(FORM_XSLT, xform),
      process(MODEL_XSLT, xform),
    ])
    .then(([ form, model ]) => {
      return {
        form: form,
        model: removeRoot(model)
      }
    });
  }
};
