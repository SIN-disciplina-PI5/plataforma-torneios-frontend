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
// 14/05 erro código, martins responsável
var react_1 = require("react");
var image_1 = require("next/image");
var lucide_react_1 = require("lucide-react");
var clsx_1 = require("clsx");
var constants_1 = require("./_lib/constants");
var api_1 = require("./_lib/api");
var AdminTournamentCard_1 = require("../../../../components/admin/AdminTournamentCard");
var AdminTournamentDialogs_1 = require("../../../../components/admin/AdminTournamentDialogs");
var admin_tournaments_module_css_1 = require("./_styles/admin-tournaments.module.css");
function AdminTorneiosPage() {
    var _a = react_1.useState("Todos"), activeTab = _a[0], setActiveTab = _a[1];
    var _b = react_1.useState(""), search = _b[0], setSearch = _b[1];
    var _c = react_1.useState([]), tournaments = _c[0], setTournaments = _c[1];
    var _d = react_1.useState(true), loading = _d[0], setLoading = _d[1];
    var _e = react_1.useState("idle"), dialogState = _e[0], setDialogState = _e[1];
    var _f = react_1.useState(null), selected = _f[0], setSelected = _f[1];
    var tabsRef = react_1.useRef([]);
    var _g = react_1.useState({}), indicatorStyle = _g[0], setIndicatorStyle = _g[1];
    react_1.useEffect(function () {
        api_1.fetchTournaments()
            .then(setTournaments)["catch"](function (err) { return console.error("Erro ao carregar torneios:", err); })["finally"](function () { return setLoading(false); });
    }, []);
    react_1.useEffect(function () {
        var updateIndicator = function () {
            var index = constants_1.ADMIN_TABS.indexOf(activeTab);
            var el = tabsRef.current[index];
            if (el) {
                setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
            }
        };
        updateIndicator();
        window.addEventListener("resize", updateIndicator);
        return function () { return window.removeEventListener("resize", updateIndicator); };
    }, [activeTab]);
    function handleDeleteClick(tournament) {
        setSelected(tournament);
        setDialogState("confirmDelete");
    }
    function handleEditClick(tournament) {
        setSelected(tournament);
        setDialogState("edit");
    }
    function handleViewRegistrations(tournament) {
        setSelected(tournament);
        setDialogState("registrations");
    }
    function handleConfirmDelete() {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!selected)
                            return [2 /*return*/];
                        setDialogState("loadingDelete");
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, api_1.deleteTournament(selected.id)];
                    case 2:
                        _b.sent();
                        setTournaments(function (prev) {
                            return prev.filter(function (t) { return t.id !== selected.id; });
                        });
                        setDialogState("successDelete");
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        setDialogState("errorDelete");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    var filtered = tournaments.filter(function (t) {
        var _a, _b;
        return ((_a = t.title) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(search.toLowerCase())) || ((_b = t.level) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(search.toLowerCase()));
    });
    return (React.createElement(React.Fragment, null,
        React.createElement("main", { className: "min-h-screen px-8 py-6 relative" },
            React.createElement("div", { className: "flex items-center gap-3 mb-8" },
                React.createElement("div", { className: "w-9 h-9 rounded-full flex items-center justify-center select-none" },
                    React.createElement(image_1["default"], { src: "/variante-de-bola-de-futebol.png", alt: "Bola", width: 40, height: 40 })),
                React.createElement("h1", { className: "text-4xl font-semibold" }, "Torneios"),
                React.createElement("span", { className: "ml-2 text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide" }, "Admin")),
            React.createElement("div", { className: "relative" },
                React.createElement("div", { className: "flex items-end gap-6 mb-8 relative overflow-x-auto pb-1", role: "tablist" },
                    constants_1.ADMIN_TABS.map(function (tab, i) { return (React.createElement("button", { key: tab, ref: function (el) {
                            tabsRef.current[i] = el;
                        }, onClick: function () { return setActiveTab(tab); }, className: clsx_1.clsx("pb-3 text-lg font-medium transition-colors whitespace-nowrap", activeTab === tab
                            ? "text-black"
                            : "text-gray-500 hover:text-gray-300") }, tab)); }),
                    React.createElement("span", { className: admin_tournaments_module_css_1["default"].tabIndicator, style: indicatorStyle }))),
            React.createElement("div", { className: clsx_1.clsx("rounded-2xl mb-10 h-28 flex items-center justify-center", admin_tournaments_module_css_1["default"].banner) },
                React.createElement("div", { className: "flex items-center gap-3" },
                    React.createElement(image_1["default"], { src: "/cup.png", alt: "Trof\u00E9u", width: 70, height: 70 }),
                    React.createElement("p", { className: "text-white text-3xl font-bold text-center" },
                        loading
                            ? "..."
                            : tournaments.length + " Torneios",
                        " ",
                        React.createElement("br", null),
                        " esperando por voc\u00EA!"))),
            loading ? (React.createElement("div", { className: "flex justify-center py-24 text-gray-400" }, "Carregando torneios...")) : filtered.length > 0 ? (React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" }, filtered.map(function (t) { return (React.createElement(AdminTournamentCard_1.AdminTournamentCard, { key: t.id, tournament: t, onEdit: handleEditClick, onDelete: handleDeleteClick, onViewRegistrations: handleViewRegistrations })); }))) : (React.createElement("div", { className: "flex flex-col items-center justify-center py-24 text-gray-600" },
                React.createElement(lucide_react_1.Trophy, { size: 48, className: "mb-4 opacity-30" }),
                React.createElement("p", { className: "text-lg font-medium" }, "Nenhum torneio encontrado"))),
            React.createElement("button", { onClick: function () { return setDialogState("create"); }, className: admin_tournaments_module_css_1["default"].fab, "aria-label": "Criar novo torneio" },
                React.createElement(lucide_react_1.Plus, { size: 28 }))),
        React.createElement(AdminTournamentDialogs_1.AdminTournamentDialogs, { state: dialogState, tournament: selected, onClose: function () { return setDialogState("idle"); }, onConfirmDelete: handleConfirmDelete })));
}
exports["default"] = AdminTorneiosPage;
