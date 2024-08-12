export const config = {
    mongodb_uri: "mongodb+srv://medimanage:medimanagepassword@medimanage.i4dogq5.mongodb.net/medimanage?retryWrites=true&w=majority&appName=MediManage",
    port: process.env.PORT || 3000,
    logLevel: 'info',
    jwtSecret: 'medimanage',
    mailer: {
        email: "medimanagehealthcare@gmail.com",
        fromAlias: "medimanagehealthcare@gmail.com - MediManageHealthCare",
        password: "urud hsix yalp rmwj",
        host:"smtp.gmail.com",
        port: 465,
        service: "Gmail",
        secure: true,
        tls: {
            rejectUnauthorized: false
        }
    }
};
