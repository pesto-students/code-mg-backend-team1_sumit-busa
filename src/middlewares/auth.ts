import { Role } from '@prisma/client'

// middleware for doing role-based permissions
export default function verifyRole(permittedRoles: Role[]) {
  
    return (request, response, next) => {
      const { user } = request
  
      if (user && (permittedRoles.includes(user.role)==true)) {
        next(); 
      } else {
        response.status(403).json({message: "Forbidden"});
      }
    }
  }