"use client";
"use strict";
exports.__esModule = true;
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var react_1 = require("react");
var sidebar_module_css_1 = require("./sidebar.module.css");
var lucide_react_1 = require("lucide-react");
function Sidebar() {
    var pathname = navigation_1.usePathname();
    var _a = react_1.useState(false), isAdmin = _a[0], setIsAdmin = _a[1];
    var _b = react_1.useState(false), isMounted = _b[0], setIsMounted = _b[1];
    var _c = react_1.useState(false), isMobileOpen = _c[0], setIsMobileOpen = _c[1];
    react_1.useEffect(function () {
        var role = localStorage.getItem("role");
        setIsAdmin(role === "ADMIN");
        setIsMounted(true);
        var toggleMenu = function () { return setIsMobileOpen(function (prev) { return !prev; }); };
        window.addEventListener("toggleMobileMenu", toggleMenu);
        return function () { return window.removeEventListener("toggleMobileMenu", toggleMenu); };
    }, []);
    react_1.useEffect(function () {
        setIsMobileOpen(false);
    }, [pathname]);
    var navItems = [
        {
            label: "Home",
            href: isAdmin ? "/admin/torneios" : "/torneios",
            icon: lucide_react_1.Home
        },
        {
            label: "Ranking",
            href: "/ranking",
            icon: lucide_react_1.Trophy
        },
        {
            label: "Partidas",
            href: isAdmin ? "/admin/partidas" : "/home",
            icon: lucide_react_1.Volleyball
        },
        {
            label: "Meu Perfil",
            href: "/perfil",
            icon: lucide_react_1.User
        },
    ];
    if (!isMounted) {
        return (React.createElement("aside", { className: sidebar_module_css_1["default"].sidebar + " hidden md:flex" },
            React.createElement("h2", { className: sidebar_module_css_1["default"].title }, "MENU"),
            React.createElement("nav", { className: sidebar_module_css_1["default"].nav })));
    }
    return (React.createElement(React.Fragment, null,
        isMobileOpen && (React.createElement("div", { className: "fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity", onClick: function () { return setIsMobileOpen(false); } })),
        React.createElement("aside", { className: "\n          " + sidebar_module_css_1["default"].sidebar + " \n          fixed top-0 left-0 h-full z-50 md:relative md:translate-x-0 \n          transition-transform duration-300 ease-in-out w-64 bg-[#fbfbfb] shadow-2xl md:shadow-none\n          " + (isMobileOpen ? "translate-x-0" : "-translate-x-full") + "\n        " },
            React.createElement("div", { className: "flex items-center justify-between mb-8 md:block" },
                React.createElement("h2", { className: sidebar_module_css_1["default"].title + " !mb-0 md:!mb-8" }, "MENU"),
                React.createElement("button", { onClick: function () { return setIsMobileOpen(false); }, className: "md:hidden p-2 text-gray-500 hover:bg-gray-200 rounded-md cursor-pointer transition-colors" },
                    React.createElement(lucide_react_1.X, { size: 20 }))),
            React.createElement("nav", { className: sidebar_module_css_1["default"].nav }, navItems.map(function (_a) {
                var label = _a.label, href = _a.href, Icon = _a.icon;
                var isActive = pathname === href;
                return (React.createElement(link_1["default"], { key: href, href: href, className: sidebar_module_css_1["default"].navItem + " " + (isActive ? sidebar_module_css_1["default"].active : "") },
                    React.createElement(Icon, { className: sidebar_module_css_1["default"].icon }),
                    React.createElement("span", { className: sidebar_module_css_1["default"].label }, label)));
            })))));
}
exports["default"] = Sidebar;
