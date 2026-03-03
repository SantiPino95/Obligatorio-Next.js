(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAPI",
    ()=>fetchAPI
]);
// src/services/api.js
const API_BASE_URL = 'https://api-react-taller-production.up.railway.app';
const fetchAPI = async (endpoint, options = {})=>{
    const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('token') : "TURBOPACK unreachable";
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('📍 fetchAPI llamando a:', url);
    const headers = {
        'Content-Type': 'application/json',
        ...token && {
            'Authorization': `Bearer ${token}`
        },
        ...options.headers
    };
    try {
        const res = await fetch(url, {
            ...options,
            headers
        });
        console.log('📍 Status:', res.status);
        const text = await res.text();
        console.log('📍 Respuesta texto:', text.substring(0, 200)); // Primeros 200 caracteres
        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${text}`);
        }
        // Intentar parsear JSON
        try {
            const data = JSON.parse(text);
            return data;
        } catch (e) {
            console.error('📍 No es JSON válido:', text);
            return text;
        }
    } catch (error) {
        console.error('📍 Error en fetchAPI:', error);
        throw error;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/authService.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authService",
    ()=>authService
]);
// src/services/authService.js
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.js [app-client] (ecmascript)");
;
const authService = {
    // POST /api/auth/register - REGISTRO REAL
    register: async (userData)=>{
        // userData debe tener: { username, name, password }
        console.log('📍 Registrando usuario:', userData);
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAPI"])('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({
                    username: userData.username,
                    name: userData.name,
                    password: userData.password
                })
            });
            console.log('📍 Respuesta registro:', response);
            return response;
        } catch (error) {
            console.error('📍 Error en registro:', error);
            throw error;
        }
    },
    // POST /api/auth/login - LOGIN REAL
    login: async (credentials)=>{
        // credentials debe tener: { username, password }
        console.log('📍 Iniciando sesión:', credentials.username);
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAPI"])('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: credentials.username,
                    password: credentials.password
                })
            });
            console.log('📍 Respuesta login:', response);
            return response;
        } catch (error) {
            console.error('📍 Error en login:', error);
            throw error;
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/AuthContext.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthContext",
    ()=>AuthContext,
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/authService.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])();
const AuthProvider = ({ children })=>{
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (token && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    console.log('📍 Usuario recuperado:', parsedUser);
                    // ✅ CORRECCIÓN: parsedUser YA debería ser el usuario directo
                    setUser(parsedUser);
                } catch (e) {
                    console.error('Error parsing user:', e);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        }
    }["AuthProvider.useEffect"], []);
    const login = async (username, password)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].login({
                username,
                password
            });
            console.log('📍 Respuesta login:', response);
            // ✅ CORRECCIÓN: Extraer el usuario de la respuesta
            const { token, user: userData } = response;
            // Guardar SOLO userData, no { user: userData }
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData)); // 👈 Así: userData directo
            setUser(userData); // 👈 Así: userData directo
            return response;
        } catch (err) {
            console.error('📍 Error:', err);
            throw err;
        }
    };
    // En el registro (similar):
    const register = async (username, name, password)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].register({
                username,
                name,
                password
            });
            console.log('📍 Respuesta registro:', response);
            if (response.token) {
                const { token, user: userData } = response;
                // ✅ CORRECCIÓN: Guardar userData directo
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData)); // 👈 Así
                setUser(userData); // 👈 Así
            }
            return response;
        } catch (err) {
            console.error('📍 Error:', err);
            throw err;
        }
    };
    const logout = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            loading,
            error,
            login,
            register,
            logout
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AuthContext.jsx",
        lineNumber: 86,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AuthProvider, "6RFyu9sagNamVh1bs25TQK7ZGok=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_29f30dad._.js.map