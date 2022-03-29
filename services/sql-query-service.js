const new_client = require('../models/SQL').client

const query = (config, query) => {

    console.log(config, query)

    return new Promise((resolve, reject) => {
        
        sql_client = new_client(config)

        sql_client.query(query, (error, results) => {
            if (error) {
              throw error
            }
            resolve (results)
          })
    })

  }


  module.exports = {
    query
  }