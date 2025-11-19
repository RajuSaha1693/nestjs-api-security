
export default(()=>({
    port: parseInt(process.env.PORT || '3000', 10),
    env:process.env.NODE_ENV || 'development',
    jwt:{
        secret:process.env.JWT_SECRET || 'default_secret',
        expiresIn:process.env.JWT_EXPIRES_IN || '15m',
        refreshExpiresIn:process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    }
}))