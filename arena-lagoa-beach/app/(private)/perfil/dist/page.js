"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var lucide_react_1 = require("lucide-react");
var navigation_1 = require("next/navigation");
var sonner_1 = require("sonner");
var browser_image_compression_1 = require("browser-image-compression");
var perfilService_1 = require("@/app/services/perfilService");
var notificacaoService_1 = require("@/app/services/notificacaoService");
var alert_dialog_1 = require("@/components/ui/alert-dialog");
var auth_1 = require("@/app/utils/auth");
function MeuPerfil() {
    var _this = this;
    var router = navigation_1.useRouter();
    var _a = react_1.useState(true), isLoading = _a[0], setIsLoading = _a[1];
    var _b = react_1.useState(false), isEditing = _b[0], setIsEditing = _b[1];
    var _c = react_1.useState(auth_1.AVATAR_PADRAO), avatarPreview = _c[0], setAvatarPreview = _c[1];
    var _d = react_1.useState(false), mostrarSenha = _d[0], setMostrarSenha = _d[1];
    var _e = react_1.useState(false), mostrarConfirmarSenha = _e[0], setMostrarConfirmarSenha = _e[1];
    var _f = react_1.useState({
        nome: "",
        email: "",
        patente: "",
        senha: "",
        confirmarSenha: "",
        fotoBase64: ""
    }), formData = _f[0], setFormData = _f[1];
    react_1.useEffect(function () {
        function carregarPerfil() {
            return __awaiter(this, void 0, void 0, function () {
                var dados_1, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, 3, 4]);
                            return [4 /*yield*/, perfilService_1.getMeuPerfil()];
                        case 1:
                            dados_1 = _a.sent();
                            if (dados_1) {
                                setFormData(function (prev) { return (__assign(__assign({}, prev), { nome: dados_1.nome || "", email: dados_1.email || "", patente: dados_1.patente || "Não ranqueado" })); });
                                if (dados_1.foto_perfil) {
                                    setAvatarPreview(dados_1.foto_perfil);
                                }
                            }
                            return [3 /*break*/, 4];
                        case 2:
                            error_1 = _a.sent();
                            console.error("Erro ao carregar perfil:", error_1);
                            sonner_1.toast.error("Não foi possível carregar seus dados.");
                            return [3 /*break*/, 4];
                        case 3:
                            setIsLoading(false);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        carregarPerfil();
    }, []);
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
    };
    var handleImageChange = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var file, options, compressedFile, reader_1, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
                    if (!file) return [3 /*break*/, 4];
                    setAvatarPreview(URL.createObjectURL(file));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    options = {
                        maxSizeMB: 0.1,
                        maxWidthOrHeight: 800,
                        useWebWorker: true
                    };
                    return [4 /*yield*/, browser_image_compression_1["default"](file, options)];
                case 2:
                    compressedFile = _b.sent();
                    reader_1 = new FileReader();
                    reader_1.onloadend = function () {
                        setFormData(function (prev) { return (__assign(__assign({}, prev), { fotoBase64: reader_1.result })); });
                    };
                    reader_1.readAsDataURL(compressedFile);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _b.sent();
                    console.error("Erro ao comprimir a imagem:", error_2);
                    sonner_1.toast.error("Erro ao processar a foto. Tente uma imagem mais simples.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleRemoveImage = function () {
        setAvatarPreview(auth_1.AVATAR_PADRAO);
        setFormData(function (prev) { return (__assign(__assign({}, prev), { fotoBase64: "REMOVER" })); });
    };
    var handleEditToggle = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var payload, error_3, error_4, apiError, mensagemErro;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    e.preventDefault();
                    if (!isEditing) return [3 /*break*/, 9];
                    if (formData.senha && formData.senha !== formData.confirmarSenha) {
                        sonner_1.toast.error("As senhas não coincidem!");
                        return [2 /*return*/];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, , 8]);
                    payload = {
                        nome: formData.nome,
                        email: formData.email
                    };
                    if (formData.senha) {
                        payload.senha = formData.senha;
                    }
                    if (formData.fotoBase64 === "REMOVER") {
                        payload.foto_perfil = null;
                    }
                    else if (formData.fotoBase64) {
                        payload.foto_perfil = formData.fotoBase64;
                    }
                    return [4 /*yield*/, perfilService_1.updateMeuPerfil(payload)];
                case 2:
                    _c.sent();
                    if (!payload.senha) return [3 /*break*/, 6];
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, notificacaoService_1.criarNotificacao({
                            titulo: "Senha alterada",
                            mensagem: "Sua senha foi alterada com sucesso.",
                            tipo: "success"
                        })];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _c.sent();
                    console.error("Erro ao registrar notificação:", error_3);
                    return [3 /*break*/, 6];
                case 6:
                    sonner_1.toast.success("Perfil atualizado com sucesso!");
                    window.dispatchEvent(new Event("avatarUpdated"));
                    setFormData(function (prev) { return (__assign(__assign({}, prev), { senha: "", confirmarSenha: "", fotoBase64: "" })); });
                    setIsEditing(false);
                    setMostrarSenha(false);
                    setMostrarConfirmarSenha(false);
                    return [3 /*break*/, 8];
                case 7:
                    error_4 = _c.sent();
                    apiError = error_4;
                    mensagemErro = ((_b = (_a = apiError.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || "Erro ao atualizar perfil.";
                    console.error("Erro da API:", mensagemErro);
                    sonner_1.toast.error(mensagemErro);
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    setIsEditing(true);
                    _c.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    }); };
    var handleLogout = function () {
        localStorage.removeItem("token");
        sonner_1.toast.info("Saindo da conta...");
        setTimeout(function () { return router.push("/login"); }, 1000);
    };
    var handleDeleteAccount = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, perfilService_1.deleteMinhaConta()];
                case 1:
                    _a.sent();
                    localStorage.removeItem("token");
                    sonner_1.toast.error("Conta deletada com sucesso.");
                    setTimeout(function () { return router.push("/"); }, 1500);
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error(error_5);
                    sonner_1.toast.error("Erro ao deletar conta.");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var inputClassName = "px-4 py-3 rounded-md text-sm text-gray-600 outline-none transition-colors w-full " + (isEditing
        ? "bg-white border border-gray-300 focus:border-[#316f27] focus:ring-1 focus:ring-[#316f27]"
        : "bg-[#f6f6f6] border border-transparent");
    var passwordInputClassName = inputClassName + " pr-10";
    if (isLoading) {
        return (React.createElement("div", { className: "flex-1 min-h-screen p-4 sm:p-8 flex items-center justify-center" }, "Carregando perfil..."));
    }
    return (React.createElement("main", { className: "w-full flex-1 min-h-screen p-4 sm:p-8 box-border " },
        React.createElement("div", { className: "mb-6" },
            React.createElement("h1", { className: "text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2 m-0" }, "\u26BD Meu Perfil"),
            React.createElement("p", { className: "text-sm text-gray-500 mt-1 sm:ml-8" }, formData.email)),
        React.createElement("div", { className: "bg-white rounded-xl shadow-sm overflow-hidden pb-6" },
            React.createElement("div", { className: "h-28 bg-gradient-to-r from-[#90e0ef] via-[#d4f29a] to-[#fff700]" }),
            React.createElement("div", { className: "px-5 sm:px-10 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center" },
                React.createElement("div", { className: "flex items-center gap-4 sm:gap-5 w-full md:w-auto" },
                    React.createElement("div", { className: "relative -mt-8 sm:-mt-10 flex items-end" },
                        React.createElement("div", { role: "img", "aria-label": "Foto de perfil", style: { backgroundImage: "url(\"" + avatarPreview + "\")" }, className: "w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white bg-white bg-cover bg-center shadow-sm relative" }),
                        isEditing && (React.createElement("div", { className: "absolute -bottom-2 -right-2 sm:-right-4 flex flex-col gap-2" },
                            React.createElement("input", { type: "file", id: "avatar-upload", accept: "image/png, image/jpeg, image/svg+xml", className: "hidden", onChange: handleImageChange }),
                            React.createElement("label", { htmlFor: "avatar-upload", className: "bg-[#316f27] text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md border-2 border-white flex items-center justify-center", title: "Alterar foto" },
                                React.createElement(lucide_react_1.ImagePlus, { size: 14, strokeWidth: 2.5 })),
                            avatarPreview !== auth_1.AVATAR_PADRAO && (React.createElement("button", { type: "button", onClick: handleRemoveImage, className: "bg-red-500 text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md border-2 border-white flex items-center justify-center", title: "Remover foto" },
                                React.createElement(lucide_react_1.Trash2, { size: 14, strokeWidth: 2.5 })))))),
                    React.createElement("div", { className: "mt-2 ml-2 sm:ml-4 flex-1" },
                        React.createElement("h2", { className: "m-0 text-lg sm:text-xl text-gray-800 font-semibold truncate" }, formData.nome),
                        React.createElement("a", { href: "mailto:" + formData.email, className: "text-xs sm:text-sm text-gray-500 hover:underline truncate block" }, formData.email))),
                React.createElement("button", { onClick: handleEditToggle, className: "mt-6 md:mt-2 text-white border-none w-full md:w-auto px-6 py-2.5 rounded-md text-sm font-medium cursor-pointer transition-colors " + (isEditing
                        ? "bg-green-600 hover:bg-green-800"
                        : "bg-[#316f27] hover:bg-green-800") }, isEditing ? "Salvar" : "Editar")),
            React.createElement("form", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 px-5 sm:px-10 pt-6" },
                React.createElement("div", { className: "flex flex-col gap-2" },
                    React.createElement("label", { className: "text-sm text-gray-600 font-medium" }, "Nome Completo"),
                    React.createElement("input", { type: "text", name: "nome", value: formData.nome, onChange: handleChange, readOnly: !isEditing, className: inputClassName })),
                React.createElement("div", { className: "flex flex-col gap-2" },
                    React.createElement("label", { className: "text-sm text-gray-600 font-medium" }, "Email"),
                    React.createElement("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, readOnly: !isEditing, className: inputClassName })),
                React.createElement("div", { className: "flex flex-col gap-2" },
                    React.createElement("label", { className: "text-sm text-gray-600 font-medium" }, "Patente"),
                    React.createElement("input", { type: "text", name: "patente", value: formData.patente, readOnly: true, className: "px-4 py-3 rounded-md text-sm text-gray-500 bg-[#f6f6f6] border border-transparent outline-none cursor-not-allowed w-full" })),
                React.createElement("div", { className: "flex flex-col gap-2" },
                    React.createElement("label", { className: "text-sm text-gray-600 font-medium" }, "Nova Senha"),
                    React.createElement("div", { className: "relative" },
                        React.createElement("input", { type: mostrarSenha ? "text" : "password", name: "senha", placeholder: isEditing ? "Digite uma nova senha" : "••••••••", value: formData.senha, onChange: handleChange, readOnly: !isEditing, className: passwordInputClassName }),
                        isEditing && (React.createElement("button", { type: "button", onClick: function () { return setMostrarSenha(!mostrarSenha); }, className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" }, mostrarSenha ? React.createElement(lucide_react_1.EyeOff, { size: 18 }) : React.createElement(lucide_react_1.Eye, { size: 18 }))))),
                React.createElement("div", { className: "flex flex-col gap-2" },
                    React.createElement("label", { className: "text-sm text-gray-600 font-medium" }, "Confirmar Nova Senha"),
                    React.createElement("div", { className: "relative" },
                        React.createElement("input", { type: mostrarConfirmarSenha ? "text" : "password", name: "confirmarSenha", placeholder: isEditing ? "Confirme a nova senha" : "••••••••", value: formData.confirmarSenha, onChange: handleChange, readOnly: !isEditing, className: passwordInputClassName }),
                        isEditing && (React.createElement("button", { type: "button", onClick: function () {
                                return setMostrarConfirmarSenha(!mostrarConfirmarSenha);
                            }, className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" }, mostrarConfirmarSenha ? (React.createElement(lucide_react_1.EyeOff, { size: 18 })) : (React.createElement(lucide_react_1.Eye, { size: 18 }))))))),
            React.createElement("div", { className: "px-5 sm:px-10 mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-end" },
                React.createElement(alert_dialog_1.AlertDialog, null,
                    React.createElement(alert_dialog_1.AlertDialogTrigger, { asChild: true },
                        React.createElement("button", { type: "button", className: "w-full sm:w-auto bg-[#de3f53] hover:bg-[#c43648] text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer" }, "Sair")),
                    React.createElement(alert_dialog_1.AlertDialogContent, null,
                        React.createElement(alert_dialog_1.AlertDialogHeader, null,
                            React.createElement(alert_dialog_1.AlertDialogTitle, null, "Deseja realmente sair?"),
                            React.createElement(alert_dialog_1.AlertDialogDescription, null, "A sua sess\u00E3o ser\u00E1 encerrada e precisar\u00E1 de fazer login novamente para aceder \u00E0 arena.")),
                        React.createElement(alert_dialog_1.AlertDialogFooter, null,
                            React.createElement(alert_dialog_1.AlertDialogCancel, { className: "cursor-pointer" }, "Cancelar"),
                            React.createElement(alert_dialog_1.AlertDialogAction, { onClick: handleLogout, className: "bg-[#316f27] hover:bg-green-800 cursor-pointer" }, "Sim, sair")))),
                React.createElement(alert_dialog_1.AlertDialog, null,
                    React.createElement(alert_dialog_1.AlertDialogTrigger, { asChild: true },
                        React.createElement("button", { type: "button", className: "w-full sm:w-auto bg-[#de3f53] hover:bg-[#c43648] text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer" }, "Deletar conta")),
                    React.createElement(alert_dialog_1.AlertDialogContent, null,
                        React.createElement(alert_dialog_1.AlertDialogHeader, null,
                            React.createElement(alert_dialog_1.AlertDialogTitle, null, "Voc\u00EA tem certeza absoluta?"),
                            React.createElement(alert_dialog_1.AlertDialogDescription, null, "Esta a\u00E7\u00E3o n\u00E3o pode ser desfeita. Isso excluir\u00E1 permanentemente sua conta e remover\u00E1 seus dados dos nossos servidores de torneio.")),
                        React.createElement(alert_dialog_1.AlertDialogFooter, null,
                            React.createElement(alert_dialog_1.AlertDialogCancel, { className: "cursor-pointer" }, "Cancelar"),
                            React.createElement(alert_dialog_1.AlertDialogAction, { onClick: handleDeleteAccount, className: "bg-red-600 hover:bg-red-700 cursor-pointer" }, "Sim, deletar conta"))))))));
}
exports["default"] = MeuPerfil;
