import { UserEntity } from "src/users/entities/user.entity";

export class DataToResponse {
    
    userData(user: UserEntity) {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        }
    }
}
