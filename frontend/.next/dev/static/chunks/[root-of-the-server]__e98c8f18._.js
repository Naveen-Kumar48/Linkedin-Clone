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
"[project]/src/config/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BASE_URL",
    ()=>BASE_URL,
    "clientServer",
    ()=>clientServer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
;
const BASE_URL = 'https://linkedin-clone-4gta.onrender.com';
const clientServer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: BASE_URL
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/layout/DashboardLayout/index.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "homeContainer": "index-module__H6bjfq__homeContainer",
  "homeContainer__extraContainer": "index-module__H6bjfq__homeContainer__extraContainer",
  "homeContainer__feedContainer": "index-module__H6bjfq__homeContainer__feedContainer",
  "homeContainer__leftBar": "index-module__H6bjfq__homeContainer__leftBar",
  "mobileNavbarView": "index-module__H6bjfq__mobileNavbarView",
  "sideBarOptions": "index-module__H6bjfq__sideBarOptions",
  "singleNavabrItemHolder_mobileView": "index-module__H6bjfq__singleNavabrItemHolder_mobileView",
});
}),
"[project]/src/config/redux/action/authAction/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "acceptConnectionRequest",
    ()=>acceptConnectionRequest,
    "getAboutUser",
    ()=>getAboutUser,
    "getAllUsers",
    ()=>getAllUsers,
    "getConnectionsRequest",
    ()=>getConnectionsRequest,
    "getMyConnectionRequests",
    ()=>getMyConnectionRequests,
    "loginUser",
    ()=>loginUser,
    "registerUser",
    ()=>registerUser,
    "sendConnectionRequest",
    ()=>sendConnectionRequest
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
const getAboutUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("user/getAboutUser", async (user, thunkAPI)=>{
    try {
        // console.log(user.token)
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clientServer"].get("/getuser_profile", {
            params: {
                token: user.token
            }
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
const getAllUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("user/getAllUsers", async (user, thunkAPI)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clientServer"].get("user/get_allusers", {
            params: {
                token: user?.token
            }
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
const sendConnectionRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("user/sendConnectionRequest", async (user, thunkAPI)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clientServer"].post("/user/send_connection_request", {
            token: user.token,
            connectionId: user.connectionId
        });
        thunkAPI.dispatch(getConnectionsRequest({
            token: user.token
        }));
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});
const getConnectionsRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("user/getConnectionsRequest", async (user, thunkAPI)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clientServer"].get("/user/getConnectionRequest", {
            params: {
                token: user.token
            }
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});
const getMyConnectionRequests = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("/user/getConnectionRequest", async (user, thunkAPI)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clientServer"].get("/user/user_connection_request", {
            params: {
                token: user.token
            }
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});
const acceptConnectionRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("user/acceptConnectionRequest", async (user, thunkAPI)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clientServer"].post("/user/accept_connection_request", {
            token: user.token,
            requestId: user.connectionId,
            action_type: user.action
        });
        thunkAPI.dispatch(getConnectionsRequest({
            token: user.token
        }));
        thunkAPI.dispatch(getMyConnectionRequests({
            token: user.token
        }));
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/config/redux/reducer/authReducer/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "emptyMessage",
    ()=>emptyMessage,
    "reset",
    ()=>reset,
    "setTokenIsNotThere",
    ()=>setTokenIsNotThere,
    "setTokenIsThere",
    ()=>setTokenIsThere
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/redux/action/authAction/index.js [client] (ecmascript)");
;
;
const initialState = {
    user: undefined,
    isError: false,
    isLoading: false,
    isSuccess: false,
    isTokenThere: false,
    LoggedIn: false,
    message: "",
    profileFetched: false,
    connections: [],
    connectionRequests: [],
    all_users: [],
    all_profiles_fetched: false
};
const authSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "auth",
    initialState,
    reducers: {
        reset: ()=>initialState,
        handleLoginuser: (state)=>{
            state.message = {
                message: "hello"
            };
        },
        emptyMessage: (state)=>{
            state.message = "";
        },
        setTokenIsThere: (state)=>{
            state.isTokenThere = true;
        },
        setTokenIsNotThere: (state)=>{
            state.isTokenThere = false;
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
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["registerUser"].rejected, (state, action)=>{
            state.isLoading = false, state.isError = true, state.message = action.payload;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getAboutUser"].fulfilled, (state, action)=>{
            state.isLoading = false, state.isError = false, state.profileFetched = true, state.user = action.payload;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getAllUsers"].fulfilled, (state, action)=>{
            state.isLoading = false, state.isError = false, state.all_profiles_fetched = true, state.all_users = action.payload.profiles;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getConnectionsRequest"].fulfilled, (state, action)=>{
            state.connections = action.payload;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getConnectionsRequest"].rejected, (state, action)=>{
            state.message = action.payload;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getMyConnectionRequests"].fulfilled, (state, action)=>{
            state.connections = action.payload;
        }).addCase(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getMyConnectionRequests"].rejected, (state, action)=>{
            state.message = action.payload;
        });
    }
});
const { reset, emptyMessage, setTokenIsThere, setTokenIsNotThere } = authSlice.actions;
const __TURBOPACK__default__export__ = authSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/layout/DashboardLayout/index.jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/compiler-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/layout/DashboardLayout/index.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [client] (ecmascript)");
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
function DashboardLayout(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(73);
    if ($[0] !== "aea308a2006a346da0527b33d8a1642aadf3aa98c0d9a2e896c3867c552e8f21") {
        for(let $i = 0; $i < 73; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "aea308a2006a346da0527b33d8a1642aadf3aa98c0d9a2e896c3867c552e8f21";
    }
    const { children } = t0;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useDispatch"])();
    const authState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useSelector"])(_DashboardLayoutUseSelector);
    let t1;
    if ($[1] !== dispatch || $[2] !== router) {
        t1 = ({
            "DashboardLayout[useEffect()]": ()=>{
                if (localStorage.getItem("token") === null) {
                    router.push("/login");
                }
                dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$reducer$2f$authReducer$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["setTokenIsThere"])());
            }
        })["DashboardLayout[useEffect()]"];
        $[1] = dispatch;
        $[2] = router;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    let t2;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = [];
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    let t3;
    if ($[5] !== router) {
        t3 = ({
            "DashboardLayout[<div>.onClick]": ()=>{
                router.push("/dashboard");
            }
        })["DashboardLayout[<div>.onClick]"];
        $[5] = router;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    let t5;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: 1.5,
            stroke: "currentColor",
            className: "size-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            }, void 0, false, {
                fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                lineNumber: 62,
                columnNumber: 141
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 62,
            columnNumber: 10
        }, this);
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: "Home"
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 63,
            columnNumber: 10
        }, this);
        $[7] = t4;
        $[8] = t5;
    } else {
        t4 = $[7];
        t5 = $[8];
    }
    let t6;
    if ($[9] !== t3) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            onClick: t3,
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sideBarOptions,
            children: [
                t4,
                t5
            ]
        }, void 0, true, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 72,
            columnNumber: 10
        }, this);
        $[9] = t3;
        $[10] = t6;
    } else {
        t6 = $[10];
    }
    let t7;
    if ($[11] !== router) {
        t7 = ({
            "DashboardLayout[<div>.onClick]": ()=>{
                router.push("/discover");
            }
        })["DashboardLayout[<div>.onClick]"];
        $[11] = router;
        $[12] = t7;
    } else {
        t7 = $[12];
    }
    let t8;
    let t9;
    if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: 1.5,
            stroke: "currentColor",
            className: "size-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            }, void 0, false, {
                fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                lineNumber: 93,
                columnNumber: 141
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 93,
            columnNumber: 10
        }, this);
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: "Discover"
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 94,
            columnNumber: 10
        }, this);
        $[13] = t8;
        $[14] = t9;
    } else {
        t8 = $[13];
        t9 = $[14];
    }
    let t10;
    if ($[15] !== t7) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            onClick: t7,
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sideBarOptions,
            children: [
                t8,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 103,
            columnNumber: 11
        }, this);
        $[15] = t7;
        $[16] = t10;
    } else {
        t10 = $[16];
    }
    let t11;
    if ($[17] !== router) {
        t11 = ({
            "DashboardLayout[<div>.onClick]": ()=>{
                router.push("/my_connections");
            }
        })["DashboardLayout[<div>.onClick]"];
        $[17] = router;
        $[18] = t11;
    } else {
        t11 = $[18];
    }
    let t12;
    let t13;
    if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: 1.5,
            stroke: "currentColor",
            className: "size-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            }, void 0, false, {
                fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                lineNumber: 124,
                columnNumber: 142
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 124,
            columnNumber: 11
        }, this);
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: "My Connection"
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 125,
            columnNumber: 11
        }, this);
        $[19] = t12;
        $[20] = t13;
    } else {
        t12 = $[19];
        t13 = $[20];
    }
    let t14;
    if ($[21] !== t11) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            onClick: t11,
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sideBarOptions,
            children: [
                t12,
                t13
            ]
        }, void 0, true, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 134,
            columnNumber: 11
        }, this);
        $[21] = t11;
        $[22] = t14;
    } else {
        t14 = $[22];
    }
    let t15;
    if ($[23] !== t10 || $[24] !== t14 || $[25] !== t6) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].homeContainer__leftBar,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    t6,
                    t10,
                    t14
                ]
            }, void 0, true, {
                fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                lineNumber: 142,
                columnNumber: 58
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 142,
            columnNumber: 11
        }, this);
        $[23] = t10;
        $[24] = t14;
        $[25] = t6;
        $[26] = t15;
    } else {
        t15 = $[26];
    }
    let t16;
    if ($[27] !== children) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].homeContainer__feedContainer,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 152,
            columnNumber: 11
        }, this);
        $[27] = children;
        $[28] = t16;
    } else {
        t16 = $[28];
    }
    let t17;
    if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            children: "Top Profiles"
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 160,
            columnNumber: 11
        }, this);
        $[29] = t17;
    } else {
        t17 = $[29];
    }
    let t18;
    if ($[30] !== authState.all_profiles_fetched || $[31] !== authState.all_users) {
        t18 = authState.all_profiles_fetched && authState.all_users.map(_DashboardLayoutAuthStateAll_usersMap);
        $[30] = authState.all_profiles_fetched;
        $[31] = authState.all_users;
        $[32] = t18;
    } else {
        t18 = $[32];
    }
    let t19;
    if ($[33] !== t18) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].homeContainer__extraContainer,
            children: [
                t17,
                t18
            ]
        }, void 0, true, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 176,
            columnNumber: 11
        }, this);
        $[33] = t18;
        $[34] = t19;
    } else {
        t19 = $[34];
    }
    let t20;
    if ($[35] !== t15 || $[36] !== t16 || $[37] !== t19) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].container,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].homeContainer,
                children: [
                    t15,
                    t16,
                    t19
                ]
            }, void 0, true, {
                fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                lineNumber: 184,
                columnNumber: 45
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 184,
            columnNumber: 11
        }, this);
        $[35] = t15;
        $[36] = t16;
        $[37] = t19;
        $[38] = t20;
    } else {
        t20 = $[38];
    }
    let t21;
    if ($[39] !== router) {
        t21 = ({
            "DashboardLayout[<div>.onClick]": ()=>{
                router.push("/dashboard");
            }
        })["DashboardLayout[<div>.onClick]"];
        $[39] = router;
        $[40] = t21;
    } else {
        t21 = $[40];
    }
    let t22;
    let t23;
    if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: 1.5,
            stroke: "currentColor",
            className: "size-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            }, void 0, false, {
                fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                lineNumber: 207,
                columnNumber: 142
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 207,
            columnNumber: 11
        }, this);
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: "Home"
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 208,
            columnNumber: 11
        }, this);
        $[41] = t22;
        $[42] = t23;
    } else {
        t22 = $[41];
        t23 = $[42];
    }
    let t24;
    if ($[43] !== t21) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            onClick: t21,
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].singleNavabrItemHolder_mobileView,
            children: [
                t22,
                t23
            ]
        }, void 0, true, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 217,
            columnNumber: 11
        }, this);
        $[43] = t21;
        $[44] = t24;
    } else {
        t24 = $[44];
    }
    let t25;
    if ($[45] !== router) {
        t25 = ({
            "DashboardLayout[<div>.onClick]": ()=>{
                router.push("/discover");
            }
        })["DashboardLayout[<div>.onClick]"];
        $[45] = router;
        $[46] = t25;
    } else {
        t25 = $[46];
    }
    let t26;
    let t27;
    if ($[47] === Symbol.for("react.memo_cache_sentinel")) {
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: 1.5,
            stroke: "currentColor",
            className: "size-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            }, void 0, false, {
                fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                lineNumber: 238,
                columnNumber: 142
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 238,
            columnNumber: 11
        }, this);
        t27 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: "Discover"
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 239,
            columnNumber: 11
        }, this);
        $[47] = t26;
        $[48] = t27;
    } else {
        t26 = $[47];
        t27 = $[48];
    }
    let t28;
    if ($[49] !== t25) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            onClick: t25,
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].singleNavabrItemHolder_mobileView,
            children: [
                t26,
                t27
            ]
        }, void 0, true, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 248,
            columnNumber: 11
        }, this);
        $[49] = t25;
        $[50] = t28;
    } else {
        t28 = $[50];
    }
    let t29;
    if ($[51] !== router) {
        t29 = ({
            "DashboardLayout[<div>.onClick]": ()=>{
                router.push("/my_connections");
            }
        })["DashboardLayout[<div>.onClick]"];
        $[51] = router;
        $[52] = t29;
    } else {
        t29 = $[52];
    }
    let t30;
    let t31;
    if ($[53] === Symbol.for("react.memo_cache_sentinel")) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: 1.5,
            stroke: "currentColor",
            className: "size-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            }, void 0, false, {
                fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                lineNumber: 269,
                columnNumber: 142
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 269,
            columnNumber: 11
        }, this);
        t31 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: "My Network"
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 270,
            columnNumber: 11
        }, this);
        $[53] = t30;
        $[54] = t31;
    } else {
        t30 = $[53];
        t31 = $[54];
    }
    let t32;
    if ($[55] !== t29) {
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            onClick: t29,
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].singleNavabrItemHolder_mobileView,
            children: [
                t30,
                t31
            ]
        }, void 0, true, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 279,
            columnNumber: 11
        }, this);
        $[55] = t29;
        $[56] = t32;
    } else {
        t32 = $[56];
    }
    let t33;
    if ($[57] !== router) {
        t33 = ({
            "DashboardLayout[<div>.onClick]": ()=>{
                router.push("/profile");
            }
        })["DashboardLayout[<div>.onClick]"];
        $[57] = router;
        $[58] = t33;
    } else {
        t33 = $[58];
    }
    let t34;
    if ($[59] !== authState.user) {
        t34 = authState.user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            style: {
                width: "1.5rem",
                height: "1.5rem",
                borderRadius: "50%",
                objectFit: "cover"
            },
            src: `http://localhost:9090/${authState.user.userId.profilePicture}`,
            alt: "Profile"
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 299,
            columnNumber: 28
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: 1.5,
            stroke: "currentColor",
            className: "size-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            }, void 0, false, {
                fileName: "[project]/src/layout/DashboardLayout/index.jsx",
                lineNumber: 304,
                columnNumber: 228
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 304,
            columnNumber: 97
        }, this);
        $[59] = authState.user;
        $[60] = t34;
    } else {
        t34 = $[60];
    }
    let t35;
    if ($[61] === Symbol.for("react.memo_cache_sentinel")) {
        t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: "Profile"
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 312,
            columnNumber: 11
        }, this);
        $[61] = t35;
    } else {
        t35 = $[61];
    }
    let t36;
    if ($[62] !== t33 || $[63] !== t34) {
        t36 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            onClick: t33,
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].singleNavabrItemHolder_mobileView,
            children: [
                t34,
                t35
            ]
        }, void 0, true, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 319,
            columnNumber: 11
        }, this);
        $[62] = t33;
        $[63] = t34;
        $[64] = t36;
    } else {
        t36 = $[64];
    }
    let t37;
    if ($[65] !== t24 || $[66] !== t28 || $[67] !== t32 || $[68] !== t36) {
        t37 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mobileNavbarView,
            children: [
                t24,
                t28,
                t32,
                t36
            ]
        }, void 0, true, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 328,
            columnNumber: 11
        }, this);
        $[65] = t24;
        $[66] = t28;
        $[67] = t32;
        $[68] = t36;
        $[69] = t37;
    } else {
        t37 = $[69];
    }
    let t38;
    if ($[70] !== t20 || $[71] !== t37) {
        t38 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t20,
                t37
            ]
        }, void 0, true, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 339,
            columnNumber: 11
        }, this);
        $[70] = t20;
        $[71] = t37;
        $[72] = t38;
    } else {
        t38 = $[72];
    }
    return t38;
}
_s(DashboardLayout, "kUhjSA18lKx4itH0Q7D53Z2hSdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useSelector"]
    ];
});
_c = DashboardLayout;
function _DashboardLayoutAuthStateAll_usersMap(profiles) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            children: profiles.userId.name
        }, void 0, false, {
            fileName: "[project]/src/layout/DashboardLayout/index.jsx",
            lineNumber: 349,
            columnNumber: 42
        }, this)
    }, profiles.userId.name, false, {
        fileName: "[project]/src/layout/DashboardLayout/index.jsx",
        lineNumber: 349,
        columnNumber: 10
    }, this);
}
function _DashboardLayoutUseSelector(state) {
    return state.auth;
}
var _c;
__turbopack_context__.k.register(_c, "DashboardLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [client] (ecmascript)");
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
const NavbarComponent = ()=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(18);
    if ($[0] !== "2dd71d8c9a217766568dcd409fbfd998d7ec0b494ef282af085e4b48e78a5714") {
        for(let $i = 0; $i < 18; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "2dd71d8c9a217766568dcd409fbfd998d7ec0b494ef282af085e4b48e78a5714";
    }
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const authState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useSelector"])(_temp);
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useDispatch"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useSelector"])(_temp2);
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
            children: "Pro Link"
        }, void 0, false, {
            fileName: "[project]/src/Component/Navbar/index.jsx",
            lineNumber: 31,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[2] = router;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    let t2;
    if ($[4] !== authState.profileFetched || $[5] !== authState.user || $[6] !== dispatch || $[7] !== router) {
        t2 = authState.profileFetched && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: "1.2rem"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            cursor: "pointer"
                        },
                        onClick: ()=>{
                            router.push("/profile");
                        },
                        children: authState.user.userId.username
                    }, void 0, false, {
                        fileName: "[project]/src/Component/Navbar/index.jsx",
                        lineNumber: 44,
                        columnNumber: 10
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        onClick: ()=>{
                            localStorage.removeItem("token");
                            router.push("/login");
                            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$reducer$2f$authReducer$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["reset"])());
                        },
                        style: {
                            cursor: "pointer",
                            fontWeight: "bold"
                        },
                        children: "Logout"
                    }, void 0, false, {
                        fileName: "[project]/src/Component/Navbar/index.jsx",
                        lineNumber: 48,
                        columnNumber: 48
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/Component/Navbar/index.jsx",
                lineNumber: 41,
                columnNumber: 43
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/Component/Navbar/index.jsx",
            lineNumber: 41,
            columnNumber: 38
        }, ("TURBOPACK compile-time value", void 0));
        $[4] = authState.profileFetched;
        $[5] = authState.user;
        $[6] = dispatch;
        $[7] = router;
        $[8] = t2;
    } else {
        t2 = $[8];
    }
    let t3;
    if ($[9] !== authState.profileFetched || $[10] !== router) {
        t3 = !authState.profileFetched && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            onClick: ()=>{
                router.push("/login");
            },
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$styles$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].buttonJoin,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: " Be a Part"
            }, void 0, false, {
                fileName: "[project]/src/Component/Navbar/index.jsx",
                lineNumber: 68,
                columnNumber: 38
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/Component/Navbar/index.jsx",
            lineNumber: 66,
            columnNumber: 39
        }, ("TURBOPACK compile-time value", void 0));
        $[9] = authState.profileFetched;
        $[10] = router;
        $[11] = t3;
    } else {
        t3 = $[11];
    }
    let t4;
    if ($[12] !== t2 || $[13] !== t3) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$Navbar$2f$styles$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navBaroptionContainer,
            children: [
                t2,
                t3
            ]
        }, void 0, true, {
            fileName: "[project]/src/Component/Navbar/index.jsx",
            lineNumber: 77,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[12] = t2;
        $[13] = t3;
        $[14] = t4;
    } else {
        t4 = $[14];
    }
    let t5;
    if ($[15] !== t1 || $[16] !== t4) {
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
                    lineNumber: 86,
                    columnNumber: 46
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/Component/Navbar/index.jsx",
                lineNumber: 86,
                columnNumber: 12
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false);
        $[15] = t1;
        $[16] = t4;
        $[17] = t5;
    } else {
        t5 = $[17];
    }
    return t5;
};
_s(NavbarComponent, "iQbUgqXAwSYpMDyM5Ax6xtFgk5w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useSelector"]
    ];
});
_c = NavbarComponent;
const __TURBOPACK__default__export__ = NavbarComponent;
function _temp(state) {
    return state.auth;
}
function _temp2(state_0) {
    return state_0.post;
}
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
"[project]/src/pages/view_profile/index.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "Card": "index-module__wh4uvW__Card",
  "Container": "index-module__wh4uvW__Container",
  "backDrop": "index-module__wh4uvW__backDrop",
  "backDropContainer": "index-module__wh4uvW__backDropContainer",
  "card__profileContainer": "index-module__wh4uvW__card__profileContainer",
  "connectButton": "index-module__wh4uvW__connectButton",
  "iconContainer": "index-module__wh4uvW__iconContainer",
  "postCard": "index-module__wh4uvW__postCard",
  "profileContainer_details": "index-module__wh4uvW__profileContainer_details",
  "workHistoryCard": "index-module__wh4uvW__workHistoryCard",
  "workHistoryContainer": "index-module__wh4uvW__workHistoryContainer",
  "workhistory": "index-module__wh4uvW__workhistory",
});
}),
"[project]/src/config/redux/action/postAction/index.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPost",
    ()=>createPost,
    "deletePost",
    ()=>deletePost,
    "getAllComments",
    ()=>getAllComments,
    "getAllPost",
    ()=>getAllPost,
    "incrementLike",
    ()=>incrementLike,
    "postComment",
    ()=>postComment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [client] (ecmascript) <locals>");
