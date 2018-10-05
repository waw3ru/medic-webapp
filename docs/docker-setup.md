# How to run the webapp using docker #

The docker setup makes it easy for you to get started

## Requirements ##

1. node.js version 8.+
2. docker and docker-compose
3. python 2.7.+

## How to setup ##

1.  Create a couchdb docker image environment variables on `./environments/.couch` using the command `cat ./environments/couch.txt >> ./environments/.couch`

    - the file contents of `.couch` are:
        ```env
            COUCHDB_USER= # can be admin
            COUCHDB_PASSWORD= # choose a strong password if your running in production
            NODENAME= # to be on safe side put it as couchdb-image
        ```

2.  Create a medic webapp docker image environment variables on `./environments/.medic` using the command `cat ./environments/medic.txt >> ./environments/.medic`

    - the file contents of `.medic` are:
        ```env
            COUCH_URL= # url to accessing couchdb it should look like http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@couchdb-image:5984/medic/
            COUCH_NODE_NAME= # nodename to be used by medic webapp couchdb@${NODENAME}
            NODE_ENV= # production if you want to run in production or development if you want to run in development
            ENV= # production if you want to run in production or development if you want to run in development
        ```

3.  from the medic documentation on `README.md`

    - Create a medic webapp _(host version)_ environment variables on `.env` using the command `cat env.txt >> .env`
    - file contents of `.env` are:
     ```env
        COUCH_URL= # url to accessing couchdb it should look like http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@localhost:5985/medic
        COUCH_NODE_NAME= # nodename to be used by medic webapp couchdb@${NODENAME}
        NODE_ENV= # production if you want to run in production or development if you want to run in development
        ENV= # production if you want to run in production or development if you want to run in development
     ```

4.  after you are done with creating the required environments you will run the `./docker-setup.sh`
    ```bash
        $ ./docker-setup.sh {COUCH_USER} {COUCH_PASSWORD} {NODENAME} {ENV}
    ```
    Take the contents on `./environments/.couch`. For each replace the variables in the code snippet above. As for `ENV` it can be either `development` or `production` based on what is available as `ENV` and `NODE_ENV` in `./environments/.medic`.


## Example ##

Following the above process:

`./environments/.couch` might have:

```env
    COUCHDB_USER=admin
    COUCHDB_PASSWORD=pass-1234 # choose a strong password if your running in production
    NODENAME=couchdb@couchdb-image
```

`./environments/.medic` might have:

```env
    COUCH_URL=http://admin:pass-1234@couchdb-image:5984/medic
    COUCH_NODE_NAME=couchdb@couchdb-image
    NODE_ENV=development
    ENV=development
```

`.env` might have:

```env
    COUCH_URL=http://admin:pass-1234@localhost:5985/medic
    COUCH_NODE_NAME=couchdb@couchdb-image
    NODE_ENV=development
    ENV=development
```

now if you want to run `./docker-setup.sh`, you will run the following:
`$ ./docker-setup.sh admin pass-1234 couchdb-image development`

Go to `http://localhost:5989/` to access the webapp. Use your `${COUCHDB_USER}` as username `${COUCHDB_PASSWORD}`
