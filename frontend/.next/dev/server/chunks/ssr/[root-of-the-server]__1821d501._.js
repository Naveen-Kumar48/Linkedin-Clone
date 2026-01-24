module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/src/config/redux/action/authAction/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "getAboutUser",
    ()=>getAboutUser,
    "getAllUsers",
    ()=>getAllUsers,
    "loginUser",
    ()=>loginUser,
    "registerUser",
    ()=>registerUser
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__ = __turbopack_context__.i("[externals]/@reduxjs/toolkit [external] (@reduxjs/toolkit, esm_import, [project]/node_modules/@reduxjs/toolkit)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/index.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const loginUser = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createAsyncThunk"])("user/login", async (user, thunkAPI)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["clientServer"].post(`/login`, {
            email: user.email,
            password: user.password
        });
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        } else {
            return thunkAPI.rejectWithValue({
                message: "Invalid token not provided"
            });
        }
        return thunkAPI.fulfillWithValue(response.data.token);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
const registerUser = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createAsyncThunk"])("user/register", async (user, thunkAPI)=>{
    try {
        const request = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["clientServer"].post("/register", {
            username: user.username,
            password: user.password,
            email: user.email,
            name: user.name
        });
        return request.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
const getAboutUser = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createAsyncThunk"])("user/getAboutUser", async (user, thunkAPI)=>{
    try {
        // console.log(user.token)
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["clientServer"].get("/getuser_profile", {
            params: {
                token: user.token
            }
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
const getAllUsers = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$reduxjs$2f$toolkit__$5b$external$5d$__$2840$reduxjs$2f$toolkit$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$29$__["createAsyncThunk"])("user/getAllUsers", async (_, thunkAPI)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["clientServer"].get("user/get_allusers");
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/Component/Navbar/styles.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "buttonJoin": "styles-module__2oEZSG__buttonJoin",
  "container": "styles-module__2oEZSG__container",
  "navBaroptionContainer": "styles-module__2oEZSG__navBaroptionContainer",
  "navbar": "styles-module__2oEZSG__navbar",
});
}),
"[project]/src/Component/Navbar/index.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$styles$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/Component/Navbar/styles.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__ = __turbopack_context__.i("[externals]/react-redux [external] (react-redux, esm_import, [project]/node_modules/react-redux)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$reducer$2f$authReducer$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/redux/reducer/authReducer/index.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
const NavbarComponent = ()=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const authState = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__["useSelector"])((state)=>state.auth);
    const dispatch = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__["useDispatch"])();
    const postState = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__["useSelector"])((state)=>state.post);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$styles$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].container,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$styles$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].navbar,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        style: {
                            cursor: 'pointer'
                        },
                        onClick: ()=>{
                            router.push('/');
                        },
                        children: "Pro Connect"
                    }, void 0, false, {
                        fileName: "[project]/src/Component/Navbar/index.jsx",
                        lineNumber: 19,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$styles$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].navBaroptionContainer,
                        children: [
                            authState.profileFetched && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        gap: "1.2rem"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: [
                                                "Hey,",
                                                authState.user.userId.username
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/Component/Navbar/index.jsx",
                                            lineNumber: 29,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            onClick: ()=>{
                                                localStorage.removeItem("token");
                                                router.push("/login");
                                                dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$reducer$2f$authReducer$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["reset"])());
                                            },
                                            style: {
                                                cursor: "pointer",
                                                fontWeight: "bold"
                                            },
                                            children: "Logout"
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/Navbar/index.jsx",
                                            lineNumber: 30,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/Component/Navbar/index.jsx",
                                    lineNumber: 28,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/Component/Navbar/index.jsx",
                                lineNumber: 27,
                                columnNumber: 42
                            }, ("TURBOPACK compile-time value", void 0)),
                            !authState.profileFetched && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                onClick: ()=>{
                                    router.push('/login');
                                },
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$styles$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].buttonJoin,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    children: " Be a Part"
                                }, void 0, false, {
                                    fileName: "[project]/src/Component/Navbar/index.jsx",
                                    lineNumber: 43,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/Component/Navbar/index.jsx",
                                lineNumber: 39,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/Component/Navbar/index.jsx",
                        lineNumber: 25,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/Component/Navbar/index.jsx",
                lineNumber: 18,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/Component/Navbar/index.jsx",
            lineNumber: 17,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false);
};
const __TURBOPACK__default__export__ = NavbarComponent;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/layout/UserLayout/index.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$index$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/Navbar/index.jsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$index$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$index$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
function UserLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$index$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/layout/UserLayout/index.jsx",
                lineNumber: 7,
                columnNumber: 1
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/layout/UserLayout/index.jsx",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = UserLayout;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/layout/DashboardLayout/index.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "homeContainer": "index-module__H6bjfq__homeContainer",
  "homeContainer__extraContainer": "index-module__H6bjfq__homeContainer__extraContainer",
  "homeContainer__feedContainer": "index-module__H6bjfq__homeContainer__feedContainer",
  "homeContainer__leftBar": "index-module__H6bjfq__homeContainer__leftBar",
  "sideBarOptions": "index-module__H6bjfq__sideBarOptions",
});
}),
"[project]/src/layout/DashboardLayout/index.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/layout/DashboardLayout/index.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__ = __turbopack_context__.i("[externals]/react-redux [external] (react-redux, esm_import, [project]/node_modules/react-redux)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$reducer$2f$authReducer$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/redux/reducer/authReducer/index.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
function DashboardLayout({ children }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__["useDispatch"])();
    const authState = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__["useSelector"])((state)=>state.auth);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (localStorage.getItem("token") === null) {
            router.push("/login");
        }
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$reducer$2f$authReducer$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["setTokenIsThere"])());
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].container,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].homeContainer,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].homeContainer__leftBar,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    onClick: ()=>{
                                        router.push("/dashboard");
                                    },
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sideBarOptions,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            strokeWidth: 1.5,
                                            stroke: "currentColor",
                                            className: "size-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                d: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                            }, void 0, false, {
                                                fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                                                lineNumber: 39,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                                            lineNumber: 31,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: "Home"
                                        }, void 0, false, {
                                            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                                            lineNumber: 46,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                                    lineNumber: 25,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    onClick: ()=>{
                                        router.push("/discover");
                                    },
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sideBarOptions,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            strokeWidth: 1.5,
                                            stroke: "currentColor",
                                            className: "size-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                            }, void 0, false, {
                                                fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                                                lineNumber: 63,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                                            lineNumber: 55,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: "Discover"
                                        }, void 0, false, {
                                            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                                            lineNumber: 69,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                                    lineNumber: 49,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    onClick: ()=>{
                                        router.push("/my_connections");
                                    },
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sideBarOptions,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                            xmlns: "http://www.w3.org/2000/svg",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            strokeWidth: 1.5,
                                            stroke: "currentColor",
                                            className: "size-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                d: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                            }, void 0, false, {
                                                fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                                                lineNumber: 86,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                                            lineNumber: 78,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: "My Connection"
                                        }, void 0, false, {
                                            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                                            lineNumber: 93,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                                    lineNumber: 72,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                            lineNumber: 24,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                        lineNumber: 23,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].homeContainer__feedContainer,
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                        lineNumber: 98,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].homeContainer__extraContainer,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                children: "Top Profiles"
                            }, void 0, false, {
                                fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                                lineNumber: 103,
                                columnNumber: 13
                            }, this),
                            authState.all_profiles_fetched && authState.all_users.map((profiles)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        children: profiles.userId.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                                        lineNumber: 107,
                                        columnNumber: 19
                                    }, this)
                                }, profiles.userId.name, false, {
                                    fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                                    lineNumber: 106,
                                    columnNumber: 17
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                        lineNumber: 102,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                lineNumber: 22,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/layout/DashboardLayout/index.jsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/pages/dashboard/index.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actionButton": "index-module__KVi4QG__actionButton",
  "allCommentsContainer": "index-module__KVi4QG__allCommentsContainer",
  "avatar": "index-module__KVi4QG__avatar",
  "cardBody": "index-module__KVi4QG__cardBody",
  "cardFooter": "index-module__KVi4QG__cardFooter",
  "cardHeader": "index-module__KVi4QG__cardHeader",
  "cardInfo": "index-module__KVi4QG__cardInfo",
  "commentsContainer": "index-module__KVi4QG__commentsContainer",
  "createPostContainer": "index-module__KVi4QG__createPostContainer",
  "deleteButton": "index-module__KVi4QG__deleteButton",
  "fab": "index-module__KVi4QG__fab",
  "postCommentContainer": "index-module__KVi4QG__postCommentContainer",
  "postCommentContainer__commentBtn": "index-module__KVi4QG__postCommentContainer__commentBtn",
  "postMediaContainer": "index-module__KVi4QG__postMediaContainer",
  "postsContainer": "index-module__KVi4QG__postsContainer",
  "scrollComponent": "index-module__KVi4QG__scrollComponent",
  "singleCard": "index-module__KVi4QG__singleCard",
  "textAreaOfContent": "index-module__KVi4QG__textAreaOfContent",
  "uploadButton": "index-module__KVi4QG__uploadButton",
  "userProfile": "index-module__KVi4QG__userProfile",
  "wrapper": "index-module__KVi4QG__wrapper",
});
}),
"[project]/src/pages/dashboard/index.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__ = __turbopack_context__.i("[externals]/react-redux [external] (react-redux, esm_import, [project]/node_modules/react-redux)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$postAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/redux/action/postAction/index.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/redux/action/authAction/index.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$UserLayout$2f$index$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/layout/UserLayout/index.jsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/layout/DashboardLayout/index.jsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/index.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/dashboard/index.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$reducer$2f$authReducer$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/redux/reducer/authReducer/index.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$reducer$2f$postReducer$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/redux/reducer/postReducer/index.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$postAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$UserLayout$2f$index$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$reducer$2f$postReducer$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$postAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$UserLayout$2f$index$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$reducer$2f$postReducer$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function Dashboard() {
    const dispatch = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__["useDispatch"])();
    const authState = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__["useSelector"])((state)=>state.auth);
    const postState = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$redux__$5b$external$5d$__$28$react$2d$redux$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$redux$29$__["useSelector"])((state)=>state.posts);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (authState.isTokenThere) {
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$postAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getAllPost"])());
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getAboutUser"])({
                token: localStorage.getItem("token")
            }));
        }
        if (!authState.all_profile_fetched) {
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getAllUsers"])());
        }
    }, [
        authState.isTokenThere
    ]);
    const [postContent, setPostContent] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [fileContent, setFileContent] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])();
    const [commentText, setCommentText] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const handleUpload = async ()=>{
        await dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$postAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["createPost"])({
            file: fileContent,
            body: postContent
        }));
        setPostContent("");
        setFileContent(null);
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$postAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getAllPost"])());
    };
    const handleDeletePost = async (postId)=>{
        await dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$postAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["deletePost"])({
            postId,
            token: localStorage.getItem("token")
        }));
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$postAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getAllPost"])());
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$UserLayout$2f$index$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$jsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
            children: [
                !authState.user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                    children: "Loading..."
                }, void 0, false, {
                    fileName: "[project]/src/pages/dashboard/index.jsx",
                    lineNumber: 63,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].scrollComponent,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].wrapper,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].createPostContainer,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].userProfile,
                                        src: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["BASE_URL"]}/${authState.user.userId.profilePicture}`,
                                        alt: "Profile"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/dashboard/index.jsx",
                                        lineNumber: 68,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                        onChange: (e)=>setPostContent(e.target.value),
                                        value: postContent,
                                        placeholder: "Start a post",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].textAreaOfContent
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/dashboard/index.jsx",
                                        lineNumber: 73,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        htmlFor: "fileUpload",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].fab,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                                xmlns: "http://www.w3.org/2000/svg",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                strokeWidth: 1.5,
                                                stroke: "currentColor",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    d: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/dashboard/index.jsx",
                                                    lineNumber: 88,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/dashboard/index.jsx",
                                                lineNumber: 81,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/dashboard/index.jsx",
                                            lineNumber: 80,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/dashboard/index.jsx",
                                        lineNumber: 79,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "file",
                                        hidden: true,
                                        id: "fileUpload",
                                        onChange: (e)=>setFileContent(e.target.files[0])
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/dashboard/index.jsx",
                                        lineNumber: 96,
                                        columnNumber: 17
                                    }, this),
                                    postContent.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        onClick: handleUpload,
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].uploadButton,
                                        children: "Post"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/dashboard/index.jsx",
                                        lineNumber: 103,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/dashboard/index.jsx",
                                lineNumber: 67,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].postsContainer,
                                children: postState.posts.map((post)=>{
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].singleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardHeader,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                        src: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["BASE_URL"]}/${post.userId.profilePicture}`,
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].avatar,
                                                        alt: "Profile"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/dashboard/index.jsx",
                                                        lineNumber: 114,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardInfo,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                children: post.userId.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/dashboard/index.jsx",
                                                                lineNumber: 120,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                children: [
                                                                    "@",
                                                                    post.userId.username
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/dashboard/index.jsx",
                                                                lineNumber: 121,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/dashboard/index.jsx",
                                                        lineNumber: 119,
                                                        columnNumber: 25
                                                    }, this),
                                                    authState.user.userId._id === post.userId._id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        onClick: ()=>handleDeletePost(post._id),
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].deleteButton,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                                            xmlns: "http://www.w3.org/2000/svg",
                                                            fill: "none",
                                                            viewBox: "0 0 24 24",
                                                            strokeWidth: 1.5,
                                                            stroke: "currentColor",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/dashboard/index.jsx",
                                                                lineNumber: 135,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/dashboard/index.jsx",
                                                            lineNumber: 128,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/dashboard/index.jsx",
                                                        lineNumber: 124,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/dashboard/index.jsx",
                                                lineNumber: 113,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardBody,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        children: post.body
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/dashboard/index.jsx",
                                                        lineNumber: 146,
                                                        columnNumber: 25
                                                    }, this),
                                                    post.media && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].postMediaContainer,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                            src: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["BASE_URL"]}/${post.media}`,
                                                            alt: "Post Media"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/dashboard/index.jsx",
                                                            lineNumber: 149,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/dashboard/index.jsx",
                                                        lineNumber: 148,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/dashboard/index.jsx",
                                                lineNumber: 145,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].cardFooter,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        onClick: async ()=>{
                                                            await dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$postAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["incrementLike"])({
                                                                post_id: post._id
                                                            }));
                                                            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$postAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getAllPost"])());
                                                        },
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].actionButton,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                fill: "none",
                                                                viewBox: "0 0 24 24",
                                                                strokeWidth: 1.5,
                                                                stroke: "currentColor",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    d: "M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.247-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.176.405.278.602.282.543.654.914 1.144.914H8c.55 0 .905-.398 1.022-1.002a7.59 7.59 0 00.125-1.524 3.126 3.126 0 00.312-3.575C8.379 11.121 7.239 10.5 5.904 10.5H5.197"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/dashboard/index.jsx",
                                                                    lineNumber: 174,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/dashboard/index.jsx",
                                                                lineNumber: 167,
                                                                columnNumber: 27
                                                            }, this),
                                                            post.likes,
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                children: "Like"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/dashboard/index.jsx",
                                                                lineNumber: 181,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/dashboard/index.jsx",
                                                        lineNumber: 158,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        onClick: ()=>{
                                                            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$postAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getAllComments"])({
                                                                post_id: post._id
                                                            }));
                                                        },
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].actionButton,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                fill: "none",
                                                                viewBox: "0 0 24 24",
                                                                strokeWidth: 1.5,
                                                                stroke: "currentColor",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    d: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/dashboard/index.jsx",
                                                                    lineNumber: 200,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/dashboard/index.jsx",
                                                                lineNumber: 193,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                children: "Comment"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/dashboard/index.jsx",
                                                                lineNumber: 206,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/dashboard/index.jsx",
                                                        lineNumber: 183,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        onClick: ()=>{
                                                            const text = encodeURIComponent(post.body);
                                                            const url = encodeURIComponent("apnacollege.com");
                                                            const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                                                            window.open(twitterUrl, "_blank");
                                                        },
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].actionButton,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                                                xmlns: "http://www.w3.org/2000/svg",
                                                                transform: "rotate(-45)",
                                                                fill: "none",
                                                                viewBox: "0 0 24 24",
                                                                strokeWidth: 1.5,
                                                                stroke: "currentColor",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                                                    strokeLinecap: "round",
                                                                    strokeLinejoin: "round",
                                                                    d: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/dashboard/index.jsx",
                                                                    lineNumber: 241,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/dashboard/index.jsx",
                                                                lineNumber: 233,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                children: "Send"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/dashboard/index.jsx",
                                                                lineNumber: 247,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/dashboard/index.jsx",
                                                        lineNumber: 224,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/dashboard/index.jsx",
                                                lineNumber: 157,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, post._id, true, {
                                        fileName: "[project]/src/pages/dashboard/index.jsx",
                                        lineNumber: 112,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/pages/dashboard/index.jsx",
                                lineNumber: 109,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/dashboard/index.jsx",
                        lineNumber: 66,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/dashboard/index.jsx",
                    lineNumber: 65,
                    columnNumber: 11
                }, this),
                postState.postId !== "" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    onClick: ()=>{
                        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$reducer$2f$postReducer$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["resetPostId"])());
                    },
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].commentsContainer,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            onClick: (e)=>{
                                e.stopPropagation();
                            },
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].allCommentsContainer,
                            children: [
                                postState.comments.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    children: " No Comments"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/dashboard/index.jsx",
                                    lineNumber: 271,
                                    columnNumber: 53
                                }, this),
                                postState.comments.length !== 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: postState.comments.map((comment, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].singleCommentContainer,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                    src: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["BASE_URL"]}/${comment.userId.profilePicture}`,
                                                    alt: "Post Media"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/dashboard/index.jsx",
                                                    lineNumber: 276,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontWeight: "bold",
                                                        fontSize: "1.2rem"
                                                    },
                                                    children: comment.userId.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/dashboard/index.jsx",
                                                    lineNumber: 280,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    children: [
                                                        "@",
                                                        comment.userId.username
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/dashboard/index.jsx",
                                                    lineNumber: 281,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/dashboard/index.jsx",
                                            lineNumber: 275,
                                            columnNumber: 23
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/dashboard/index.jsx",
                                    lineNumber: 273,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].postCommentContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "text ",
                                            value: commentText,
                                            onChange: (e)=>setCommentText(e.target.value),
                                            placeholder: "Comment"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/dashboard/index.jsx",
                                            lineNumber: 288,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            onClick: async ()=>{
                                                await dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$postAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["postComment"])({
                                                    post_id: postState.postId,
                                                    body: commentText
                                                }));
                                                await dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$postAction$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getAllComments"])({
                                                    post_id: postState.postId
                                                }));
                                            },
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$dashboard$2f$index$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].postCommentContainer__commentBtn,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                children: "Comment"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/dashboard/index.jsx",
                                                lineNumber: 308,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/dashboard/index.jsx",
                                            lineNumber: 294,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/dashboard/index.jsx",
                                    lineNumber: 287,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/dashboard/index.jsx",
                            lineNumber: 265,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/dashboard/index.jsx",
                        lineNumber: 264,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/dashboard/index.jsx",
                    lineNumber: 258,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/dashboard/index.jsx",
            lineNumber: 61,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/pages/dashboard/index.jsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = Dashboard;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1821d501._.js.map