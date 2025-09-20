"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminExercisesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const exercises_service_1 = require("./exercises.service");
const list_exercise_dto_1 = require("./dto/list-exercise.dto");
const toggle_exercise_dto_1 = require("./dto/toggle-exercise.dto");
let AdminExercisesController = class AdminExercisesController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    list(q) { return this.svc.list(q); }
    toggle(id, dto) { return this.svc.toggle(id, dto.isActive); }
};
exports.AdminExercisesController = AdminExercisesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar ejercicios (admin)' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'muscleGroup', required: false, type: String, example: 'Pecho' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, type: String, example: 'Máquina' }),
    (0, swagger_1.ApiQuery)({ name: 'programTag', required: false, enum: ['max', 'hyper'] }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: String, example: 'true' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 20 }),
    (0, swagger_1.ApiOkResponse)({ description: 'Listado mapeado con las claves del mock (nombre, series, repeticiones, grupoMuscular, tipo)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_exercise_dto_1.ListExercisesDto]),
    __metadata("design:returntype", void 0)
], AdminExercisesController.prototype, "list", null);
__decorate([
    (0, common_1.Patch)(':id/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Activar/Desactivar ejercicio' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Estado actualizado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, toggle_exercise_dto_1.ToggleExerciseDto]),
    __metadata("design:returntype", void 0)
], AdminExercisesController.prototype, "toggle", null);
exports.AdminExercisesController = AdminExercisesController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Exercises'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/exercises'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:paramtypes", [exercises_service_1.ExercisesService])
], AdminExercisesController);
//# sourceMappingURL=admin-exercises.controller.js.map