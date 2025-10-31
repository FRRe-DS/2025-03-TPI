import { User } from "../entities/user.entity";

export default abstract class UserRepository{
    abstract findOne(idu: number):Promise<User|null>;
    abstract create(idu:Partial<User>):User;
    abstract save(user:User):Promise<User>
}