;
;
const getAllPost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("post/getAllPost", async (_, thunkAPI)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clientServer"].get("/posts");
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
const createPost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("post/createPost", async (userData, thunkAPI)=>{
    const { file, body } = userData;
    try {
        const formData = new FormData();
        formData.append('token', localStorage.getItem('token'));
        formData.append("body", body);
        formData.append("media", file);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clientServer"].post("/post", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        if (response.status === 200) {
            return thunkAPI.fulfillWithValue(response.data);
        } else {
            return thunkAPI.rejectWithValue("Post Not Uploaded");
        }
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
const deletePost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("post/deletePost", async (postData, thunkAPI)=>{
    const { postId, token } = postData;
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clientServer"].delete('/delete_post', {
            data: {
                token: token,
                post_id: postId
            }
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue("Something went wrong");
    }
});
const incrementLike = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("post/incrementLike", async (post = {}, thunkAPI)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clientServer"].post('/increment_post_likes', {
            post_id: post.post_id,
            token: localStorage.getItem('token')
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
const getAllComments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("post/getAllComments", async (postData = {}, thunkAPI)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clientServer"].get('/get_comments', {
            params: {
                post_id: postData.post_id
            }
        });
        return thunkAPI.fulfillWithValue({
            comments: response.data,
            post_id: postData.post_id
        });
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
const postComment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createAsyncThunk"])("post/postComment", async (commentData = {}, thunkAPI)=>{
    try {
        console.log({
            post_id: commentData.post_id,
            body: commentData.body
        });
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clientServer"].post('/comment', {
            token: localStorage.getItem('token'),
            post_id: commentData.post_id,
            commentBody: commentData.body
        });
        return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/view_profile/[username].jsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__N_SSP",
    ()=>__N_SSP,
    "default",
    ()=>ViewProfilePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/compiler-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/layout/DashboardLayout/index.jsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$UserLayout$2f$index$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/layout/UserLayout/index.jsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$view_profile$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/pages/view_profile/index.module.css [client] (css module)");
// import { useState } from "react";
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$postAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/redux/action/postAction/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/redux/action/authAction/index.js [client] (ecmascript)");
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
;
;
;
var __N_SSP = true;
function ViewProfilePage(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$compiler$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["c"])(68);
    if ($[0] !== "0a2d648e8a180baad17a8d6a8a39ab1ebffd8021f92a16c64feefe51d6ce5b37") {
        for(let $i = 0; $i < 68; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0a2d648e8a180baad17a8d6a8a39ab1ebffd8021f92a16c64feefe51d6ce5b37";
    }
    const { userProfile } = t0;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useDispatch"])();
    const authState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useSelector"])(_ViewProfilePageUseSelector);
    const postreducer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useSelector"])(_ViewProfilePageUseSelector2);
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = [];
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const [userPosts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    const [isCurrentUserInConnection, setCurrentUserInConnection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCurrentionNull, setIsConnectionNull] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    let t2;
    if ($[2] !== dispatch) {
        t2 = ({
            "ViewProfilePage[getUsersPost]": async ()=>{
                await dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$postAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getAllPost"])());
                await dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getConnectionsRequest"])({
                    token: localStorage.getItem("token")
                }));
                await dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getMyConnectionRequests"])({
                    token: localStorage.getItem("token")
                }));
            }
        })["ViewProfilePage[getUsersPost]"];
        $[2] = dispatch;
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    const getUsersPost = t2;
    let t3;
    if ($[4] !== postreducer.posts || $[5] !== router) {
        t3 = ({
            "ViewProfilePage[useEffect()]": ()=>{
                postreducer.posts.filter({
                    "ViewProfilePage[useEffect() > postreducer.posts.filter()]": (post)=>post.userId.username === router.query.username
                }["ViewProfilePage[useEffect() > postreducer.posts.filter()]"]);
            }
        })["ViewProfilePage[useEffect()]"];
        $[4] = postreducer.posts;
        $[5] = router;
        $[6] = t3;
    } else {
        t3 = $[6];
    }
    let t4;
    if ($[7] !== postreducer.posts) {
        t4 = [
            postreducer.posts
        ];
        $[7] = postreducer.posts;
        $[8] = t4;
    } else {
        t4 = $[8];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])(t3, t4);
    let t5;
    if ($[9] !== authState.connectionRequests || $[10] !== authState.connections || $[11] !== userProfile.userId._id) {
        t5 = ({
            "ViewProfilePage[useEffect()]": ()=>{
                if (authState.connections.some({
                    "ViewProfilePage[useEffect() > authState.connections.some()]": (user_0)=>user_0.connectionId._id === userProfile.userId._id
                }["ViewProfilePage[useEffect() > authState.connections.some()]"])) {
                    setCurrentUserInConnection(true);
                    if (authState.connections.find({
                        "ViewProfilePage[useEffect() > authState.connections.find()]": (user)=>user.connectionId._id === userProfile.userId._id
                    }["ViewProfilePage[useEffect() > authState.connections.find()]"]).status_accepted === true) {
                        setIsConnectionNull(false);
                    }
                }
                if (authState.connectionRequests.some({
                    "ViewProfilePage[useEffect() > authState.connectionRequests.some()]": (user_2)=>user_2.userId._id === userProfile.userId._id
                }["ViewProfilePage[useEffect() > authState.connectionRequests.some()]"])) {
                    setCurrentUserInConnection(true);
                    if (authState.connectionRequests.find({
                        "ViewProfilePage[useEffect() > authState.connectionRequests.find()]": (user_1)=>user_1.userId._id === userProfile.userId._id
                    }["ViewProfilePage[useEffect() > authState.connectionRequests.find()]"]).status_accepted === true) {
                        setIsConnectionNull(false);
                    }
                }
            }
        })["ViewProfilePage[useEffect()]"];
        $[9] = authState.connectionRequests;
        $[10] = authState.connections;
        $[11] = userProfile.userId._id;
        $[12] = t5;
    } else {
        t5 = $[12];
    }
    let t6;
    if ($[13] !== authState.connectionRequests || $[14] !== authState.connections) {
        t6 = [
            authState.connections,
            authState.connectionRequests
        ];
        $[13] = authState.connectionRequests;
        $[14] = authState.connections;
        $[15] = t6;
    } else {
        t6 = $[15];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])(t5, t6);
    let t7;
    if ($[16] !== getUsersPost) {
        t7 = ({
            "ViewProfilePage[useEffect()]": ()=>{
                getUsersPost();
            }
        })["ViewProfilePage[useEffect()]"];
        $[16] = getUsersPost;
        $[17] = t7;
    } else {
        t7 = $[17];
    }
    let t8;
    if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = [];
        $[18] = t8;
    } else {
        t8 = $[18];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])(t7, t8);
    const t9 = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/${userProfile.userId.profilePicture}`;
    let t10;
    if ($[19] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$view_profile$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].backDrop,
            src: t9,
            alt: ""
        }, void 0, false, {
            fileName: "[project]/src/pages/view_profile/[username].jsx",
            lineNumber: 147,
            columnNumber: 11
        }, this);
        $[19] = t9;
        $[20] = t10;
    } else {
        t10 = $[20];
    }
    let t11;
    if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
        t11 = {
            display: "flex",
            width: "fit-content",
            alignItems: "center",
            gap: "1.2rem"
        };
        $[21] = t11;
    } else {
        t11 = $[21];
    }
    let t12;
    if ($[22] !== userProfile.userId.name) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            children: userProfile.userId.name
        }, void 0, false, {
            fileName: "[project]/src/pages/view_profile/[username].jsx",
            lineNumber: 167,
            columnNumber: 11
        }, this);
        $[22] = userProfile.userId.name;
        $[23] = t12;
    } else {
        t12 = $[23];
    }
    let t13;
    if ($[24] === Symbol.for("react.memo_cache_sentinel")) {
        t13 = {
            color: "grey"
        };
        $[24] = t13;
    } else {
        t13 = $[24];
    }
    let t14;
    if ($[25] !== userProfile.userId.username) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            style: t13,
            children: [
                "@",
                userProfile.userId.username
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/view_profile/[username].jsx",
            lineNumber: 184,
            columnNumber: 11
        }, this);
        $[25] = userProfile.userId.username;
        $[26] = t14;
    } else {
        t14 = $[26];
    }
    let t15;
    if ($[27] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = {
            display: "flex",
            alignItems: "center",
            gap: "1rem"
        };
        $[27] = t15;
    } else {
        t15 = $[27];
    }
    let t16;
    if ($[28] !== dispatch || $[29] !== isCurrentUserInConnection || $[30] !== isCurrentionNull || $[31] !== userProfile.userId._id) {
        t16 = isCurrentUserInConnection ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$view_profile$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].connectButton,
            children: isCurrentionNull ? "Pending" : "Connected"
        }, void 0, false, {
            fileName: "[project]/src/pages/view_profile/[username].jsx",
            lineNumber: 203,
            columnNumber: 39
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: {
                "ViewProfilePage[<button>.onClick]": async ()=>{
                    await dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$redux$2f$action$2f$authAction$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["sendConnectionRequest"])({
                        token: localStorage.getItem("token"),
                        connectionId: userProfile.userId._id
                    }));
                    setCurrentUserInConnection(false);
                }
            }["ViewProfilePage[<button>.onClick]"],
            children: "Connect"
        }, void 0, false, {
            fileName: "[project]/src/pages/view_profile/[username].jsx",
            lineNumber: 203,
            columnNumber: 136
        }, this);
        $[28] = dispatch;
        $[29] = isCurrentUserInConnection;
        $[30] = isCurrentionNull;
        $[31] = userProfile.userId._id;
        $[32] = t16;
    } else {
        t16 = $[32];
    }
    let t17;
    if ($[33] !== userProfile.userId._id) {
        t17 = ({
            "ViewProfilePage[<div>.onClick]": async ()=>{
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["clientServer"].get(`/user/download_resume?id=${userProfile.userId._id}`);
                window.open(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/${response.data.message}`, "_blank");
            }
        })["ViewProfilePage[<div>.onClick]"];
        $[33] = userProfile.userId._id;
        $[34] = t17;
    } else {
        t17 = $[34];
    }
    let t18;
    if ($[35] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = {
            width: "24px",
            cursor: "pointer"
        };
        $[35] = t18;
    } else {
        t18 = $[35];
    }
    let t19;
    if ($[36] === Symbol.for("react.memo_cache_sentinel")) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            strokeWidth: 1.5,
            stroke: "currentColor",
            className: "size-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            }, void 0, false, {
                fileName: "[project]/src/pages/view_profile/[username].jsx",
                lineNumber: 245,
                columnNumber: 142
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/pages/view_profile/[username].jsx",
            lineNumber: 245,
            columnNumber: 11
        }, this);
        $[36] = t19;
    } else {
        t19 = $[36];
    }
    let t20;
    if ($[37] !== t17) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            onClick: t17,
            style: t18,
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$view_profile$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].iconContainer,
            children: t19
        }, void 0, false, {
            fileName: "[project]/src/pages/view_profile/[username].jsx",
            lineNumber: 252,
            columnNumber: 11
        }, this);
        $[37] = t17;
        $[38] = t20;
    } else {
        t20 = $[38];
    }
    let t21;
    if ($[39] !== t16 || $[40] !== t20) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t15,
            children: [
                t16,
                t20
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/view_profile/[username].jsx",
            lineNumber: 260,
            columnNumber: 11
        }, this);
        $[39] = t16;
        $[40] = t20;
        $[41] = t21;
    } else {
        t21 = $[41];
    }
    let t22;
    if ($[42] !== t12 || $[43] !== t14 || $[44] !== t21) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t11,
            children: [
                t12,
                t14,
                t21
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/view_profile/[username].jsx",
            lineNumber: 269,
            columnNumber: 11
        }, this);
        $[42] = t12;
        $[43] = t14;
        $[44] = t21;
        $[45] = t22;
    } else {
        t22 = $[45];
    }
    let t23;
    if ($[46] !== userProfile.bio) {
        t23 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: userProfile.bio
            }, void 0, false, {
                fileName: "[project]/src/pages/view_profile/[username].jsx",
                lineNumber: 279,
                columnNumber: 16
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/pages/view_profile/[username].jsx",
            lineNumber: 279,
            columnNumber: 11
        }, this);
        $[46] = userProfile.bio;
        $[47] = t23;
    } else {
        t23 = $[47];
    }
    let t24;
    let t25;
    let t26;
    if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
        t24 = {
            display: "flex",
            gap: "0.7rem",
            width: "100%"
        };
        t25 = {
            flex: "1"
        };
        t26 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
            children: "Recent Activity"
        }, void 0, false, {
            fileName: "[project]/src/pages/view_profile/[username].jsx",
            lineNumber: 297,
            columnNumber: 11
        }, this);
        $[48] = t24;
        $[49] = t25;
        $[50] = t26;
    } else {
        t24 = $[48];
        t25 = $[49];
        t26 = $[50];
    }
    let t27;
    if ($[51] !== userPosts) {
        t27 = userPosts.map(_ViewProfilePageUserPostsMap);
        $[51] = userPosts;
        $[52] = t27;
    } else {
        t27 = $[52];
    }
    let t28;
    if ($[53] !== t27) {
        t28 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: t24,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: t25,
                children: [
                    t26,
                    t27
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/view_profile/[username].jsx",
                lineNumber: 316,
                columnNumber: 28
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/pages/view_profile/[username].jsx",
            lineNumber: 316,
            columnNumber: 11
        }, this);
        $[53] = t27;
        $[54] = t28;
    } else {
        t28 = $[54];
    }
    let t29;
    if ($[55] !== t22 || $[56] !== t23 || $[57] !== t28) {
        t29 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$view_profile$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].profileContainer_details,
            children: [
                t22,
                t23,
                t28
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/view_profile/[username].jsx",
            lineNumber: 324,
            columnNumber: 11
        }, this);
        $[55] = t22;
        $[56] = t23;
        $[57] = t28;
        $[58] = t29;
    } else {
        t29 = $[58];
    }
    let t30;
    if ($[59] === Symbol.for("react.memo_cache_sentinel")) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
            children: "work history"
        }, void 0, false, {
            fileName: "[project]/src/pages/view_profile/[username].jsx",
            lineNumber: 334,
            columnNumber: 11
        }, this);
        $[59] = t30;
    } else {
        t30 = $[59];
    }
    let t31;
    if ($[60] !== userProfile.pastwork) {
        t31 = userProfile.pastwork.map(_ViewProfilePageUserProfilePastworkMap);
        $[60] = userProfile.pastwork;
        $[61] = t31;
    } else {
        t31 = $[61];
    }
    let t32;
    if ($[62] !== t31) {
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$view_profile$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].workhistory,
            children: [
                t30,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$view_profile$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].workHistoryContainer,
                    children: t31
                }, void 0, false, {
                    fileName: "[project]/src/pages/view_profile/[username].jsx",
                    lineNumber: 349,
                    columnNumber: 52
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/view_profile/[username].jsx",
            lineNumber: 349,
            columnNumber: 11
        }, this);
        $[62] = t31;
        $[63] = t32;
    } else {
        t32 = $[63];
    }
    let t33;
    if ($[64] !== t10 || $[65] !== t29 || $[66] !== t32) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$UserLayout$2f$index$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$layout$2f$DashboardLayout$2f$index$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$view_profile$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].Container,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$view_profile$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].backDropContainer,
                        children: [
                            t10,
                            t29,
                            t32
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/view_profile/[username].jsx",
                        lineNumber: 357,
                        columnNumber: 74
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/view_profile/[username].jsx",
                    lineNumber: 357,
                    columnNumber: 40
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/view_profile/[username].jsx",
                lineNumber: 357,
                columnNumber: 23
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/pages/view_profile/[username].jsx",
            lineNumber: 357,
            columnNumber: 11
        }, this);
        $[64] = t10;
        $[65] = t29;
        $[66] = t32;
        $[67] = t33;
    } else {
        t33 = $[67];
    }
    return t33;
}
_s(ViewProfilePage, "3zwfrfSG9ZBqF+58d3b5MKWMyt0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useDispatch"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useSelector"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["useSelector"]
    ];
});
_c = ViewProfilePage;
function _ViewProfilePageUserProfilePastworkMap(work, index) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$view_profile$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].workHistoryCard,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    fontWeight: "700",
                    color: "#2d3748"
                },
                children: work.company
            }, void 0, false, {
                fileName: "[project]/src/pages/view_profile/[username].jsx",
                lineNumber: 368,
                columnNumber: 62
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    color: "#008080",
                    fontWeight: "600"
                },
                children: work.position
            }, void 0, false, {
                fileName: "[project]/src/pages/view_profile/[username].jsx",
                lineNumber: 371,
                columnNumber: 26
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    fontSize: "0.9rem",
                    color: "#718096"
                },
                children: work.years
            }, void 0, false, {
                fileName: "[project]/src/pages/view_profile/[username].jsx",
                lineNumber: 374,
                columnNumber: 27
            }, this)
        ]
    }, index, true, {
        fileName: "[project]/src/pages/view_profile/[username].jsx",
        lineNumber: 368,
        columnNumber: 10
    }, this);
}
function _ViewProfilePageUserPostsMap(post_1) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$view_profile$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].postCard,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$view_profile$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].Card,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$view_profile$2f$index$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].card__profileContainer,
                children: [
                    post_1.media !== "" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["BASE_URL"]}/${post_1.media}`,
                        alt: ""
                    }, void 0, false, {
                        fileName: "[project]/src/pages/view_profile/[username].jsx",
                        lineNumber: 380,
                        columnNumber: 159
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: "3.rem",
                            height: "3.4rem"
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/pages/view_profile/[username].jsx",
                        lineNumber: 380,
                        columnNumber: 212
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: post_1.body
                    }, void 0, false, {
                        fileName: "[project]/src/pages/view_profile/[username].jsx",
                        lineNumber: 383,
                        columnNumber: 15
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/view_profile/[username].jsx",
                lineNumber: 380,
                columnNumber: 89
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/pages/view_profile/[username].jsx",
            lineNumber: 380,
            columnNumber: 60
        }, this)
    }, post_1._id, false, {
        fileName: "[project]/src/pages/view_profile/[username].jsx",
        lineNumber: 380,
        columnNumber: 10
    }, this);
}
function _ViewProfilePageUseSelector2(state_0) {
    return state_0.posts;
}
function _ViewProfilePageUseSelector(state) {
    return state.auth;
}
var _c;
__turbopack_context__.k.register(_c, "ViewProfilePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/view_profile/[username].jsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/view_profile/[username]";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/view_profile/[username].jsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/view_profile/[username].jsx\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/view_profile/[username].jsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__e98c8f18._.js.map