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
var image_1 = require("next/image");
var navigation_1 = require("next/navigation");
var fases = [
    { label: 'Oitavas de Finais', value: 'OITAVAS_DE_FINAL' },
    { label: 'Quartas de Finais', value: 'QUARTAS_DE_FINAL' },
    { label: 'Semifinais', value: 'SEMI_FINAL' },
    { label: 'Finais', value: 'FINAL' },
];
var statusPadrao = 'PENDENTE';
var apiUrlPadrao = 'https://plataforma-torneios-backend-mocha.vercel.app';
var duplas = [
    {
        titulo: 'Dupla 1',
        jogadores: [
            { nome: 'Karen Den', avatar: 'https://i.pravatar.cc/100?img=12' },
            { nome: 'Julia Silva', avatar: 'https://i.pravatar.cc/100?img=32' },
        ]
    },
    {
        titulo: 'Dupla 2',
        jogadores: [
            { nome: 'Márcio lima', avatar: 'https://i.pravatar.cc/100?img=47' },
            { nome: 'Homer Cídio', avatar: 'https://i.pravatar.cc/100?img=20' },
        ]
    },
];
var getApiUrl = function () { return process.env.NEXT_PUBLIC_API_URL || apiUrlPadrao; };
function CriarPartidaPage() {
    var router = navigation_1.useRouter();
    var _a = react_1.useState(''), idTorneio = _a[0], setIdTorneio = _a[1];
    var _b = react_1.useState(fases[0].value), faseAtiva = _b[0], setFaseAtiva = _b[1];
    var _c = react_1.useState(''), data = _c[0], setData = _c[1];
    var _d = react_1.useState(''), hora = _d[0], setHora = _d[1];
    var _e = react_1.useState(false), loading = _e[0], setLoading = _e[1];
    var _f = react_1.useState(true), loadingTorneios = _f[0], setLoadingTorneios = _f[1];
    var _g = react_1.useState(''), error = _g[0], setError = _g[1];
    react_1.useEffect(function () {
        function fetchTorneios() {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var apiUrl, token, res, json, torneiosRecebidos, err_1, message;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, 4, 5]);
                            apiUrl = getApiUrl();
                            token = localStorage.getItem('token');
                            if (!apiUrl) {
                                throw new Error('NEXT_PUBLIC_API_URL não está configurada');
                            }
                            return [4 /*yield*/, fetch(apiUrl + "/api/torneio", {
                                    headers: {
                                        Authorization: "Bearer " + token
                                    }
                                })];
                        case 1:
                            res = _b.sent();
                            return [4 /*yield*/, res.json()];
                        case 2:
                            json = (_b.sent());
                            if (!res.ok) {
                                throw new Error(json.error || 'Erro ao carregar torneios');
                            }
                            torneiosRecebidos = json.data || [];
                            setIdTorneio(String(((_a = torneiosRecebidos[0]) === null || _a === void 0 ? void 0 : _a.id_torneio) || ''));
                            return [3 /*break*/, 5];
                        case 3:
                            err_1 = _b.sent();
                            message = err_1 instanceof Error ? err_1.message : 'Erro ao carregar torneios';
                            setError(message);
                            return [3 /*break*/, 5];
                        case 4:
                            setLoadingTorneios(false);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
        fetchTorneios();
    }, []);
    function handleCriar() {
        return __awaiter(this, void 0, void 0, function () {
            var apiUrl, token, res, json, err_2, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setError('');
                        if (!idTorneio) {
                            setError('Selecione um torneio para criar a partida.');
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        setLoading(true);
                        apiUrl = getApiUrl();
                        token = localStorage.getItem('token');
                        if (!apiUrl) {
                            throw new Error('NEXT_PUBLIC_API_URL não está configurada');
                        }
                        return [4 /*yield*/, fetch(apiUrl + "/api/partidas", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: "Bearer " + token
                                },
                                body: JSON.stringify({
                                    id_torneio: idTorneio,
                                    fase: faseAtiva,
                                    status: statusPadrao,
                                    horario: data && hora ? data + "T" + hora + ":00" : null
                                })
                            })];
                    case 2:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 3:
                        json = (_a.sent());
                        if (!res.ok) {
                            setError(json.error || 'Erro ao criar partida');
                            return [2 /*return*/];
                        }
                        router.push('/admin/partidas');
                        router.refresh();
                        return [3 /*break*/, 6];
                    case 4:
                        err_2 = _a.sent();
                        console.error(err_2);
                        message = err_2 instanceof Error ? err_2.message : 'Erro na requisição';
                        setError(message);
                        return [3 /*break*/, 6];
                    case 5:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    return (React.createElement("div", { className: "min-h-screen bg-white text-[#111111]" },
        React.createElement("main", { className: "w-full max-w-[610px] px-5 pt-6 pb-8" },
            React.createElement("div", { className: "mb-6 flex items-center gap-2" },
                React.createElement(image_1["default"], { src: "/variante-de-bola-de-futebol.png", alt: "Bola de futebol", width: 18, height: 18 }),
                React.createElement("h1", { className: "text-[20px] font-bold leading-none" }, "Criar Partida")),
            React.createElement("section", { className: "mb-7" },
                React.createElement("div", { className: "flex items-end gap-8 border-b border-[#dddddd] overflow-x-auto" }, fases.map(function (fase) {
                    var ativa = faseAtiva === fase.value;
                    return (React.createElement("button", { key: fase.value, type: "button", onClick: function () { return setFaseAtiva(fase.value); }, className: "relative pb-3 text-[11px] whitespace-nowrap transition " + (ativa ? 'text-black' : 'text-[#a8a8a8]') },
                        fase.label,
                        ativa && (React.createElement("span", { className: "absolute bottom-[-1px] left-0 h-[3px] w-full bg-[#25a51f]" }))));
                }))),
            React.createElement("section", { className: "space-y-7" },
                error && (React.createElement("p", { className: "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700" }, error)),
                React.createElement(FormField, { label: "Data da Partida" },
                    React.createElement("input", { type: "date", value: data, onChange: function (e) { return setData(e.target.value); }, className: "h-9 w-[272px] max-w-full rounded-md border border-transparent bg-[#f8f8f8] px-3 text-[12px] text-[#8b8b8b] outline-none focus:border-[#25a51f]" })),
                React.createElement(FormField, { label: "Hor\u00E1rio" },
                    React.createElement("input", { type: "time", value: hora, onChange: function (e) { return setHora(e.target.value); }, className: "h-9 w-[272px] max-w-full rounded-md border border-transparent bg-[#f8f8f8] px-3 text-[12px] text-[#8b8b8b] outline-none focus:border-[#25a51f]" })),
                React.createElement("div", null,
                    React.createElement("p", { className: "mb-4 text-[12px] font-medium" }, "Duplas"),
                    React.createElement("div", { className: "space-y-2" }, duplas.map(function (dupla) { return (React.createElement("div", { key: dupla.titulo },
                        React.createElement("p", { className: "mb-2 text-[11px]" }, dupla.titulo),
                        React.createElement("div", { className: "flex h-8 w-[236px] max-w-full items-center rounded-md bg-[#f8f8f8] px-3" },
                            React.createElement("span", { className: "flex items-center gap-8" }, dupla.jogadores.map(function (jogador) { return (React.createElement("span", { key: jogador.nome, className: "flex items-center gap-2" },
                                React.createElement("span", { className: "h-6 w-6 rounded-full bg-cover bg-center", style: { backgroundImage: "url(" + jogador.avatar + ")" }, "aria-hidden": "true" }),
                                React.createElement("span", { className: "whitespace-nowrap text-[8px] font-bold" }, jogador.nome))); }))))); }))),
                React.createElement("button", { type: "button", onClick: handleCriar, disabled: loading || loadingTorneios, className: "h-9 w-[282px] max-w-full rounded-[3px] bg-[#25a51f] text-[11px] font-bold text-white transition hover:bg-[#208d1b] disabled:cursor-not-allowed disabled:opacity-60" }, loading ? 'Criando...' : 'Criar')))));
}
exports["default"] = CriarPartidaPage;
function FormField(_a) {
    var label = _a.label, children = _a.children;
    return (React.createElement("div", null,
        React.createElement("label", { className: "mb-2 block text-[11px] font-medium" }, label),
        children));
}
