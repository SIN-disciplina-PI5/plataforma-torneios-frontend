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
var navbar_module_css_1 = require("./navbar.module.css");
var lucide_react_1 = require("lucide-react");
var react_1 = require("react");
var link_1 = require("next/link");
var perfilService_1 = require("@/app/services/perfilService");
var avatarPadrao = "https://wallpapers.com/images/hd/albert-einstein-pictures-1920-x-1080-66yf319tqmodnrvt.jpg";
function Navbar() {
    var _a = react_1.useState(false), darkMode = _a[0], setDarkMode = _a[1];
    var hasNotification = react_1.useState(true)[0];
    var _b = react_1.useState(avatarPadrao), avatarUrl = _b[0], setAvatarUrl = _b[1];
    react_1.useEffect(function () {
        function carregarFotoNavbar() {
            return __awaiter(this, void 0, void 0, function () {
                var perfil, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, perfilService_1.getMeuPerfil()];
                        case 1:
                            perfil = _a.sent();
                            if (perfil && perfil.foto_perfil) {
                                setAvatarUrl(perfil.foto_perfil);
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            console.error("Erro ao buscar foto para a Navbar:", error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
        carregarFotoNavbar();
    }, []);
    return (React.createElement("header", { className: navbar_module_css_1["default"].navbar },
        React.createElement("div", { className: navbar_module_css_1["default"].searchContainer },
            React.createElement(lucide_react_1.Search, { className: navbar_module_css_1["default"].searchIcon, size: 18 }),
            React.createElement("input", { type: "text", placeholder: "Pesquisar", className: navbar_module_css_1["default"].searchInput })),
        React.createElement("div", { className: navbar_module_css_1["default"].actions },
            React.createElement(link_1["default"], { href: "/notificacoes", className: navbar_module_css_1["default"].iconButton },
                React.createElement("div", { className: navbar_module_css_1["default"].notificationWrapper },
                    React.createElement(lucide_react_1.Bell, { size: 20, className: navbar_module_css_1["default"].icon }),
                    hasNotification && (React.createElement("span", { className: navbar_module_css_1["default"].notificationDot })))),
            React.createElement(link_1["default"], { href: "/perfil", className: navbar_module_css_1["default"].iconButton },
                React.createElement("button", { className: navbar_module_css_1["default"].profileButton },
                    React.createElement("span", { role: "img", "aria-label": "Foto de perfil", style: { backgroundImage: "url(" + avatarUrl + ")" }, className: navbar_module_css_1["default"].avatar }))))));
}
exports["default"] = Navbar;
