const new_client = require('../models/SQL').client


var parseError = async function(err, sqlString) {
  console.log("nparseError:", sqlString);

  let errorCodes = {
    "08003": "connection does not exist",
    "08006": "connection failure",
    "2F002": "modifying sql data not permitted",
    "57P03": "cannot connect now",
    "42601": "syntax error",
    "42501": "insufficient privilege",
    "42602": "invalid name",
    "42622": "name too long",
    "42939": "reserved name",
    "42703": "undefined column",
    "42000": "syntax error or access rule violation",
    "42P01": "undefined table",
    "42P02": "undefined parameter",
    '57014': "timeout"
  };

  if (err === undefined) {
    return ("No errors returned from Postgres");
  } else {
    // console.log("ERROR Object.keys():", Object.keys(err))

    if (err.code !== undefined) {
      console.log("Postgres error code:", err.code);
      console.log("Postgres error", err);
      if (errorCodes[err.code] !== undefined) return (errorCodes[err.code]);
      if (err.message !== undefined) return (err.message);   
    }

    console.log("severity:", err.severity);

    if (err.position !== undefined) {
      console.log("PostgreSQL error position:", err.position);

      // get the end of the error pos
      let end = err.position + 7;
      if (err.position + 7 >= sqlString.length) {
        end = sqlString.length;
      }

      // get the start position for SQL error
      let start = err.position - 2;
      if (err.osition - 2 <= 1) {
        start = 0;
      }

      // log the partial SQL statement around error position
      return ("---> " + sqlString.substring(start, end) + " <---");
    }

    if (err.code === undefined && err.position === undefined) {
      return ("Unknown Postgres error:", err);
    }

  }

}

const query = (config, sqlString) => {

  // console.log(config, sqlString)

  return new Promise((resolve, reject) => {
      
      sql_client = new_client(config)

      sql_client.query(sqlString, (error, results) => {
          if (error) {
            var error_msg = parseError(error, sqlString)
            sql_client.end()
            reject (error_msg) 
          }
          sql_client.end()
          resolve (results)
      })
  })

}


  module.exports = {
    query
  }