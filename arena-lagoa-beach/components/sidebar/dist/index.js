"use client";
"use strict";
exports.__esModule = true;
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var sidebar_module_css_1 = require("./sidebar.module.css");
var lucide_react_1 = require("lucide-react");
// Definição dos itens de navegação
var navItems = [
    { label: "Home", href: "/home", icon: lucide_react_1.Home },
    { label: "Ranking", href: "/ranking", icon: lucide_react_1.Trophy },
    { label: "Torneios", href: "/torneios", icon: lucide_react_1.Volleyball },
    { label: "Meu Perfil", href: "/perfil", icon: lucide_react_1.User },
    { label: "Admin", href: "/admin/partidas", icon: lucide_react_1.User },
];
function Sidebar() {
    var pathname = navigation_1.usePathname();
    return (React.createElement("aside", { className: sidebar_module_css_1["default"].sidebar },
        React.createElement("h2", { className: sidebar_module_css_1["default"].title }, "MENU"),
        React.createElement("nav", { className: sidebar_module_css_1["default"].nav }, navItems.map(function (_a) {
            var label = _a.label, href = _a.href, Icon = _a.icon;
            var isActive = pathname === href;
            return (React.createElement(link_1["default"], { key: href, href: href, className: sidebar_module_css_1["default"].navItem + " " + (isActive ? sidebar_module_css_1["default"].active : "") },
                React.createElement(Icon, { className: sidebar_module_css_1["default"].icon }),
                React.createElement("span", { className: sidebar_module_css_1["default"].label }, label)));
        }))));
}
exports["default"] = Sidebar;
