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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var auth_1 = require("@/app/utils/auth");
/* ------------------------------------------------------------------ */
/* CONFIG                                                            */
/* ------------------------------------------------------------------ */
var API = process.env.NEXT_PUBLIC_API_URL ||
    "https://plataforma-torneios-backend-mocha.vercel.app";
var FINALIZADA = "FINALIZADA";
var fases = [
    ["OITAVAS_DE_FINAL", "Oitavas de Finais"],
    ["QUARTAS_DE_FINAL", "Quartas de Finais"],
    ["SEMI_FINAL", "Semifinais"],
    ["FINAL", "Finais"],
];
var labelFase = function (v) { var _a, _b; return (_b = (_a = fases.find(function (f) { return f[0] === v; })) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : v; };
/* ------------------------------------------------------------------ */
/* HELPERS                                                           */
/* ------------------------------------------------------------------ */
var getToken = function () {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};
var auth = function (json) {
    if (json === void 0) { json = false; }
    var t = getToken();
    return __assign(__assign({}, (t ? { Authorization: "Bearer " + t } : {})), (json ? { "Content-Type": "application/json" } : {}));
};
function parsePlacar(p) {
    if (p == null || p === "")
        return [null, null];
    if (typeof p === "string") {
        var parts = p.split(/[xX\-]/);
        var a = parts[0];
        var b = parts[1];
        if (a === undefined || b === undefined)
            return [null, null];
        var na = Number(a);
        var nb = Number(b);
        if (Number.isNaN(na) || Number.isNaN(nb))
            return [null, null];
        return [na, nb];
    }
    var o = p;
    return [Number(o.a) || 0, Number(o.b) || 0];
}
function toPartida(r) {
    var _a, _b, _c, _d, _e, _f, _g;
    var _h = parsePlacar(r.placar), a = _h[0], b = _h[1];
    return {
        id: ((_a = r.id_partida) !== null && _a !== void 0 ? _a : r.id),
        torneio: (_b = r.torneio) !== null && _b !== void 0 ? _b : null,
        fase: r.fase,
        status: (_c = r.status) !== null && _c !== void 0 ? _c : "",
        horario: (_d = r.horario) !== null && _d !== void 0 ? _d : null,
        placarA: a,
        placarB: b,
        vencedorId: (_e = r.vencedor_id) !== null && _e !== void 0 ? _e : null,
        resultado: (_f = r.resultado) !== null && _f !== void 0 ? _f : null,
        equipes: (_g = r.equipes) !== null && _g !== void 0 ? _g : []
    };
}
var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
var isFinalizada = function (p) { return p.status.toUpperCase() === FINALIZADA; };
function grupoDe(iso) {
    if (!iso)
        return { ordem: Infinity, label: "Sem data definida" };
    var d = new Date(iso);
    if (Number.isNaN(d.getTime()))
        return { ordem: Infinity, label: "Sem data definida" };
    var dia = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var hoje = new Date();
    var base = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    var diff = Math.round((+dia - +base) / 864e5);
    var dm = dia.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit"
    });
    var label = diff === 0
        ? "Hoje"
        : diff === 1
            ? "Amanh\u00E3, " + dm
            : diff === -1
                ? "Ontem, " + dm
                : cap(dia.toLocaleDateString("pt-BR", { weekday: "long" })) + ", " + dm;
    return { ordem: +dia, label: label };
}
function horaDe(iso) {
    if (!iso)
        return "--:--";
    var d = new Date(iso);
    return Number.isNaN(d.getTime())
        ? "--:--"
        : d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
function decodeJwt(t) {
    try {
        var b = atob(t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"));
        var json = new TextDecoder().decode(Uint8Array.from(b, function (c) { return c.charCodeAt(0); }));
        return JSON.parse(json);
    }
    catch (_a) {
        return null;
    }
}
function useAdminNome() {
    var _this = this;
    var _a = react_1.useState("Administrador"), nome = _a[0], setNome = _a[1];
    react_1.useEffect(function () {
        var t = getToken();
        if (!t)
            return;
        var p = decodeJwt(t) || {};
        var id = (p.id_usuario || p.id || p.sub || p.userId);
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var urls, _i, urls_1, url, r, j, n, _a, tokenNome;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        urls = [
                            id && API + "/api/users/" + id,
                            API + "/api/users/me",
                        ].filter(Boolean);
                        _i = 0, urls_1 = urls;
                        _d.label = 1;
                    case 1:
                        if (!(_i < urls_1.length)) return [3 /*break*/, 7];
                        url = urls_1[_i];
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, fetch(url, { headers: auth() })];
                    case 3:
                        r = _d.sent();
                        if (!r.ok)
                            return [3 /*break*/, 6];
                        return [4 /*yield*/, r.json()];
                    case 4:
                        j = _d.sent();
                        n = (_c = (_b = j === null || j === void 0 ? void 0 : j.data) === null || _b === void 0 ? void 0 : _b.nome) !== null && _c !== void 0 ? _c : j === null || j === void 0 ? void 0 : j.nome;
                        if (n)
                            return [2 /*return*/, setNome(n)];
                        return [3 /*break*/, 6];
                    case 5:
                        _a = _d.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7:
                        tokenNome = (p.nome || p.name);
                        if (tokenNome)
                            setNome(tokenNome);
                        return [2 /*return*/];
                }
            });
        }); })();
    }, []);
    return nome;
}
function PartidasPage() {
    var _this = this;
    var nome = useAdminNome();
    var _a = react_1.useState([]), partidas = _a[0], setPartidas = _a[1];
    var _b = react_1.useState("TODOS"), aba = _b[0], setAba = _b[1];
    var _c = react_1.useState(true), carregando = _c[0], setCarregando = _c[1];
    var _d = react_1.useState(""), erro = _d[0], setErro = _d[1];
    var _e = react_1.useState(null), infoId = _e[0], setInfoId = _e[1];
    var _f = react_1.useState(null), editId = _f[0], setEditId = _f[1];
    var _g = react_1.useState(null), finalizandoId = _g[0], setFinalizandoId = _g[1];
    var carregar = react_1.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var r, j, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setCarregando(true);
                    setErro("");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch(API + "/api/partidas", { headers: auth() })];
                case 2:
                    r = _a.sent();
                    return [4 /*yield*/, r.json()];
                case 3:
                    j = _a.sent();
                    if (!r.ok)
                        throw new Error(j.error || "Erro ao buscar partidas");
                    setPartidas((j.data || []).map(toPartida));
                    return [3 /*break*/, 6];
                case 4:
                    e_1 = _a.sent();
                    setErro(e_1 instanceof Error ? e_1.message : "Erro ao buscar partidas");
                    return [3 /*break*/, 6];
                case 5:
                    setCarregando(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, []);
    react_1.useEffect(function () {
        var timeoutId = window.setTimeout(function () { void carregar(); }, 0);
        var id = setInterval(carregar, 30000);
        return function () { window.clearTimeout(timeoutId); clearInterval(id); };
    }, [carregar]);
    var finalizarPartida = react_1.useCallback(function (id) { return __awaiter(_this, void 0, void 0, function () {
        var r, j, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setFinalizandoId(id);
                    setErro("");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, fetch(API + "/api/partidas/finalizar/" + id, {
                            method: "PATCH",
                            headers: auth()
                        })];
                case 2:
                    r = _a.sent();
                    return [4 /*yield*/, r.json()["catch"](function () { return ({}); })];
                case 3:
                    j = _a.sent();
                    if (!r.ok)
                        throw new Error(j.error || "Erro ao finalizar partida");
                    return [4 /*yield*/, carregar()];
                case 4:
                    _a.sent();
                    setInfoId(null);
                    return [3 /*break*/, 7];
                case 5:
                    e_2 = _a.sent();
                    setErro(e_2 instanceof Error ? e_2.message : "Erro ao finalizar partida");
                    return [3 /*break*/, 7];
                case 6:
                    setFinalizandoId(null);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); }, [carregar]);
    var torneiosAtivos = react_1.useMemo(function () {
        var seen = new Set();
        var lista = [];
        var _loop_1 = function (p) {
            var t = p.torneio;
            if (!t || seen.has(t))
                return "continue";
            seen.add(t);
            var temAtivas = partidas.some(function (x) { return x.torneio === t && !isFinalizada(x); });
            if (temAtivas)
                lista.push(t);
        };
        for (var _i = 0, partidas_1 = partidas; _i < partidas_1.length; _i++) {
            var p = partidas_1[_i];
            _loop_1(p);
        }
        return lista;
    }, [partidas]);
    var abas = react_1.useMemo(function () { return __spreadArrays([
        ["TODOS", "Todos"]
    ], torneiosAtivos.map(function (t) { return [t, t]; }), [
        ["FINALIZADAS", "Finalizadas"],
    ]); }, [torneiosAtivos]);
    var abaAtual = react_1.useMemo(function () { return (abas.some(function (_a) {
        var v = _a[0];
        return v === aba;
    }) ? aba : "TODOS"); }, [abas, aba]);
    var grupos = react_1.useMemo(function () {
        var _a;
        var lista = partidas.filter(function (p) {
            if (abaAtual === "FINALIZADAS")
                return isFinalizada(p);
            if (isFinalizada(p))
                return false;
            return abaAtual === "TODOS" || p.torneio === abaAtual;
        });
        var mapa = new Map();
        for (var _i = 0, lista_1 = lista; _i < lista_1.length; _i++) {
            var p = lista_1[_i];
            var g = grupoDe(p.horario);
            var atual = (_a = mapa.get(g.label)) !== null && _a !== void 0 ? _a : { ordem: g.ordem, itens: [] };
            atual.itens.push(p);
            mapa.set(g.label, atual);
        }
        return __spreadArrays(mapa.entries()).sort(function (a, b) {
            return abaAtual === "FINALIZADAS"
                ? b[1].ordem - a[1].ordem
                : a[1].ordem - b[1].ordem;
        })
            .map(function (_a) {
            var label = _a[0], v = _a[1];
            return ({ label: label, itens: v.itens });
        });
    }, [partidas, abaAtual]);
    var partidaInfo = partidas.find(function (p) { return p.id === infoId; }) || null;
    return (React.createElement("div", { className: "min-h-screen bg-white" },
        React.createElement("div", { className: "mx-auto w-full max-w-6xl px-4 py-6 sm:px-8" },
            React.createElement("header", { className: "mb-6 flex flex-wrap items-center gap-3" },
                React.createElement("h1", { className: "flex items-center gap-2 text-xl font-bold sm:text-2xl" },
                    React.createElement("span", { className: "flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg" }, "\u26BD"),
                    "Ol\u00E1, ",
                    nome)),
            React.createElement("nav", { className: "mb-6 flex gap-6 overflow-x-auto border-b border-gray-200" }, abas.map(function (_a) {
                var v = _a[0], label = _a[1];
                return (React.createElement("button", { key: v, type: "button", onClick: function () { return setAba(v); }, className: "relative whitespace-nowrap pb-3 text-sm transition " + (abaAtual === v ? "font-semibold text-black" : "text-gray-400 hover:text-gray-600") },
                    label,
                    abaAtual === v && (React.createElement("span", { className: "absolute -bottom-px left-0 h-[3px] w-full rounded-full bg-[#25a51f]" }))));
            })),
            erro && (React.createElement("div", { className: "mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" },
                React.createElement("span", null, erro),
                React.createElement("button", { type: "button", onClick: carregar, className: "shrink-0 font-semibold underline" }, "Tentar novamente"))),
            editId && (React.createElement(EditarPartida, { id: editId, onClose: function () { return setEditId(null); }, onSalvo: function () { setEditId(null); carregar(); } })),
            carregando ? (React.createElement("p", { className: "py-16 text-center text-sm text-gray-500" }, "Carregando partidas...")) : grupos.length === 0 ? (React.createElement("p", { className: "rounded-xl border border-dashed border-gray-200 py-16 text-center text-sm text-gray-500" }, "Nenhuma partida encontrada.")) : (React.createElement("div", { className: "space-y-7" }, grupos.map(function (g) { return (React.createElement("section", { key: g.label },
                React.createElement("h2", { className: "mb-2 text-sm text-gray-500" }, g.label),
                React.createElement("ul", { className: "space-y-2" }, g.itens.map(function (p) { return (React.createElement(Linha, { key: p.id, partida: p, onInfo: function () { return setInfoId(p.id); }, onEditar: function () { return setEditId(p.id); } })); })))); })))),
        partidaInfo && (React.createElement(Modal, { titulo: "Detalhes da Partida", onClose: function () { return setInfoId(null); } },
            React.createElement(DetalhesPartida, { partida: partidaInfo, finalizando: finalizandoId === partidaInfo.id, onFinalizar: function () { return finalizarPartida(partidaInfo.id); } })))));
}
exports["default"] = PartidasPage;
function Linha(_a) {
    var partida = _a.partida, onInfo = _a.onInfo, onEditar = _a.onEditar;
    var equipeA = partida.equipes[0];
    var equipeB = partida.equipes[1];
    return (React.createElement("li", { className: "flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50/70 px-3 py-3 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:px-4" },
        React.createElement("div", { className: "flex flex-1 items-center justify-between gap-2 sm:justify-center sm:gap-4" },
            React.createElement(Time, { equipe: equipeA, align: "left" }),
            React.createElement(Placar, { a: partida.placarA, b: partida.placarB }),
            React.createElement(Time, { equipe: equipeB, align: "right" })),
        React.createElement("div", { className: "flex items-center justify-between sm:justify-end sm:gap-2" },
            React.createElement("span", { className: "shrink-0 rounded-md bg-green-50 px-3 py-1 text-xs font-medium text-green-700" }, horaDe(partida.horario)),
            React.createElement("div", { className: "flex shrink-0 items-center gap-0.5" },
                React.createElement(BotaoIcone, { titulo: "Detalhes", onClick: onInfo, cor: "text-gray-400 hover:bg-gray-200 hover:text-gray-600" },
                    React.createElement(lucide_react_1.Info, { size: 17 })),
                React.createElement(BotaoIcone, { titulo: "Editar", onClick: onEditar, cor: "text-gray-500 hover:bg-gray-200 hover:text-gray-700" },
                    React.createElement(lucide_react_1.Pencil, { size: 16 }))))));
}
function Time(_a) {
    var equipe = _a.equipe, _b = _a.align, align = _b === void 0 ? "left" : _b;
    if (!equipe) {
        return (React.createElement("div", { className: "flex min-w-0 flex-1 items-center justify-center" },
            React.createElement("span", { className: "text-xs text-gray-400" }, "A definir")));
    }
    var _c = equipe.membros, membroA = _c[0], membroB = _c[1];
    var avatares = (React.createElement("div", { className: "flex shrink-0 items-center -space-x-2" },
        membroA && React.createElement(Avatar, { src: membroA.foto_perfil, nome: membroA.nome, size: 36 }),
        membroB && React.createElement(Avatar, { src: membroB.foto_perfil, nome: membroB.nome, size: 36 })));
    return (React.createElement("div", { className: "flex min-w-0 flex-1 items-center gap-2 " + (align === "right"
            ? "flex-row-reverse justify-start sm:justify-center"
            : "justify-start sm:justify-center") },
        avatares,
        React.createElement("span", { className: "max-w-[80px] text-xs font-semibold leading-tight text-gray-800 line-clamp-2 sm:max-w-[110px] sm:text-sm " + (align === "right" ? "text-right sm:text-left" : "text-left") }, equipe.nome)));
}
function Placar(_a) {
    var a = _a.a, b = _a.b;
    if (a == null || b == null) {
        return (React.createElement("span", { className: "shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400" }, "vs"));
    }
    return (React.createElement("span", { className: "shrink-0 rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700" },
        a,
        " \u2013 ",
        b));
}
function BotaoIcone(_a) {
    var titulo = _a.titulo, onClick = _a.onClick, cor = _a.cor, children = _a.children;
    return (React.createElement("button", { type: "button", onClick: onClick, "aria-label": titulo, title: titulo, className: "rounded-md p-2 transition " + cor }, children));
}
function Avatar(_a) {
    var src = _a.src, nome = _a.nome, _b = _a.size, size = _b === void 0 ? 30 : _b;
    var finalSrc = src || auth_1.AVATAR_PADRAO;
    return (React.createElement("span", { role: "img", "aria-label": nome, className: "shrink-0 rounded-full bg-gray-200 bg-cover bg-center border border-gray-100", style: {
            width: size,
            height: size,
            backgroundImage: "url(\"" + finalSrc + "\")"
        } }));
}
function DetalhesPartida(_a) {
    var partida = _a.partida, finalizando = _a.finalizando, onFinalizar = _a.onFinalizar;
    var equipeA = partida.equipes[0];
    var equipeB = partida.equipes[1];
    var partidaFinalizada = isFinalizada(partida);
    var _b = react_1.useState(false), confirmarFinalizacao = _b[0], setConfirmarFinalizacao = _b[1];
    return (React.createElement(React.Fragment, null,
        React.createElement("p", { className: "mb-1 text-sm font-medium text-gray-700" }, partida.torneio || "Torneio não informado"),
        React.createElement("p", { className: "mb-5 text-xs text-gray-400" },
            labelFase(partida.fase),
            " \u00B7 ",
            partida.status),
        React.createElement("div", { className: "flex items-stretch gap-3" },
            equipeA ? (React.createElement(ColunaDupla, { equipe: equipeA })) : (React.createElement("div", { className: "flex flex-1 items-center justify-center rounded-lg bg-gray-50 p-3 text-xs text-gray-400" }, "A definir")),
            React.createElement("div", { className: "flex flex-col items-center justify-center px-1" },
                React.createElement("span", { className: "text-2xl font-bold text-gray-800" }, partida.placarA != null
                    ? partida.placarA + " \u2013 " + partida.placarB
                    : "—"),
                React.createElement("span", { className: "mt-1 text-[10px] uppercase tracking-wide text-green-400" }, "Placar")),
            equipeB ? (React.createElement(ColunaDupla, { equipe: equipeB })) : (React.createElement("div", { className: "flex flex-1 items-center justify-center rounded-lg bg-gray-50 p-3 text-xs text-gray-400" }, "A definir"))),
        partida.resultado && (React.createElement("p", { className: "mt-5 rounded-md bg-green-50 px-3 py-2 text-center text-xs font-medium text-green-700" }, partida.resultado)),
        React.createElement("div", { className: "flex items-center justify-center" },
            React.createElement("button", { type: "button", onClick: function () { return setConfirmarFinalizacao(true); }, disabled: finalizando || partidaFinalizada, className: "mt-5 h-10 w-50 rounded-lg bg-red-600 text-sm font-bold text-white" }, finalizando ? "Finalizando..." : "Finalizar partida")),
        confirmarFinalizacao && (React.createElement("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50" },
            React.createElement("div", { className: "w-full max-w-sm rounded-xl bg-white p-6 shadow-xl" },
                React.createElement("h3", { className: "mb-4 text-center text-lg font-bold" }, "Deseja finalizar a partida?"),
                React.createElement("div", { className: "flex gap-3" },
                    React.createElement("button", { type: "button", onClick: function () {
                            setConfirmarFinalizacao(false);
                            onFinalizar();
                        }, className: "flex-1 rounded-lg bg-red-600 py-2 text-white font-bold" }, "Sim"),
                    React.createElement("button", { type: "button", onClick: function () { return setConfirmarFinalizacao(false); }, className: "flex-1 rounded-lg bg-green-600 py-2 text-white font-bold" }, "N\u00E3o")))))));
}
function ColunaDupla(_a) {
    var equipe = _a.equipe;
    return (React.createElement("div", { className: "flex-1 rounded-lg bg-gray-50 p-3" },
        React.createElement("p", { className: "mb-3 text-center text-sm font-semibold text-gray-800" }, equipe.nome),
        React.createElement("ul", { className: "space-y-2" }, equipe.membros.map(function (m) { return (React.createElement("li", { key: m.id_usuario, className: "flex items-center gap-2" },
            React.createElement(Avatar, { src: m.foto_perfil, nome: m.nome, size: 24 }),
            React.createElement("span", { className: "truncate text-xs text-gray-700" }, m.nome))); }))));
}
function Modal(_a) {
    var titulo = _a.titulo, onClose = _a.onClose, children = _a.children;
    react_1.useEffect(function () {
        var k = function (e) { return e.key === "Escape" && onClose(); };
        document.addEventListener("keydown", k);
        return function () { return document.removeEventListener("keydown", k); };
    }, [onClose]);
    return (React.createElement("div", { onClick: onClose, role: "presentation", className: "fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4" },
        React.createElement("div", { role: "dialog", "aria-modal": "true", "aria-label": titulo, onClick: function (e) { return e.stopPropagation(); }, className: "max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6" },
            React.createElement("div", { className: "mb-5 flex items-center justify-between" },
                React.createElement("h2", { className: "text-lg font-bold" }, titulo),
                React.createElement("button", { type: "button", onClick: onClose, "aria-label": "Fechar", className: "rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600" },
                    React.createElement(lucide_react_1.X, { size: 18 }))),
            children)));
}
function EditarPartida(_a) {
    var _this = this;
    var _b, _c, _d, _e;
    var id = _a.id, onClose = _a.onClose, onSalvo = _a.onSalvo;
    var _f = react_1.useState(null), partida = _f[0], setPartida = _f[1];
    var _g = react_1.useState(fases[0][0]), fase = _g[0], setFase = _g[1];
    var _h = react_1.useState(""), data = _h[0], setData = _h[1];
    var _j = react_1.useState(""), hora = _j[0], setHora = _j[1];
    var _k = react_1.useState(0), a = _k[0], setA = _k[1];
    var _l = react_1.useState(0), b = _l[0], setB = _l[1];
    var _m = react_1.useState(null), vencedorId = _m[0], setVencedorId = _m[1];
    var _o = react_1.useState(true), carregando = _o[0], setCarregando = _o[1];
    var _p = react_1.useState(false), salvando = _p[0], setSalvando = _p[1];
    var _q = react_1.useState(""), erro = _q[0], setErro = _q[1];
    react_1.useEffect(function () {
        var ativo = true;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var r, j, p, d, z, e_3;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, 4, 5]);
                        return [4 /*yield*/, fetch(API + "/api/partidas/" + id, {
                                headers: auth()
                            })];
                    case 1:
                        r = _c.sent();
                        return [4 /*yield*/, r.json()];
                    case 2:
                        j = _c.sent();
                        if (!r.ok || !j.data)
                            throw new Error(j.error || "Erro ao buscar partida");
                        if (!ativo)
                            return [2 /*return*/];
                        p = toPartida(j.data);
                        setPartida(p);
                        setFase(p.fase);
                        setA((_a = p.placarA) !== null && _a !== void 0 ? _a : 0);
                        setB((_b = p.placarB) !== null && _b !== void 0 ? _b : 0);
                        setVencedorId(p.vencedorId);
                        if (p.horario) {
                            d = new Date(p.horario);
                            z = function (n) { return String(n).padStart(2, "0"); };
                            setData(d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()));
                            setHora(z(d.getHours()) + ":" + z(d.getMinutes()));
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        e_3 = _c.sent();
                        if (ativo)
                            setErro(e_3 instanceof Error ? e_3.message : "Erro ao buscar partida");
                        return [3 /*break*/, 5];
                    case 4:
                        if (ativo)
                            setCarregando(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); })();
        return function () {
            ativo = false;
        };
    }, [id]);
    function salvar() {
        return __awaiter(this, void 0, void 0, function () {
            var requestJson, equipeVencedora, horario, placar, e_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!partida)
                            return [2 /*return*/];
                        setSalvando(true);
                        setErro("");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, 8, 9]);
                        requestJson = function (url, init) { return __awaiter(_this, void 0, void 0, function () {
                            var r, j;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fetch(url, init)];
                                    case 1:
                                        r = _a.sent();
                                        return [4 /*yield*/, r.json()["catch"](function () { return ({}); })];
                                    case 2:
                                        j = _a.sent();
                                        if (!r.ok)
                                            throw new Error(j.error || "Falha ao salvar (HTTP " + r.status + ")");
                                        return [2 /*return*/, j];
                                }
                            });
                        }); };
                        equipeVencedora = partida.equipes.find(function (e) { return e.id_equipe === vencedorId; });
                        horario = data && hora ? new Date(data + "T" + hora).toISOString() : null;
                        placar = a + "-" + b;
                        return [4 /*yield*/, requestJson(API + "/api/partidas/" + id, {
                                method: "PATCH",
                                headers: auth(true),
                                body: JSON.stringify(__assign(__assign({}, (fase === partida.fase ? { fase: fase } : {})), { horario: horario,
                                    placar: placar }))
                            })];
                    case 2:
                        _a.sent();
                        if (!vencedorId) return [3 /*break*/, 6];
                        if (!(partida.status !== "EM_ANDAMENTO")) return [3 /*break*/, 4];
                        return [4 /*yield*/, requestJson(API + "/api/partidas/iniciar/" + id, {
                                method: "PATCH",
                                headers: auth(true)
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, requestJson(API + "/api/partidas/finalizar/" + id, {
                            method: "PATCH",
                            headers: auth(true),
                            body: JSON.stringify({
                                placar: placar,
                                vencedor_id: vencedorId,
                                resultado: equipeVencedora
                                    ? equipeVencedora.nome + " vencedora"
                                    : partida.resultado
                            })
                        })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        onSalvo();
                        return [3 /*break*/, 9];
                    case 7:
                        e_4 = _a.sent();
                        setErro(e_4 instanceof Error ? e_4.message : "Erro ao salvar partida");
                        return [3 /*break*/, 9];
                    case 8:
                        setSalvando(false);
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    }
    return (React.createElement("article", { className: "mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6" },
        React.createElement("header", { className: "mb-6 flex items-center justify-between" },
            React.createElement("h2", { className: "flex items-center gap-2 text-lg font-bold" }, "\u26BD Editar Partida"),
            React.createElement("button", { type: "button", onClick: onClose, "aria-label": "Fechar edi\u00E7\u00E3o", className: "rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600" },
                React.createElement(lucide_react_1.X, { size: 18 }))),
        carregando ? (React.createElement("p", { className: "py-6 text-sm text-gray-500" }, "Carregando partida...")) : !partida ? (React.createElement("p", { className: "py-4 text-sm text-red-600" }, erro || "Não foi possível carregar a partida.")) : (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "mb-6 flex gap-6 overflow-x-auto border-b border-gray-200" }, fases.map(function (_a) {
                var v = _a[0], label = _a[1];
                return (React.createElement("button", { key: v, type: "button", onClick: function () { return setFase(v); }, className: "relative whitespace-nowrap pb-3 text-xs transition " + (fase === v ? "font-semibold text-black" : "text-gray-400") },
                    label,
                    fase === v && (React.createElement("span", { className: "absolute -bottom-px left-0 h-[3px] w-full bg-[#25a51f]" }))));
            })),
            erro && (React.createElement("p", { className: "mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700" }, erro)),
            React.createElement("div", { className: "mb-6 grid gap-4 sm:max-w-md sm:grid-cols-2" },
                React.createElement(Campo, { label: "Data da Partida" },
                    React.createElement("input", { type: "date", value: data, onChange: function (e) { return setData(e.target.value); }, className: "h-10 w-full rounded-md bg-gray-50 px-3 text-sm text-gray-600 outline-none focus:ring-1 focus:ring-[#25a51f]" })),
                React.createElement(Campo, { label: "Hor\u00E1rio" },
                    React.createElement("input", { type: "time", value: hora, onChange: function (e) { return setHora(e.target.value); }, className: "h-10 w-full rounded-md bg-gray-50 px-3 text-sm text-gray-600 outline-none focus:ring-1 focus:ring-[#25a51f]" }))),
            React.createElement("p", { className: "mb-3 text-sm font-medium text-gray-700" }, "Resultado Final da Partida"),
            React.createElement("div", { className: "mb-6 flex items-end gap-4" },
                React.createElement(NumeroPlacar, { label: (_c = (_b = partida.equipes[0]) === null || _b === void 0 ? void 0 : _b.nome) !== null && _c !== void 0 ? _c : "Equipe A", valor: a, onChange: setA }),
                React.createElement("span", { className: "pb-3 text-lg font-semibold text-gray-400" }, "-"),
                React.createElement(NumeroPlacar, { label: (_e = (_d = partida.equipes[1]) === null || _d === void 0 ? void 0 : _d.nome) !== null && _e !== void 0 ? _e : "Equipe B", valor: b, onChange: setB })),
            partida.equipes.length > 0 && (React.createElement(React.Fragment, null,
                React.createElement("p", { className: "mb-3 text-sm font-medium text-gray-700" }, "Equipe Vencedora"),
                React.createElement("div", { className: "mb-7 space-y-2" }, partida.equipes.map(function (equipe) {
                    var sel = vencedorId === equipe.id_equipe;
                    return (React.createElement("button", { key: equipe.id_equipe, type: "button", onClick: function () { return setVencedorId(equipe.id_equipe); }, className: "flex w-full max-w-sm items-center justify-between rounded-md border px-3 py-2.5 transition " + (sel
                            ? "border-[#25a51f] bg-green-50"
                            : "border-transparent bg-gray-50 hover:bg-gray-100") },
                        React.createElement("span", { className: "flex flex-wrap items-center gap-x-4 gap-y-1" }, equipe.membros.map(function (m) { return (React.createElement("span", { key: m.id_usuario, className: "flex items-center gap-2" },
                            React.createElement(Avatar, { src: m.foto_perfil, nome: m.nome, size: 24 }),
                            React.createElement("span", { className: "text-xs font-medium text-gray-700" }, m.nome))); })),
                        React.createElement(lucide_react_1.CheckCircle2, { size: 16, className: sel ? "text-[#25a51f]" : "text-gray-300", fill: sel ? "#25a51f" : "transparent" })));
                })))),
            React.createElement("button", { type: "button", onClick: salvar, disabled: salvando, className: "h-11 w-full max-w-sm rounded-lg bg-[#25a51f] text-sm font-bold text-white transition hover:bg-[#208d1b] disabled:opacity-60" }, salvando ? "Salvando..." : "Salvar")))));
}
function Campo(_a) {
    var label = _a.label, children = _a.children;
    return (React.createElement("div", null,
        React.createElement("label", { className: "mb-1.5 block text-xs font-medium text-gray-600" }, label),
        children));
}
function NumeroPlacar(_a) {
    var label = _a.label, valor = _a.valor, onChange = _a.onChange;
    return (React.createElement("div", { className: "text-center" },
        React.createElement("p", { className: "mb-1 text-xs text-gray-500" }, label),
        React.createElement("input", { type: "number", min: 0, value: valor, onChange: function (e) { return onChange(Number(e.target.value) || 0); }, className: "h-12 w-14 rounded-md bg-gray-50 text-center text-lg outline-none focus:ring-1 focus:ring-[#25a51f]" })));
}
