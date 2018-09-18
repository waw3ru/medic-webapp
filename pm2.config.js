const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    apps: [
        {
            name: 'mm:api',
            script: './api/server.js',
            env: {
                NODE_ENV: process.env.NODE_ENV,
                UNIT_TEST_ENV: '',
                COUCH_URL: process.env.COUCH_URL,
                COUCH_NODE_NAME: process.env.COUCH_NODE_NAME
            },
            watch: false,
            exec_interpreter: 'node',
            wait_ready: true,
            max_restarts: 4,
            restart_delay: 6000,
            kill_timeout : 7000,
            source_map_support: true,
            error_file: './api/logs/err.log',
            out_file: './api/logs/out.log',
            merge_logs: true,
            log_date_format : 'DD-MM-YYYY HH:mm Z'
        },
        {
            name: 'mm:sentinel',
            script: './sentinel/server.js',
            env: {
                NODE_ENV: process.env.NODE_ENV,
                UNIT_TEST_ENV: '',
                COUCH_URL: process.env.COUCH_URL,
                COUCH_NODE_NAME: process.env.COUCH_NODE_NAME
            },
            watch: false,
            exec_interpreter: 'node',
            wait_ready: true,
            max_restarts: 4,
            restart_delay: 6000,
            kill_timeout : 7000,
            source_map_support: true,
            error_file: './sentinel/logs/err.log',
            out_file: './sentinel/logs/out.log',
            merge_logs: true,
            log_date_format : 'DD-MM-YYYY HH:mm Z'
        }
    ]
}