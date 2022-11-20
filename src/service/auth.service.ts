import { JWT_SECRET } from '@/config/config'
import logger from '@/config/logger'
import prisma from '@/prisma/prisma'
import ApiError from '@/utils/ApiError'
import { Role, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import { JWTPayload, LoggedInUserType } from '@/config/passport'

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 10)
  return hashedPassword
}

//Registers a user from data received by email and sets userrole as Employee by default.
export const register = async (data: User, userRole: Role): Promise<User> => {
  const { email, fullName, mobile, password } = data

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const hashedPassword = await hashPassword(password!)

  prisma.user.findFirst({ where: {} })

  const createdUser = await prisma.user.create({
    data: {
      email,
      fullName,
      role: userRole,
      mobile,
      password: hashedPassword,
    },
  })
  return createdUser
}

type loginPayload = { email: string; password: string }
type resPayload = Promise<{ token: string }>
export const login = async (data: loginPayload): resPayload => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: data.email },
    select: { password: true, email: true, fullName: true, id: true, role: true },
  })

  if (!user || !user.password) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email or password')

  const isValid = await bcrypt.compare(data.password, user.password)
  let token = ''
  if (isValid) {
    const jwtPayload: Omit<JWTPayload, 'exp' | 'iat'> = {
      id: user.id,
      email: user.email,
      fullName: user.fullName || '',
      role: user.role,
    }
    token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: '1d' })
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email or password')
  }

  logger.info('Login Successful')

  return { token }
}

export const resetPassword = async (loggedInUser: LoggedInUserType, newPassword: string) => {
  if (newPassword == null || newPassword.length < 8) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password length should be greater than 8.')
  }

  const newHashedPassword = await hashPassword(newPassword)
  await prisma.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      password: newHashedPassword,
    },
  })
}

// export const forgotPassword= async(email:string)=>{
//   const user = await prisma.user.findFirst({
//     where: { email: email },
//     select: { password: true, email: true, fullName: true,  id: true },
//   })

//   if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist')
//   const token = jwt.sign({ id: user.id, email: user.email ,fullName:user.fullName}, JWT_SECRET, { expiresIn: '1day' })
//   const link = `${process.env.FrontendBaseUrl}/forgot-password?token=${token}`
//   if (IS_TEST_EMAIL)
//   {
//     email= TEST_EMAIL
//   }

//   const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//           user:USER,
//           pass:PASSWORD
//       }
//     })

//     const mailOptions = {
//       from:USER,
//       to:email,
//       subject: 'Reset Password',
//       html:'<p><a href='+link+'>Click Me To Reset Password!!!</a></p>'
//     }

//     transporter.sendMail(mailOptions, function(err, data){
//       if (err){
//           console.log('error occured',err)
//       } else{
//           console.log('email sent');
//       }
//     })
// }
