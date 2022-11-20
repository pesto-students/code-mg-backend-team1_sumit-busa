import { JWT_SECRET } from '../config/config'
// import { User } from '@/models/user.model'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as AnonymousStrategy } from 'passport-anonymous'
import prisma from '../prisma/prisma'
import { Prisma } from '@prisma/client'
import passport from 'passport'

export interface JWTPayload {
  id: number
  fullName: string
  email: string
  role: string
  iat: number
  exp: number
}

export const getUserInfo = async (id: number) => {
  return await prisma.user.findFirstOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
    },
  })
}

export type LoggedInUserType = Prisma.PromiseReturnType<typeof getUserInfo>

export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  async (payload: JWTPayload, done) => {
    try {
      const user = await getUserInfo(payload.id)
      if (!user) return done(null, false)
      done(null, user)
    } catch (e) {
      return done(e)
    }
  },
)

export const auth = () => {
  return passport.authenticate('jwt', { session: false, assignProperty: 'loggedInUser' })
}

export const anonymousStrategy = new AnonymousStrategy()
