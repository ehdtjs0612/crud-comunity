require("dotenv").config();

const jwt = require("jsonwebtoken");
const { UnauthorizedException } = require("../module/customError");

module.exports = (req, res, next) => {
    // 쿠키에 담긴 토큰을 추출
    const { accessToken } = req.cookies;

    try {
        // 쿠키 이름이 잘못되었을때?(쿠키 이름을 조작한경우)
        if (!accessToken) {
            throw new Error("invalid token");
        }

        req.decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        return next();

    } catch (error) {
        if (error.message === "jwt expired" || error.message === "invalid token") {
            return next(new UnauthorizedException("로그인 후 이용가능합니다"));
        }
        next(error);
    }
};