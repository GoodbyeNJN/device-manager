import dayjs from "dayjs";
import { jwtVerify, SignJWT } from "jose";

const alg = "HS256";

const secret = new TextEncoder().encode(
    import.meta.env.PROD
        ? process.env.JWT_SECRET
        : "cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2",
);

export type VerifyResult = { isValid: false } | { isValid: true; id: string };

export const sign = async (id: string, maxAge = "2h") => {
    const jwt = await new SignJWT({ user_id: id })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer("urn:fuckwall:issuer")
        .setAudience("urn:fuckwall:audience")
        .setExpirationTime(maxAge)
        .sign(secret);

    return jwt;
};

export const verify = async (jwt: string): Promise<VerifyResult> => {
    try {
        const { payload } = await jwtVerify(jwt, secret, {
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
