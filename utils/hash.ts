import { compare, hash } from "bcryptjs";

export const hashPassword = async (password: string) => hash(password, 10);

export const checkPassword = compare;
