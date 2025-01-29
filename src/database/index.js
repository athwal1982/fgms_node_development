import {Sequelize} from 'sequelize';
import mysql from 'mysql2';

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOSTNAME,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        dialectOptions: {
            requestTimeout: 3000
          },
          pool: {
            max: 10,
            min: 0,
            idle: 10000
          }
    })

// export const pool = mysql.createPool({
//     host: process.env.DB_HOSTNAME,
//     user: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 60,
//     queueLimit: 1500,
//     multipleStatements: true,
//     dateStrings: true
// })

// export const queryInterface = sequelize.getQueryInterface()
