"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const swagger_1 = require("@nestjs/swagger");
const serverless_express_1 = require("@vendia/serverless-express");
let server;
async function createApp() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = [
        'http://localhost:3000',
        'https://nuevotrain-frontend.vercel.app',
        'https://nuevotrain-frontend-3mqnln0cx-jorge-castros-projects-839066ef.vercel.app',
        'https://nuevotrain-frontend-2xexop7sa-jorge-castros-projects-839066ef.vercel.app',
        'https://nuevotrain-frontend-ajxnvxr2u-jorge-castros-projects-839066ef.vercel.app',
        ...(process.env.FRONT_ORIGIN?.split(',').map((url) => url.trim()) || []),
        ...(process.env.FRONT_ORIGIN?.split(',')
            .map((url) => url.trim())
            .filter((url) => url.includes('nuevotrain-frontend')) || []),
    ];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (origin.includes('localhost'))
                return callback(null, true);
            if (origin.includes('nuevotrain-frontend') &&
                origin.includes('vercel.app')) {
                return callback(null, true);
            }
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            callback(new Error('No permitido por CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    });
    app.use(cookieParser());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('NuevoTrain API')
        .setDescription('API del sistema de gestión de gimnasio')
        .setVersion('1.0')
        .addBearerAuth()
        .addCookieAuth('refresh_token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    return app;
}
async function bootstrapLambda() {
    const app = await createApp();
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    return (0, serverless_express_1.default)({ app: expressApp });
}
const handler = async (event, context, callback) => {
    if (!server) {
        server = await bootstrapLambda();
    }
    return server(event, context, callback);
};
exports.handler = handler;
async function bootstrapLocal() {
    const app = await createApp();
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📚 Documentation available at http://localhost:${port}/docs`);
}
if (process.env.NODE_ENV === 'development') {
    bootstrapLocal();
}
//# sourceMappingURL=main.js.map