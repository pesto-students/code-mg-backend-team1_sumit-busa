export const ENVIRONMENT = process.env.APP_ENV || 'dev'
// import dotenv from 'dotenv'
// dotenv.config({ path: `.env.${ENVIRONMENT}` })
console.log(process.env.APP_ENV)

export const IS_PRODUCTION = ENVIRONMENT === 'production'
export const IS_TEST = ENVIRONMENT === 'test'
export const APP_PORT = Number(process.env.APP_PORT) || 8080
export const APP_PREFIX_PATH = process.env.APP_PREFIX_PATH || '/'
export const JWT_SECRET = process.env.JWT_SECRET || 'secreteKey'
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '1d'
export const DB_URI = (): string => process.env.DB_URI
export const COMPILER_API = process.env.COMPILER_API || ''