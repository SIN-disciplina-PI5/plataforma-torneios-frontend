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
var lucide_react_1 = require("lucide-react");
var fases = ['Eliminatórias', 'Oitavas', 'Quartas', 'Semifinal', 'Final'];
var duplas = [
    {
        titulo: 'Dupla 1',
        scoreA: '3',
        scoreB: '3',
        vencedor: true,
        jogadores: [
            { nome: 'Kawe Doe', avatar: 'https://i.pravatar.cc/100?img=12' },
            { nome: 'Julia Silva', avatar: 'https://i.pravatar.cc/100?img=32' },
        ]
    },
    {
        titulo: 'Dupla 2',
        scoreA: '3',
        scoreB: '3',
        vencedor: false,
        jogadores: [
            { nome: 'Karen Doe', avatar: 'https://i.pravatar.cc/100?img=47' },
            { nome: 'Alda Silva', avatar: 'https://i.pravatar.cc/100?img=20' },
        ]
    },
];
function CriarPartidaPage() {
    var _a = react_1.useState('Eliminatórias'), faseAtiva = _a[0], setFaseAtiva = _a[1];
    //  NOVOS ESTADOS (
    var _b = react_1.useState(''), data = _b[0], setData = _b[1];
    var _c = react_1.useState(''), hora = _c[0], setHora = _c[1];
    var _d = react_1.useState(false), loading = _d[0], setLoading = _d[1];
    //  FUNÇÃO DE CRIAR
    function handleCriar() {
        return __awaiter(this, void 0, void 0, function () {
            var res, json, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        setLoading(true);
                        return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_API_URL + "/api/partidas", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: "Bearer " + localStorage.getItem('token')
                                },
                                body: JSON.stringify({
                                    id_torneio: 1,
                                    fase: faseAtiva,
                                    status: 'PENDENTE',
                                    horario: data && hora ? data + "T" + hora + ":00" : null
                                })
                            })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        json = _a.sent();
                        if (!res.ok) {
                            alert(json.error || 'Erro ao criar partida');
                            return [2 /*return*/];
                        }
                        alert('Partida criada com sucesso!');
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        alert('Erro na requisição');
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    return (React.createElement("div", { className: "min-h-screen bg-[#fffff] text-[#2d2d2d] flex width-full" },
        React.createElement("div", { className: "flex-1 flex flex-col" },
            React.createElement("main", null,
                React.createElement("div", { className: "flex items-center gap-3 mb-10" },
                    React.createElement(image_1["default"], { src: "/variante-de-bola-de-futebol.png", alt: "Bola de futebol", width: 40, height: 40 }),
                    React.createElement("h1", { className: "text-[28px] font-semibold text-[#2b2b2b]" }, "Criar Partida")),
                React.createElement("section", { className: "mb-10" },
                    React.createElement("h2", { className: "text-[32px] font-semibold text-[#2f2f2f] mb-6" }, "Fase"),
                    React.createElement("div", { className: "border-b border-[#d8d8d8] flex items-end gap-10 overflow-x-auto" }, fases.map(function (fase) {
                        var ativa = faseAtiva === fase;
                        return (React.createElement("button", { key: fase, onClick: function () { return setFaseAtiva(fase); }, className: "relative pb-3 text-[14px] whitespace-nowrap transition " + (ativa
                                ? 'text-[green] font-medium'
                                : 'text-[#a1a1a1] hover:text-[#6f6f6f]') },
                            fase,
                            ativa && (React.createElement("span", { className: "absolute left-0 bottom-1px h-3px w-full rounded-full bg-[#2faa2f]" }))));
                    }))),
                React.createElement("section", { className: "max-w-920px" },
                    React.createElement("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-8" },
                        React.createElement("div", { className: "space-y-6" },
                            React.createElement(FormField, { label: "Data da Partida" },
                                React.createElement("input", { type: "date", value: data, onChange: function (e) { return setData(e.target.value); }, className: "w-full h-12 rounded-xl border border-[#dddddd] bg-white px-4 text-sm outline-none focus:border-[#316f27]" })),
                            React.createElement(FormField, { label: "Hor\u00E1rio" },
                                React.createElement("input", { type: "time", value: hora, onChange: function (e) { return setHora(e.target.value); }, className: "w-full h-12 rounded-xl border border-[#dddddd] bg-white px-4 text-sm outline-none focus:border-[#316f27]" })),
                            React.createElement("div", null,
                                React.createElement("p", { className: "text-[15px] font-semibold text-[#3a3a3a] mb-3" }, "Resultado Final da Partida"),
                                React.createElement("div", { className: "grid grid-cols-2 gap-4" }, duplas.map(function (dupla) { return (React.createElement("div", { key: dupla.titulo, className: "bg-white border rounded-2xl p-4" },
                                    React.createElement("p", { className: "text-sm font-medium mb-3" }, dupla.titulo),
                                    React.createElement("div", { className: "flex gap-3" },
                                        React.createElement("input", { type: "number", defaultValue: dupla.scoreA, className: "input text-center" }),
                                        React.createElement("input", { type: "number", defaultValue: dupla.scoreB, className: "input text-center" })))); })))),
                        React.createElement("div", null,
                            React.createElement("p", { className: "text-[15px] font-semibold mb-4" }, "Dupla Vencedora"),
                            React.createElement("div", { className: "space-y-4" }, duplas.map(function (dupla) { return (React.createElement("div", { key: dupla.titulo, className: "bg-white border rounded-2xl px-5 py-4 flex justify-between" },
                                React.createElement("div", null,
                                    React.createElement("p", { className: "text-sm font-semibold mb-3" }, dupla.titulo),
                                    React.createElement("div", { className: "flex gap-5" }, dupla.jogadores.map(function (jogador) { return (React.createElement("div", { key: jogador.nome, className: "flex gap-3" },
                                        React.createElement("img", { src: jogador.avatar, className: "w-10 h-10 rounded-full" }),
                                        React.createElement("span", null, jogador.nome))); }))),
                                React.createElement("button", { className: "w-7 h-7 border flex items-center justify-center" },
                                    React.createElement(lucide_react_1.ShieldCheck, { size: 15 })))); })),
                            React.createElement("div", { className: "mt-8" },
                                React.createElement("button", { onClick: handleCriar, disabled: loading, className: "h-12 px-8 rounded-xl bg-[#2faa2f] text-white font-medium hover:bg-[#289828] transition shadow-sm" }, loading ? 'Criando...' : 'Criar')))))))));
}
exports["default"] = CriarPartidaPage;
function FormField(_a) {
    var label = _a.label, children = _a.children;
    return (React.createElement("div", null,
        React.createElement("label", { className: "block text-[15px] font-semibold mb-3" }, label),
        children));
}
