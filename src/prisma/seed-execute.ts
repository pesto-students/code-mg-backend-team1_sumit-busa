import logger from '@/config/logger'
import seed from './seed'

seed()
  .then(() => logger.info('Seed executed successfully'))
  .catch((ex) => logger.error('error executing seed: ' + ex))
