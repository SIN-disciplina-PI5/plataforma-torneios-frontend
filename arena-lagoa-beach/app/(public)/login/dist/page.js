"use strict";
exports.__esModule = true;
var image_1 = require("next/image");
var react_1 = require("react");
var LoginForm_1 = require("@/components/auth/LoginForm");
function Login() {
    return (React.createElement("div", { className: "flex min-h-screen flex-col items-center justify-center gap-8 overflow-x-hidden bg-white px-4 py-8 sm:px-6 lg:flex-row lg:gap-10 lg:py-0" },
        React.createElement("div", { className: "flex flex-col justify-center w-full max-w-md" },
            React.createElement("h1", { className: "text-3xl lg:text-4xl font-bold text-black mb-4" }, "Login"),
            React.createElement("p", { className: "text-gray-500 mb-6 text-sm lg:text-base" }, "Login para acessar sua conta"),
            React.createElement(react_1.Suspense, { fallback: React.createElement("div", null, "Carregando...") },
                React.createElement(LoginForm_1.LoginForm, null))),
        React.createElement("div", { className: "flex w-full max-w-md flex-col items-center justify-center rounded-lg border border-[#AEC3CB] bg-[#F9F9F9] p-6 lg:mb-0 lg:min-h-[600px] lg:p-12" },
            React.createElement(image_1["default"], { src: "/LoginImage.png", alt: "Imagem da tela de login", className: "mb-6 lg:mb-12 w-64 lg:w-96 h-auto", width: 400, height: 400 }),
            React.createElement("h1", { className: "font-bold text-[#316F27] mb-2 text-lg lg:text-xl" }, "Suba no ranking"),
            React.createElement("p", { className: "text-gray-500 text-center text-sm lg:text-base" }, "Cada vit\u00F3ria conta! Acompanhe sua evolu\u00E7\u00E3o, conquiste medalhas e veja sua posi\u00E7\u00E3o entre os melhores jogadores."))));
}
exports["default"] = Login;
