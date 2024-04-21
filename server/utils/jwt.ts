import dayjs from "dayjs";
import { jwtVerify, SignJWT } from "jose";

import { JWT_SECRET } from "../constants";

const alg = "HS256";

export type VerifyResult = { isValid: false } | { isValid: true; id: string };

const generateKey = () => {
    if (!JWT_SECRET) {
        throw new Error(
            "JWT_SECRET is not set. Please set it in .env file or environment variables.",
        );
    }

    const key = new TextEncoder().encode(JWT_SECRET);

    return key;
};

export const sign = async (id: string, maxAge = "2h") => {
    const jwt = await new SignJWT({ user_id: id })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer("urn:fuckwall:issuer")
        .setAudience("urn:fuckwall:audience")
        .setExpirationTime(maxAge)
        .sign(generateKey());

    return jwt;
};

export const verify = async (jwt: string): Promise<VerifyResult> => {
    try {
        const { payload } = await jwtVerify(jwt, generateKey(), {
            issuer: "urn:fuckwall:issuer",
            audience: "urn:fuckwall:audience",
        });

        const now = dayjs();
        const expire = dayjs(payload.exp! * 1000);
        if (now.isAfter(expire)) {
            return { isValid: false };
        }

        return { isValid: true, id: payload.user_id as string };
    } catch (error) {
        return { isValid: false };
    }
};
