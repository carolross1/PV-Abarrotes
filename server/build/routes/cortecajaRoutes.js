"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cortecajaControllers_1 = require("../controllers/cortecajaControllers");
const router = (0, express_1.Router)();
router.post('/iniciar-corte', cortecajaControllers_1.iniciarCorte);
router.post('/cerrar-corte', cortecajaControllers_1.cerrarCorte);
router.get('/corte-actual', cortecajaControllers_1.obtenerCorteActual);
router.get('/corte-abierto/:id_Usuario', cortecajaControllers_1.obtenerCorteAbierto);
exports.default = router;
