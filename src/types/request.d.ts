import { LoggedInUserType } from '@/config/passport'

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends LoggedInUserType {}
  }
}
