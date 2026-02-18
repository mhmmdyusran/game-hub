import { ObjectId } from "mongodb";
import { getDb } from "../mongo";

export interface IUser {
  _id?: ObjectId;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

export const User = {
  collection: () => getDb().collection<IUser>("users"),

  async create(user: Omit<IUser, "_id" | "createdAt">): Promise<IUser> {
    const newUser: IUser = {
      ...user,
      createdAt: new Date(),
    };
    const result = await User.collection().insertOne(newUser);
    newUser._id = result.insertedId;
    return newUser;
  },

  async findByUsername(username: string): Promise<IUser | null> {
    return User.collection().findOne({ username });
  },

  async findById(id: string): Promise<IUser | null> {
    if (!ObjectId.isValid(id)) return null;
    return User.collection().findOne({ _id: new ObjectId(id) });
  },
};
