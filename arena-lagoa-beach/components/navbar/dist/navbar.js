'use client';
"use strict";
exports.__esModule = true;
var navbar_module_css_1 = require("./navbar.module.css");
var lucide_react_1 = require("lucide-react");
var react_1 = require("react");
var link_1 = require("next/link");
var avatarUrl = 'https://wallpapers.com/images/hd/albert-einstein-pictures-1920-x-1080-66yf319tqmodnrvt.jpg';
function Navbar() {
    var _a = react_1.useState(false), darkMode = _a[0], setDarkMode = _a[1];
    var hasNotification = react_1.useState(true)[0];
    return (React.createElement("header", { className: navbar_module_css_1["default"].navbar },
        React.createElement("div", { className: navbar_module_css_1["default"].searchContainer },
            React.createElement(lucide_react_1.Search, { className: navbar_module_css_1["default"].searchIcon, size: 18 }),
            React.createElement("input", { type: "text", placeholder: "Pesquisar", className: navbar_module_css_1["default"].searchInput })),
        React.createElement("div", { className: navbar_module_css_1["default"].actions },
            React.createElement(link_1["default"], { href: "/notificacoes", className: navbar_module_css_1["default"].iconButton },
                React.createElement("div", { className: navbar_module_css_1["default"].notificationWrapper },
                    React.createElement(lucide_react_1.Bell, { size: 20, className: navbar_module_css_1["default"].icon }),
                    hasNotification && (React.createElement("span", { className: navbar_module_css_1["default"].notificationDot })))),
            React.createElement("button", { className: navbar_module_css_1["default"].iconButton, onClick: function () { return setDarkMode(!darkMode); }, "aria-label": "Alternar tema" }, darkMode ? (React.createElement(lucide_react_1.Moon, { size: 20, className: navbar_module_css_1["default"].icon })) : (React.createElement(lucide_react_1.Sun, { size: 20, className: navbar_module_css_1["default"].icon }))),
            React.createElement(link_1["default"], { href: "/perfil", className: navbar_module_css_1["default"].iconButton },
                React.createElement("button", { className: navbar_module_css_1["default"].profileButton },
                    React.createElement("span", { role: "img", "aria-label": "Foto de perfil", style: { backgroundImage: "url(" + avatarUrl + ")" }, className: navbar_module_css_1["default"].avatar }))))));
}
exports["default"] = Navbar;
