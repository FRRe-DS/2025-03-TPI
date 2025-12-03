import { UserDomain } from "../domain/user";

export default abstract class UserRepository{
    abstract findOne(idu: number):Promise<UserDomain|null>;
    abstract create(idu:number):UserDomain;
    abstract save(user:UserDomain):Promise<UserDomain>;
    abstract count():Promise<number>;
    abstract findAll(): Promise<UserDomain[]>;
}