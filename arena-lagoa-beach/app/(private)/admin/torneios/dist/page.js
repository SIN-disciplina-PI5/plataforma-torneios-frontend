"use client";
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
var image_1 = require("next/image");
var lucide_react_1 = require("lucide-react");
var torneioService_1 = require("@/app/services/torneioService");
var AdminTournamentCard_1 = require("@/components/admin/AdminTournamentCard");
var AdminTournamentDialogs_1 = require("@/components/admin/AdminTournamentDialogs");
function AdminTorneiosPage() {
    var _this = this;
    var _a = react_1.useState([]), tournaments = _a[0], setTournaments = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var _d = react_1.useState("idle"), dialogState = _d[0], setDialogState = _d[1];
    var _e = react_1.useState(null), selected = _e[0], setSelected = _e[1];
    react_1.useEffect(function () {
        var fetchTorneios = function () { return __awaiter(_this, void 0, void 0, function () {
            var data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        setLoading(true);
                        setError(null);
                        return [4 /*yield*/, torneioService_1.getTorneios()];
                    case 1:
                        data = _a.sent();
                        if (!data) {
                            setError("Falha ao carregar os torneios");
                            setTournaments([]);
                            return [2 /*return*/];
                        }
                        setTournaments(data);
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _a.sent();
                        console.error("Erro ao buscar torneios:", err_1);
                        setError("Erro ao carregar os torneios");
                        setTournaments([]);
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchTorneios();
    }, []);
    function handleEditClick(tournament) {
        setSelected(tournament);
        setDialogState("edit");
    }
    function handleDeleteClick(tournament) {
        setSelected(tournament);
        setDialogState("confirmDelete");
    }
    function handleViewRegistrations(tournament) {
        setSelected(tournament);
        setDialogState("registrations");
    }
    function handleConfirmDelete() {
        return __awaiter(this, void 0, void 0, function () {
            var success;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!selected)
                            return [2 /*return*/];
                        setDialogState("loadingDelete");
                        return [4 /*yield*/, torneioService_1.deleteTorneio(selected.id_torneio)];
                    case 1:
                        success = _a.sent();
                        if (!success) {
                            setDialogState("errorDelete");
                            return [2 /*return*/];
                        }
                        // Remove da lista localmente sem refetch
                        setTournaments(function (prev) { return prev.filter(function (t) { return t.id_torneio !== selected.id_torneio; }); });
                        setDialogState("successDelete");
                        return [2 /*return*/];
                }
            });
        });
    }
    function handleClose() {
        setDialogState("idle");
        setSelected(null);
    }
    if (loading) {
        return (React.createElement("div", { className: "flex items-center justify-center min-h-screen" },
            React.createElement("div", { className: "text-center" },
                React.createElement("div", { className: "inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4" }),
                React.createElement("p", { className: "text-gray-600 font-medium" }, "Carregando torneios..."))));
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("main", { className: "min-h-screen px-8 py-6" },
            React.createElement("div", { className: "flex items-center justify-between mb-8" },
                React.createElement("div", { className: "flex items-center gap-3" },
                    React.createElement(image_1["default"], { src: "/variante-de-bola-de-futebol.png", alt: "Bola", width: 40, height: 40 }),
                    React.createElement("h1", { className: "text-4xl font-semibold" }, "Gerenciar Torneios")),
                React.createElement("button", { onClick: function () { return setDialogState("create"); }, className: "flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors" },
                    React.createElement(lucide_react_1.Plus, { size: 16 }),
                    "Novo torneio")),
            error && (React.createElement("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3" },
                React.createElement(lucide_react_1.AlertCircle, { className: "text-red-600", size: 20 }),
                React.createElement("p", { className: "text-red-700 font-medium text-sm" }, error))),
            tournaments.length === 0 && !error && (React.createElement("div", { className: "flex flex-col items-center justify-center py-24 text-gray-600" },
                React.createElement(lucide_react_1.Trophy, { size: 48, className: "mb-4 opacity-30" }),
                React.createElement("p", { className: "text-lg font-medium" }, "Nenhum torneio cadastrado"))),
            tournaments.length > 0 && (React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" }, tournaments.map(function (t) { return (React.createElement(AdminTournamentCard_1.AdminTournamentCard, { key: t.id_torneio, tournament: t, onEdit: handleEditClick, onDelete: handleDeleteClick, onViewRegistrations: handleViewRegistrations })); })))),
        React.createElement(AdminTournamentDialogs_1.AdminTournamentDialogs, { state: dialogState, tournament: selected, onClose: handleClose, onConfirmDelete: handleConfirmDelete })));
}
exports["default"] = AdminTorneiosPage;
