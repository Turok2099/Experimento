"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_1 = require("@nestjs/swagger");
async function createApp() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = [
        'http://localhost:3000',
        'https://front-amber-tau.vercel.app',
        'https://nuevotrain-frontend.vercel.app',
        'https://nuevotrain-frontend-3mqnln0cx-jorge-castros-projects-839066ef.vercel.app',
        'https://nuevotrain-frontend-2xexop7sa-jorge-castros-projects-839066ef.vercel.app',
        'https://nuevotrain-frontend-ajxnvxr2u-jorge-castros-projects-839066ef.vercel.app',
        ...(process.env.FRONT_ORIGIN?.split(',').map((url) => url.trim()) || []),
        ...(process.env.FRONT_ORIGIN?.split(',')
            .map((url) => url.trim())
            .filter((url) => url.includes('nuevotrain-frontend') ||
            url.includes('front-amber-tau')) || []),
    ];
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (origin.includes('localhost'))
                return callback(null, true);
            if (origin.includes('vercel.app') && origin.includes('front')) {
                return callback(null, true);
            }
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            callback(new Error('No permitido por CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Cookie',
            'X-Requested-With',
        ],
        optionsSuccessStatus: 200,
        preflightContinue: false,
    });
    app.use((req, res, next) => {
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With');
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Max-Age', '86400');
            return res.status(200).end();
        }
        next();
    });
    app.use((0, cookie_parser_1.default)());
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
async function bootstrap() {
    const app = await createApp();
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📚 Documentation available at http://localhost:${port}/docs`);
}
if (process.env.NODE_ENV === 'development') {
    bootstrap();
}
//# sourceMappingURL=main.js.map