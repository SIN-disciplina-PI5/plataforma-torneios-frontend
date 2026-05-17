'use client';
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var link_1 = require("next/link");
function PartidasPage() {
    var _a = react_1.useState([]), partidas = _a[0], setPartidas = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    react_1.useEffect(function () {
        function fetchPartidas() {
            return __awaiter(this, void 0, void 0, function () {
                var res, json, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, 4, 5]);
                            return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_API_URL + "/api/partidas", {
                                    headers: {
                                        Authorization: "Bearer " + localStorage.getItem('token')
                                    }
                                })];
                        case 1:
                            res = _a.sent();
                            return [4 /*yield*/, res.json()];
                        case 2:
                            json = _a.sent();
                            console.log('PARTIDAS:', json);
                            setPartidas(json.data || []);
                            return [3 /*break*/, 5];
                        case 3:
                            err_1 = _a.sent();
                            console.error('Erro ao buscar partidas:', err_1);
                            return [3 /*break*/, 5];
                        case 4:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
        fetchPartidas();
    }, []);
    if (loading)
        return React.createElement("p", { className: "p-8" }, "Carregando partidas...");
    return (React.createElement("div", { className: "p-8" },
        React.createElement("h1", { className: "text-2xl font-bold mb-6" }, "Partidas"),
        partidas.length === 0 ? (React.createElement("p", null, "Nenhuma partida encontrada.")) : (React.createElement("div", { className: "space-y-4" }, partidas.map(function (p) { return (React.createElement("div", { key: p.id_partida, className: "border rounded-xl p-4 flex justify-between items-center shadow-sm" },
            React.createElement("div", null,
                React.createElement("p", { className: "font-semibold" }, p.torneio),
                React.createElement("p", { className: "text-sm text-gray-500" }, p.fase),
                React.createElement("p", { className: "text-sm" }, p.status),
                p.horario && (React.createElement("p", { className: "text-sm text-gray-400" }, new Date(p.horario).toLocaleString())),
                p.placar && (React.createElement("p", { className: "mt-1 font-medium" },
                    p.placar.a,
                    " x ",
                    p.placar.b))),
            React.createElement(link_1["default"], { href: "/admin/editarPartida/" + p.id_partida, className: "bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700" }, "Editar"))); }))),
        React.createElement("div", null,
            React.createElement(link_1["default"], { href: "/admin/criarPartida/", className: "bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700" }, "Criar"))));
}
exports["default"] = PartidasPage;
