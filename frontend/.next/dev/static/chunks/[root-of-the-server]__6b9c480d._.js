(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/src/Component/Navbar/styles.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "buttonJoin": "styles-module__2oEZSG__buttonJoin",
  "container": "styles-module__2oEZSG__container",
  "navBaroptionContainer": "styles-module__2oEZSG__navBaroptionContainer",
  "navbar": "styles-module__2oEZSG__navbar",
});
}),
"[project]/src/Component/Navbar/index.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/compiler-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$styles$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/Component/Navbar/styles.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const NavbarComponent = ()=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(12);
    if ($[0] !== "77ad23c2ccbdd259bc720555455522b1981c9be6a0a4d91ff0d1d43573dff99b") {
        for(let $i = 0; $i < 12; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "77ad23c2ccbdd259bc720555455522b1981c9be6a0a4d91ff0d1d43573dff99b";
    }
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = {
            cursor: "pointer"
        };
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    let t1;
    if ($[2] !== router) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            style: t0,
            onClick: ()=>{
                router.push("/");
            },
            children: "Pro Connect"
        }, void 0, false, {
            fileName: "[project]/src/Component/Navbar/index.jsx",
            lineNumber: 25,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[2] = router;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    let t2;
    if ($[4] !== router) {
        t2 = ()=>{
            router.push("/login");
        };
        $[4] = router;
        $[5] = t2;
    } else {
        t2 = $[5];
    }
    let t3;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: " Be a Part"
        }, void 0, false, {
            fileName: "[project]/src/Component/Navbar/index.jsx",
            lineNumber: 45,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] !== t2) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$styles$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navBaroptionContainer,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: t2,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$styles$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].buttonJoin,
                children: t3
            }, void 0, false, {
                fileName: "[project]/src/Component/Navbar/index.jsx",
                lineNumber: 52,
                columnNumber: 56
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/Component/Navbar/index.jsx",
            lineNumber: 52,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[7] = t2;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    let t5;
    if ($[9] !== t1 || $[10] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$styles$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$styles$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navbar,
                    children: [
                        t1,
                        t4
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/Component/Navbar/index.jsx",
                    lineNumber: 60,
                    columnNumber: 46
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/Component/Navbar/index.jsx",
                lineNumber: 60,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false);
        $[9] = t1;
        $[10] = t4;
        $[11] = t5;
    } else {
        t5 = $[11];
    }
    return t5;
};
_s(NavbarComponent, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = NavbarComponent;
const __TURBOPACK__default__export__ = NavbarComponent;
var _c;
__turbopack_context__.k.register(_c, "NavbarComponent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/layout/UserLayout/index.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/compiler-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$index$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/Navbar/index.jsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
;
;
;
function UserLayout(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(4);
    if ($[0] !== "3eca6a50c731e2615be8458c98cd7352dbcb1f1c48738b413e15da09c90b70ba") {
        for(let $i = 0; $i < 4; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "3eca6a50c731e2615be8458c98cd7352dbcb1f1c48738b413e15da09c90b70ba";
    }
    const { children } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$index$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/layout/UserLayout/index.jsx",
            lineNumber: 17,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    let t2;
    if ($[2] !== children) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t1,
                children
            ]
        }, void 0, true, {
            fileName: "[project]/src/layout/UserLayout/index.jsx",
            lineNumber: 24,
            columnNumber: 10
        }, this);
        $[2] = children;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    return t2;
}
_c = UserLayout;
const __TURBOPACK__default__export__ = UserLayout;
var _c;
__turbopack_context__.k.register(_c, "UserLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/config/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clientServer",
    ()=>clientServer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
;
const clientServer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: "http://localhost:9090"
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/config/redux/action/authAction/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "loginUser",
    ()=>loginUser,
    "registerUser",
    ()=>registerUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/index.js [client] (ecmascript)");
;
;
const loginUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("user/login", async (user, thunkAPI)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clientServer"].post(`/login`, {
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
const registerUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("user/register", async (user, thunkAPI)=>{
    try {
        const request = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clientServer"].post("/register", {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/login/style.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "buttonWithOutline": "style-module__cXfOGG__buttonWithOutline",
  "cardContainer": "style-module__cXfOGG__cardContainer",
  "cardContainer_left": "style-module__cXfOGG__cardContainer_left",
  "cardContainer_right": "style-module__cXfOGG__cardContainer_right",
  "cardleft_heading": "style-module__cXfOGG__cardleft_heading",
  "container": "style-module__cXfOGG__container",
  "inputContainer": "style-module__cXfOGG__inputContainer",
  "inputField": "style-module__cXfOGG__inputField",
  "inputRow": "style-module__cXfOGG__inputRow",
});
}),
"[project]/src/config/redux/reducer/authReducer/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "emptyMessage",
    ()=>emptyMessage,
    "reset",
    ()=>reset
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/redux/action/authAction/index.js [client] (ecmascript)");
;
;
const initialState = {
    user: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    LoggedIn: false,
    message: "",
    profileFetched: false,
    connections: [],
    connectionRequests: []
};
const authSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "auth",
    initialState,
    reducer: {
        reset: ()=>initialState,
        handleLoginuser: (state)=>{
            state.message = {
                message: "hello"
            };
        },
        emptyMessage: (state)=>{
            state.message = {
                message: ""
            };
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["loginUser"].pending, (state)=>{
            state.isLoading = true, state.message = {
                message: "Knocking the door..."
            };
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["loginUser"].fulfilled, (state, action)=>{
            state.isLoading = false, state.isError = false, state.isSuccess = true, state.LoggedIn = true, state.message = {
                message: "Login Successful"
            };
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["registerUser"].fulfilled, (state, action)=>{
            state.isLoading = false, state.isError = false, state.isSuccess = true, state.message = {
                message: "Registeration is Succesfull, Please log-in     "
            };
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["loginUser"].rejected, (state, action)=>{
            state.isLoading = false, state.isError = true, state.message = action.payload;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["registerUser"].pending, (state)=>{
            state.isLoading = true, state.message = {
                message: "Registering you..."
            };
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["registerUser"].rejected, (state, action)=>{
            state.isLoading = false, state.isError = true, state.message = action.payload;
        });
    }
});
const { reset, emptyMessage } = authSlice.actions;
const __TURBOPACK__default__export__ = authSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/login/index.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/compiler-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$UserLayout$2f$index$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/layout/UserLayout/index.jsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/redux/action/authAction/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$login$2f$style$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/login/style.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$reducer$2f$authReducer$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/redux/reducer/authReducer/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
const LoginComponent = ()=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(71);
    if ($[0] !== "4fc08fccce9efdf274f9792e0cbeb67748d5de139771b4f8ad913434e75b2c28") {
        for(let $i = 0; $i < 71; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "4fc08fccce9efdf274f9792e0cbeb67748d5de139771b4f8ad913434e75b2c28";
    }
    const authState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useSelector"])(_temp);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const dispath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useDispatch"])();
    const [isLoginMethod, setIsLoginMethod] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [email, setEmailAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    let t0;
    if ($[1] !== authState.LoggedIn || $[2] !== router) {
        t0 = ()=>{
            if (authState.LoggedIn) {
                router.push("/dashboard");
            }
        };
        $[1] = authState.LoggedIn;
        $[2] = router;
        $[3] = t0;
    } else {
        t0 = $[3];
    }
    let t1;
    if ($[4] !== authState.LoggedIn) {
        t1 = [
            authState.LoggedIn
        ];
        $[4] = authState.LoggedIn;
        $[5] = t1;
    } else {
        t1 = $[5];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t1);
    let t2;
    if ($[6] !== isLoginMethod) {
        t2 = [
            isLoginMethod
        ];
        $[6] = isLoginMethod;
        $[7] = t2;
    } else {
        t2 = $[7];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])(_temp2, t2);
    let t3;
    if ($[8] !== dispath || $[9] !== email || $[10] !== name || $[11] !== password || $[12] !== username) {
        t3 = ()=>{
            console.log("Registring.... ");
            dispath((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["registerUser"])({
                username,
                password,
                email,
                name
            }));
        };
        $[8] = dispath;
        $[9] = email;
        $[10] = name;
        $[11] = password;
        $[12] = username;
        $[13] = t3;
    } else {
        t3 = $[13];
    }
    const handleRegister = t3;
    let t4;
    if ($[14] !== dispath || $[15] !== email || $[16] !== name || $[17] !== password || $[18] !== username) {
        t4 = ()=>{
            console.log("Login....");
            dispath((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["loginUser"])({
                username,
                password,
                email,
                name
            }));
        };
        $[14] = dispath;
        $[15] = email;
        $[16] = name;
        $[17] = password;
        $[18] = username;
        $[19] = t4;
    } else {
        t4 = $[19];
    }
    const handleLogin = t4;
    const t5 = isLoginMethod ? "Login" : "Sign Up";
    let t6;
    if ($[20] !== t5) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$login$2f$style$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardleft_heading,
            children: t5
        }, void 0, false, {
            fileName: "[project]/src/pages/login/index.jsx",
            lineNumber: 101,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[20] = t5;
        $[21] = t6;
    } else {
        t6 = $[21];
    }
    const t7 = authState.isError ? "red" : "green";
    let t8;
    if ($[22] !== t7) {
        t8 = {
            color: t7
        };
        $[22] = t7;
        $[23] = t8;
    } else {
        t8 = $[23];
    }
    let t9;
    if ($[24] !== authState.message.message || $[25] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            style: t8,
            children: [
                " ",
                authState.message.message,
                " "
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/login/index.jsx",
            lineNumber: 120,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[24] = authState.message.message;
        $[25] = t8;
        $[26] = t9;
    } else {
        t9 = $[26];
    }
    let t10;
    if ($[27] !== isLoginMethod || $[28] !== name || $[29] !== username) {
        t10 = !isLoginMethod && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$login$2f$style$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputRow,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    value: username,
                    onChange: (e)=>setUsername(e.target.value),
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$login$2f$style$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputField,
                    type: "text",
                    placeholder: "Username"
                }, void 0, false, {
                    fileName: "[project]/src/pages/login/index.jsx",
                    lineNumber: 129,
                    columnNumber: 62
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    value: name,
                    onChange: (e_0)=>setName(e_0.target.value),
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$login$2f$style$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputField,
                    type: "text",
                    placeholder: "Name"
                }, void 0, false, {
                    fileName: "[project]/src/pages/login/index.jsx",
                    lineNumber: 129,
                    columnNumber: 197
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/login/index.jsx",
            lineNumber: 129,
            columnNumber: 29
        }, ("TURBOPACK compile-time value", void 0));
        $[27] = isLoginMethod;
        $[28] = name;
        $[29] = username;
        $[30] = t10;
    } else {
        t10 = $[30];
    }
    let t11;
    if ($[31] === Symbol.for("react.memo_cache_sentinel")) {
        t11 = (e_1)=>setEmailAddress(e_1.target.value);
        $[31] = t11;
    } else {
        t11 = $[31];
    }
    let t12;
    if ($[32] !== email) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            value: email,
            onChange: t11,
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$login$2f$style$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputField,
            type: "email",
            placeholder: "email"
        }, void 0, false, {
            fileName: "[project]/src/pages/login/index.jsx",
            lineNumber: 146,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[32] = email;
        $[33] = t12;
    } else {
        t12 = $[33];
    }
    let t13;
    if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
        t13 = (e_2)=>setPassword(e_2.target.value);
        $[34] = t13;
    } else {
        t13 = $[34];
    }
    let t14;
    if ($[35] !== password) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
            value: password,
            onChange: t13,
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$login$2f$style$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputField,
            type: "password",
            placeholder: "Password"
        }, void 0, false, {
            fileName: "[project]/src/pages/login/index.jsx",
            lineNumber: 161,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[35] = password;
        $[36] = t14;
    } else {
        t14 = $[36];
    }
    let t15;
    if ($[37] !== handleLogin || $[38] !== handleRegister || $[39] !== isLoginMethod) {
        t15 = ()=>{
            if (isLoginMethod) {
                handleLogin();
            } else {
                handleRegister();
            }
        };
        $[37] = handleLogin;
        $[38] = handleRegister;
        $[39] = isLoginMethod;
        $[40] = t15;
    } else {
        t15 = $[40];
    }
    const t16 = isLoginMethod ? "Login" : "Sign Up";
    let t17;
    if ($[41] !== t16) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: t16
        }, void 0, false, {
            fileName: "[project]/src/pages/login/index.jsx",
            lineNumber: 186,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[41] = t16;
        $[42] = t17;
    } else {
        t17 = $[42];
    }
    let t18;
    if ($[43] !== t15 || $[44] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: t15,
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$login$2f$style$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].buttonWithOutline,
            type: "submit",
            children: t17
        }, void 0, false, {
            fileName: "[project]/src/pages/login/index.jsx",
            lineNumber: 194,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[43] = t15;
        $[44] = t17;
        $[45] = t18;
    } else {
        t18 = $[45];
    }
    let t19;
    if ($[46] !== t10 || $[47] !== t12 || $[48] !== t14 || $[49] !== t18) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$login$2f$style$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputContainer,
            children: [
                t10,
                t12,
                t14,
                t18
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/login/index.jsx",
            lineNumber: 203,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[46] = t10;
        $[47] = t12;
        $[48] = t14;
        $[49] = t18;
        $[50] = t19;
    } else {
        t19 = $[50];
    }
    let t20;
    if ($[51] !== t19 || $[52] !== t6 || $[53] !== t9) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$login$2f$style$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardContainer_left,
            children: [
                t6,
                t9,
                t19
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/login/index.jsx",
            lineNumber: 214,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[51] = t19;
        $[52] = t6;
        $[53] = t9;
        $[54] = t20;
    } else {
        t20 = $[54];
    }
    const t21 = isLoginMethod ? "Don't have an account?" : "Already have an account?";
    let t22;
    if ($[55] !== t21) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: t21
        }, void 0, false, {
            fileName: "[project]/src/pages/login/index.jsx",
            lineNumber: 225,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[55] = t21;
        $[56] = t22;
    } else {
        t22 = $[56];
    }
    let t23;
    if ($[57] !== isLoginMethod) {
        t23 = ()=>{
            setIsLoginMethod(!isLoginMethod);
        };
        $[57] = isLoginMethod;
        $[58] = t23;
    } else {
        t23 = $[58];
    }
    let t24;
    if ($[59] === Symbol.for("react.memo_cache_sentinel")) {
        t24 = {
            color: "black",
            textAlign: "center"
        };
        $[59] = t24;
    } else {
        t24 = $[59];
    }
    const t25 = isLoginMethod ? "Sign Up" : "Login";
    let t26;
    if ($[60] !== t25) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: [
                t25,
                "  "
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/login/index.jsx",
            lineNumber: 254,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[60] = t25;
        $[61] = t26;
    } else {
        t26 = $[61];
    }
    let t27;
    if ($[62] !== t23 || $[63] !== t26) {
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: t23,
            style: t24,
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$login$2f$style$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].buttonWithOutline,
            type: "submit",
            children: t26
        }, void 0, false, {
            fileName: "[project]/src/pages/login/index.jsx",
            lineNumber: 262,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[62] = t23;
        $[63] = t26;
        $[64] = t27;
    } else {
        t27 = $[64];
    }
    let t28;
    if ($[65] !== t22 || $[66] !== t27) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$login$2f$style$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardContainer_right,
            children: [
                t22,
                t27
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/login/index.jsx",
            lineNumber: 271,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[65] = t22;
        $[66] = t27;
        $[67] = t28;
    } else {
        t28 = $[67];
    }
    let t29;
    if ($[68] !== t20 || $[69] !== t28) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$UserLayout$2f$index$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$login$2f$style$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$login$2f$style$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].cardContainer,
                    children: [
                        t20,
                        t28
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/login/index.jsx",
                    lineNumber: 280,
                    columnNumber: 57
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/pages/login/index.jsx",
                lineNumber: 280,
                columnNumber: 23
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/pages/login/index.jsx",
            lineNumber: 280,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[68] = t20;
        $[69] = t28;
        $[70] = t29;
    } else {
        t29 = $[70];
    }
    return t29;
};
_s(LoginComponent, "px7SoqLmLEIAKIgvY38NHOssFOM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useDispatch"]
    ];
});
_c = LoginComponent;
const __TURBOPACK__default__export__ = LoginComponent;
function _temp(state) {
    return state.auth;
}
function _temp2() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$reducer$2f$authReducer$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["emptyMessage"])();
}
var _c;
__turbopack_context__.k.register(_c, "LoginComponent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/login/index.jsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/login";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/login/index.jsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/login/index.jsx\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/login/index.jsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__6b9c480d._.js.map