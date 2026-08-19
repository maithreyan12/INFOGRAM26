(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/events/[slug]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EventDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$PublicLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/PublicLayout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.mjs [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.mjs [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$indian$2d$rupee$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IndianRupee$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/indian-rupee.mjs [app-client] (ecmascript) <export default as IndianRupee>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.mjs [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.mjs [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trophy.mjs [app-client] (ecmascript) <export default as Trophy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-check.mjs [app-client] (ecmascript) <export default as UserCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$DugxmK6F$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__aR__as__collection$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/common-DugxmK6F.esm.js [app-client] (ecmascript) <export aR as collection>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$eventStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/eventStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$eventsData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/eventsData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ThemeContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
const demoEvents = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$eventsData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OFFICIAL_EVENTS"];
;
function EventDetailPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const rawSlug = params.slug;
    const [event, setEvent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const isDark = theme === 'dark';
    const { events: storeEvents } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$eventStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEventStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EventDetailPage.useEffect": ()=>{
            const fetchEvent = {
                "EventDetailPage.useEffect.fetchEvent": async ()=>{
                    try {
                        const normSlug = rawSlug ? rawSlug.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
                        // 1. Always resolve base event from official demoEvents list to guarantee 100% brochure accuracy
                        let localEvent = demoEvents.find({
                            "EventDetailPage.useEffect.fetchEvent.localEvent": (e)=>{
                                const eNorm = e.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
                                return eNorm === normSlug || e.id === rawSlug;
                            }
                        }["EventDetailPage.useEffect.fetchEvent.localEvent"]);
                        if (!localEvent) {
                            localEvent = storeEvents.find({
                                "EventDetailPage.useEffect.fetchEvent": (e)=>{
                                    const eNorm = e.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
                                    return eNorm === normSlug || e.id === rawSlug;
                                }
                            }["EventDetailPage.useEffect.fetchEvent"]);
                        }
                        let resultEvent = localEvent ? {
                            ...localEvent
                        } : null;
                        // 2. Check Firebase if configured for live metrics
                        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"] && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFirebaseConfigured"]) {
                            try {
                                // Count live paid registrations for this event
                                let livePaidCount = 0;
                                const normEventName = localEvent ? localEvent.name.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
                                // Count from storeRegistrations
                                const storeRegs = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$eventStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEventStore"].getState?.()?.registrations || [];
                                storeRegs.forEach({
                                    "EventDetailPage.useEffect.fetchEvent": (r)=>{
                                        if (r.status === 'paid' || r.applicantId === 'INFO26-HACK-14423') {
                                            const evts = r.eventNames || r.events || [];
                                            const match = evts.some({
                                                "EventDetailPage.useEffect.fetchEvent.match": (e)=>{
                                                    const norm = String(e).toLowerCase().replace(/[^a-z0-9]/g, '');
                                                    return norm === normSlug || norm === normEventName || norm === localEvent?.id;
                                                }
                                            }["EventDetailPage.useEffect.fetchEvent.match"]);
                                            if (match) livePaidCount += 1;
                                        }
                                    }
                                }["EventDetailPage.useEffect.fetchEvent"]);
                                // Count from Supabase
                                try {
                                    const { supabase } = await __turbopack_context__.A("[project]/src/lib/supabase/config.ts [app-client] (ecmascript, async loader)");
                                    const { data: spRegs } = await supabase.from('registrations').select('*').eq('status', 'paid');
                                    if (spRegs) {
                                        spRegs.forEach({
                                            "EventDetailPage.useEffect.fetchEvent": (sr)=>{
                                                const evts = sr.events || [];
                                                const match = evts.some({
                                                    "EventDetailPage.useEffect.fetchEvent.match": (e)=>{
                                                        const norm = String(e).toLowerCase().replace(/[^a-z0-9]/g, '');
                                                        return norm === normSlug || norm === normEventName || norm === localEvent?.id;
                                                    }
                                                }["EventDetailPage.useEffect.fetchEvent.match"]);
                                                if (match && !storeRegs.some({
                                                    "EventDetailPage.useEffect.fetchEvent": (s)=>s.applicantId === sr.applicant_id
                                                }["EventDetailPage.useEffect.fetchEvent"])) {
                                                    livePaidCount += 1;
                                                }
                                            }
                                        }["EventDetailPage.useEffect.fetchEvent"]);
                                    }
                                } catch (spErr) {
                                    console.warn('Supabase detail slot sync warning:', spErr);
                                }
                                try {
                                    if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"] && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFirebaseConfigured"]) {
                                        const regSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$DugxmK6F$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__aR__as__collection$3e$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'registrations'));
                                        regSnap.docs.forEach({
                                            "EventDetailPage.useEffect.fetchEvent": (doc)=>{
                                                const data = doc.data();
                                                if (data.status === 'paid' || data.paidAt || data.razorpayPaymentId) {
                                                    const evts = data.eventNames || data.events || [];
                                                    const match = evts.some({
                                                        "EventDetailPage.useEffect.fetchEvent.match": (e)=>{
                                                            const norm = String(e).toLowerCase().replace(/[^a-z0-9]/g, '');
                                                            return norm === normSlug || norm === normEventName || norm === localEvent?.id;
                                                        }
                                                    }["EventDetailPage.useEffect.fetchEvent.match"]);
                                                    if (match && !storeRegs.some({
                                                        "EventDetailPage.useEffect.fetchEvent": (s)=>s.applicantId === data.applicantId
                                                    }["EventDetailPage.useEffect.fetchEvent"])) {
                                                        livePaidCount += 1;
                                                    }
                                                }
                                            }
                                        }["EventDetailPage.useEffect.fetchEvent"]);
                                    }
                                } catch (cErr) {
                                    console.warn('Paid registration count warning:', cErr);
                                }
                                const eventsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$DugxmK6F$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__aR__as__collection$3e$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'events');
                                const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDocs"])(eventsRef);
                                if (!snapshot.empty) {
                                    const firestoreMatch = snapshot.docs.find({
                                        "EventDetailPage.useEffect.fetchEvent.firestoreMatch": (doc)=>{
                                            const data = doc.data();
                                            const dNorm = (data.slug || data.name || doc.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                                            return dNorm === normSlug || dNorm === normEventName || doc.id === rawSlug || doc.id === localEvent?.id;
                                        }
                                    }["EventDetailPage.useEffect.fetchEvent.firestoreMatch"]);
                                    if (firestoreMatch) {
                                        const dbData = firestoreMatch.data();
                                        const dbSlugNorm = (dbData.slug || firestoreMatch.id).toLowerCase().replace(/[^a-z0-9]/g, '');
                                        const brochureMatch = demoEvents.find({
                                            "EventDetailPage.useEffect.fetchEvent": (e)=>{
                                                const eNorm = e.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
                                                return eNorm === dbSlugNorm || eNorm === normSlug || e.id === firestoreMatch.id;
                                            }
                                        }["EventDetailPage.useEffect.fetchEvent"]) || localEvent;
                                        if (brochureMatch) {
                                            resultEvent = {
                                                ...brochureMatch,
                                                id: firestoreMatch.id,
                                                registeredCount: Math.max(dbData.registeredCount || 0, livePaidCount, brochureMatch.registeredCount || 0),
                                                bannerUrl: dbData.bannerUrl || brochureMatch.bannerUrl,
                                                status: dbData.status || brochureMatch.status
                                            };
                                        }
                                    }
                                }
                                if (resultEvent) {
                                    resultEvent.registeredCount = Math.max(resultEvent.registeredCount || 0, livePaidCount);
                                }
                            } catch (err) {
                                console.error("Firestore error:", err);
                            }
                        }
                        setEvent(resultEvent);
                    } catch (error) {
                        console.error("Error fetching event:", error);
                        const normSlug = rawSlug ? rawSlug.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
                        const fallback = demoEvents.find({
                            "EventDetailPage.useEffect.fetchEvent.fallback": (e)=>e.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === normSlug
                        }["EventDetailPage.useEffect.fetchEvent.fallback"]);
                        setEvent(fallback || null);
                    } finally{
                        setLoading(false);
                    }
                }
            }["EventDetailPage.useEffect.fetchEvent"];
            if (rawSlug) {
                fetchEvent();
            }
        }
    }["EventDetailPage.useEffect"], [
        rawSlug,
        storeEvents
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$PublicLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen bg-transparent flex justify-center items-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-12 h-12 border-4 border-[#7c3aed]/20 border-t-[#7c3aed] rounded-full animate-spin"
                }, void 0, false, {
                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                    lineNumber: 171,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/events/[slug]/page.tsx",
                lineNumber: 170,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/events/[slug]/page.tsx",
            lineNumber: 169,
            columnNumber: 7
        }, this);
    }
    if (!event) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$PublicLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen bg-transparent flex flex-col justify-center items-center text-slate-900",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-bold mb-4",
                        children: "Event Not Found"
                    }, void 0, false, {
                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                        lineNumber: 181,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/events",
                        className: "text-[#7c3aed] hover:underline font-bold",
                        children: "Return to Events"
                    }, void 0, false, {
                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                        lineNumber: 182,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/events/[slug]/page.tsx",
                lineNumber: 180,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/events/[slug]/page.tsx",
            lineNumber: 179,
            columnNumber: 7
        }, this);
    }
    const isTechnical = event.category === 'technical';
    const totalSlots = event.maxSlots || 200;
    const seatsLeft = Math.max(0, totalSlots - (event.registeredCount || 0));
    const seatsPercentage = seatsLeft / totalSlots * 100;
    let progressColor = 'bg-emerald-500';
    if (seatsPercentage < 10) progressColor = 'bg-red-500';
    else if (seatsPercentage < 50) progressColor = 'bg-amber-500';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$PublicLayout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `min-h-screen bg-transparent pb-24 ${isDark ? 'text-white' : 'text-slate-900'}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `w-full pt-24 pb-6 px-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "container-xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/events",
                                className: `inline-flex items-center gap-2 text-sm font-bold mb-4 group transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "w-4 h-4 group-hover:-translate-x-1 transition-transform duration-150"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                        lineNumber: 211,
                                        columnNumber: 15
                                    }, this),
                                    "All Events"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                lineNumber: 205,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center gap-2 mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`,
                                        children: event.status
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                        lineNumber: 215,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${isTechnical ? isDark ? 'bg-purple-500/15 border-purple-500/30 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-700' : isDark ? 'bg-teal-500/15 border-teal-500/30 text-teal-300' : 'bg-teal-50 border-teal-200 text-teal-700'}`,
                                        children: isTechnical ? 'Technical' : 'Non-Technical'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                        lineNumber: 220,
                                        columnNumber: 15
                                    }, this),
                                    (event.slug === 'flavour-fusion' || event.id === 'nontech-6' || event.name.toLowerCase().includes('flavour')) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/40 flex items-center gap-1 shadow-sm",
                                        children: "🎀 Exclusively for Girls"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                        lineNumber: 228,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                lineNumber: 214,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: `text-3xl sm:text-5xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`,
                                style: {
                                    fontFamily: 'var(--font-display)'
                                },
                                children: event.name
                            }, void 0, false, {
                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                lineNumber: 233,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                        lineNumber: 204,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                    lineNumber: 201,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container-xl px-4 mt-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col lg:flex-row gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full lg:w-7/12 space-y-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `p-6 md:p-8 rounded-3xl border ${isDark ? 'bg-slate-900/90 border-purple-500/30 text-white shadow-2xl' : 'bg-white/90 border-slate-200 text-slate-900 shadow-xl'}`,
                                        children: [
                                            (event.slug === 'flavour-fusion' || event.id === 'nontech-6' || event.name.toLowerCase().includes('flavour')) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-5 p-4 rounded-2xl bg-pink-500/15 border border-pink-500/30 text-pink-300 flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-2xl",
                                                        children: "🎀"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                        lineNumber: 250,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-black text-sm uppercase tracking-wider text-pink-300",
                                                                children: "Exclusively For Girls"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                lineNumber: 252,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs font-semibold text-pink-200/90",
                                                                children: "Flavour Fusion (No-fire cooking) is strictly open for female participants only."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                lineNumber: 253,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                        lineNumber: 251,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                lineNumber: 249,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: `text-2xl font-bold mb-4 flex items-center ${isDark ? 'text-white' : 'text-slate-900'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                        className: `w-6 h-6 mr-3 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                        lineNumber: 258,
                                                        columnNumber: 19
                                                    }, this),
                                                    "About the Event"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                lineNumber: 257,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `leading-relaxed text-lg font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`,
                                                children: event.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                lineNumber: 261,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                        lineNumber: 245,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `p-6 md:p-8 rounded-3xl border ${isDark ? 'bg-slate-900/90 border-purple-500/30 text-white shadow-2xl' : 'bg-white/90 border-slate-200 text-slate-900 shadow-xl'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: `text-2xl font-bold mb-4 flex items-center ${isDark ? 'text-white' : 'text-slate-900'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
                                                        className: `w-6 h-6 mr-3 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                        lineNumber: 270,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Rules & Guidelines"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                lineNumber: 269,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: `space-y-3 font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`,
                                                children: event.rules && event.rules.length > 0 ? event.rules.map((rule, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        className: "flex items-start gap-3 text-base leading-relaxed",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `font-bold shrink-0 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`,
                                                                children: [
                                                                    idx + 1,
                                                                    "."
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                lineNumber: 277,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: rule
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                lineNumber: 278,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                        lineNumber: 276,
                                                        columnNumber: 23
                                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: isDark ? 'text-slate-400' : 'text-slate-500',
                                                    children: "Standard symposium rules apply."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                    lineNumber: 282,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                lineNumber: 273,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                        lineNumber: 266,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `glass-card p-6 rounded-2xl border ${isDark ? 'bg-slate-900/90 border-purple-500/30' : 'bg-white/90 border-slate-200'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`,
                                                        children: "Student Coordinators"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                        lineNumber: 289,
                                                        columnNumber: 19
                                                    }, this),
                                                    (()=>{
                                                        const names = event.coordinatorName ? event.coordinatorName.split(/&|,|\band\b/i).map((n)=>n.trim()).filter(Boolean) : [];
                                                        const numbers = event.contactNumber ? event.contactNumber.split(/,|\//).map((n)=>n.trim()).filter(Boolean) : [];
                                                        if (names.length === 0) {
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`,
                                                                children: "Student Coordinator"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                lineNumber: 299,
                                                                columnNumber: 30
                                                            }, this);
                                                        }
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2.5",
                                                            children: names.map((name, i)=>{
                                                                const phone = numbers[i] || numbers[0] || '';
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: `flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl border ${isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-100/70 border-slate-200/80'}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: `text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`,
                                                                            children: name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                            lineNumber: 310,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                            href: `tel:+91${phone}`,
                                                                            className: `inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all w-fit ${isDark ? 'bg-purple-500/20 border-purple-500/40 text-amber-300 hover:bg-purple-500/30' : 'bg-[#7c3aed]/10 border-[#7c3aed]/30 text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white'}`,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                                                    className: "w-3.5 h-3.5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                                    lineNumber: 320,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                "Call ",
                                                                                phone
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                            lineNumber: 312,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, i, true, {
                                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                    lineNumber: 307,
                                                                    columnNumber: 29
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                            lineNumber: 303,
                                                            columnNumber: 23
                                                        }, this);
                                                    })()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                lineNumber: 288,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `glass-card p-6 rounded-2xl border ${isDark ? 'bg-slate-900/90 border-purple-500/30' : 'bg-white/90 border-slate-200'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`,
                                                        children: "Organizing Department"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                        lineNumber: 332,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`,
                                                        children: event.organizerName || 'Department of IT & Info Club'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                        lineNumber: 333,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`,
                                                        children: "C. Abdul Hakeem College of Engineering & Technology"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                        lineNumber: 336,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                lineNumber: 331,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                        lineNumber: 287,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                lineNumber: 244,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full lg:w-5/12",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "sticky top-24 space-y-6",
                                    children: [
                                        event.status === 'live' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center justify-center animate-pulse",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-3 h-3 bg-red-500 rounded-full mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                    lineNumber: 346,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-red-500 font-bold tracking-wider",
                                                    children: "LIVE NOW"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                            lineNumber: 345,
                                            columnNumber: 19
                                        }, this),
                                        event.status === 'completed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `glass-card p-4 rounded-2xl text-center border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`,
                                                children: "Event Completed"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                lineNumber: 353,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                            lineNumber: 352,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `glass-card p-6 md:p-8 rounded-3xl border transition-colors duration-300 ${isDark ? 'bg-slate-900/90 border-purple-500/30 text-white shadow-2xl' : 'bg-white/90 border-slate-200 text-slate-900 shadow-xl'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: `text-xl font-bold mb-6 border-b pb-4 ${isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-200'}`,
                                                    children: "Event Details"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                    lineNumber: 360,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                    className: `w-5 h-5 mr-4 mt-0.5 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                    lineNumber: 364,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                                            children: "Date"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                            lineNumber: 366,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `font-bold ${isDark ? 'text-white' : 'text-slate-900'}`,
                                                                            children: event.date
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                            lineNumber: 367,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                    lineNumber: 365,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                            lineNumber: 363,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                    className: `w-5 h-5 mr-4 mt-0.5 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                    lineNumber: 372,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                                            children: "Time"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                            lineNumber: 374,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `font-bold ${isDark ? 'text-white' : 'text-slate-900'}`,
                                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$eventsData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTimeRange"])(event.startTime, event.endTime)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                            lineNumber: 375,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                    lineNumber: 373,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                            lineNumber: 371,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                    className: `w-5 h-5 mr-4 mt-0.5 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                    lineNumber: 380,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                                            children: "Venue"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                            lineNumber: 382,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `font-bold ${isDark ? 'text-white' : 'text-slate-900'}`,
                                                                            children: event.venue
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                            lineNumber: 383,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                    lineNumber: 381,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                            lineNumber: 379,
                                                            columnNumber: 21
                                                        }, this),
                                                        event.staffIncharge && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__["UserCheck"], {
                                                                    className: `w-5 h-5 mr-4 mt-0.5 shrink-0 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                    lineNumber: 389,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                                            children: "Staff In-charge"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                            lineNumber: 391,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `font-bold ${isDark ? 'text-white' : 'text-slate-900'}`,
                                                                            children: event.staffIncharge.replace(/;/g, ', ')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                            lineNumber: 392,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                    lineNumber: 390,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                            lineNumber: 388,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$indian$2d$rupee$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IndianRupee$3e$__["IndianRupee"], {
                                                                    className: `w-5 h-5 mr-4 mt-0.5 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                    lineNumber: 398,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                                            children: "Registration Fee"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                            lineNumber: 400,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "font-extrabold text-amber-500 text-xl",
                                                                            children: [
                                                                                "₹",
                                                                                event.registrationFee
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                            lineNumber: 401,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                    lineNumber: 399,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                            lineNumber: 397,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between text-sm mb-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: `font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`,
                                                                            children: "Slots Available"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                            lineNumber: 407,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: `font-bold ${isDark ? 'text-white' : 'text-slate-900'}`,
                                                                            children: [
                                                                                seatsLeft,
                                                                                " / ",
                                                                                totalSlots
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                            lineNumber: 408,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                    lineNumber: 406,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: `w-full h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-slate-200'}`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: `h-full rounded-full ${progressColor}`,
                                                                        style: {
                                                                            width: `${100 - seatsPercentage}%`
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                        lineNumber: 411,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                    lineNumber: 410,
                                                                    columnNumber: 23
                                                                }, this),
                                                                seatsPercentage < 20 && seatsLeft > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-red-500 font-bold mt-2",
                                                                    children: "Hurry! Almost full."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                    lineNumber: 417,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                            lineNumber: 405,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                    lineNumber: 362,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-8",
                                                    children: event.status === 'upcoming' ? seatsLeft > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: `/register?event=${event.slug}`,
                                                        className: "btn-primary w-full block text-center py-4 rounded-full text-lg font-bold shadow-lg",
                                                        children: "Register for this Event"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                        lineNumber: 425,
                                                        columnNumber: 25
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        disabled: true,
                                                        className: `w-full py-4 rounded-full text-lg font-bold cursor-not-allowed ${isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-400'}`,
                                                        children: "Registration Full"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                        lineNumber: 429,
                                                        columnNumber: 25
                                                    }, this) : null
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                    lineNumber: 422,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                            lineNumber: 357,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `glass-card p-6 rounded-2xl space-y-3 border ${isDark ? 'bg-slate-900/90 border-purple-500/30' : 'bg-white/90 border-slate-200'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`,
                                                    children: "Need help? Contact Event Organizers"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                    lineNumber: 440,
                                                    columnNumber: 19
                                                }, this),
                                                (()=>{
                                                    const names = event.coordinatorName ? event.coordinatorName.split(/&|,|\band\b/i).map((n)=>n.trim()).filter(Boolean) : [];
                                                    const numbers = event.contactNumber ? event.contactNumber.split(/,|\//).map((n)=>n.trim()).filter(Boolean) : [];
                                                    if (names.length === 0 && numbers.length === 0) {
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: "tel:+919360257573",
                                                            className: `flex items-center justify-between p-2.5 rounded-xl border transition-colors ${isDark ? 'bg-slate-950/70 border-slate-800 hover:bg-slate-800' : 'bg-slate-100/70 border-slate-200 hover:bg-slate-200/80'}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`,
                                                                    children: "Main Help Desk"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                    lineNumber: 454,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `text-xs font-bold px-3 py-1.5 rounded-full ${isDark ? 'bg-purple-500/20 text-amber-300' : 'bg-[#7c3aed]/10 text-[#7c3aed]'}`,
                                                                    children: "Call 9360257573"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                    lineNumber: 455,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                            lineNumber: 451,
                                                            columnNumber: 25
                                                        }, this);
                                                    }
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: (names.length > 0 ? names : numbers).map((nameOrNum, i)=>{
                                                            const name = names[i] || `Coordinator ${i + 1}`;
                                                            const phone = numbers[i] || numbers[0] || '9360257573';
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `flex items-center justify-between gap-2 p-2.5 rounded-xl border ${isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-100/70 border-slate-200/80'}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: `text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`,
                                                                                children: name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                                lineNumber: 470,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: `text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`,
                                                                                children: [
                                                                                    "Coordinator · ",
                                                                                    phone
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                                lineNumber: 471,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                        lineNumber: 469,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                        href: `tel:+91${phone}`,
                                                                        className: `w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${isDark ? 'bg-purple-500/20 text-amber-300 hover:bg-purple-500/30' : 'bg-[#7c3aed]/10 text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white'}`,
                                                                        title: `Call ${name} (${phone})`,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                                            className: "w-4 h-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                            lineNumber: 480,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                        lineNumber: 473,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                                lineNumber: 466,
                                                                columnNumber: 29
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                                                        lineNumber: 461,
                                                        columnNumber: 23
                                                    }, this);
                                                })()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/events/[slug]/page.tsx",
                                            lineNumber: 439,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                                    lineNumber: 343,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/events/[slug]/page.tsx",
                                lineNumber: 342,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/events/[slug]/page.tsx",
                        lineNumber: 242,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/events/[slug]/page.tsx",
                    lineNumber: 241,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/events/[slug]/page.tsx",
            lineNumber: 199,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/events/[slug]/page.tsx",
        lineNumber: 198,
        columnNumber: 5
    }, this);
}
_s(EventDetailPage, "MimnhELtZ8TlhPHgZIl7rBl5nGY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$eventStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEventStore"]
    ];
});
_c = EventDetailPage;
var _c;
__turbopack_context__.k.register(_c, "EventDetailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/home/MusicPlayer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ONLINE_PLAYLIST",
    ()=>ONLINE_PLAYLIST,
    "default",
    ()=>MusicPlayer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/music-2.mjs [app-client] (ecmascript) <export default as Music2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pause.mjs [app-client] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.mjs [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-2.mjs [app-client] (ecmascript) <export default as Volume2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VolumeX$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-x.mjs [app-client] (ecmascript) <export default as VolumeX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$forward$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipForward$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/skip-forward.mjs [app-client] (ecmascript) <export default as SkipForward>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$back$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipBack$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/skip-back.mjs [app-client] (ecmascript) <export default as SkipBack>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$music$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListMusic$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list-music.mjs [app-client] (ecmascript) <export default as ListMusic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$disc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Disc$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/disc.mjs [app-client] (ecmascript) <export default as Disc>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const ONLINE_PLAYLIST = [
    {
        id: 'vaathi-coming',
        title: 'Vaathi Coming (Mass Remix)',
        artist: 'Anirudh Ravichander • Master',
        src: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=electronic-future-beats-117997.mp3'
    },
    {
        id: 'hukum-mass',
        title: 'Hukum (Thalaivar Alappara)',
        artist: 'Anirudh Ravichander • Jailer',
        src: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=sport-fashion-rock-action-142823.mp3'
    },
    {
        id: 'aalaporaan-thamizhan',
        title: 'Aalaporaan Thamizhan',
        artist: 'A.R. Rahman • Mersal',
        src: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=energetic-hip-hop-8303.mp3'
    },
    {
        id: 'infogram-edm',
        title: 'INFogram\'26 Cyber Anthem',
        artist: 'IT Association • CAHCET',
        src: 'https://cdn.pixabay.com/download/audio/2023/10/24/audio_33132e0e98.mp3?filename=tech-house-beat-172554.mp3'
    },
    {
        id: 'vikram-title',
        title: 'Vikram Title Track',
        artist: 'Anirudh Ravichander • Vikram',
        src: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939794d2c.mp3?filename=action-rock-124476.mp3'
    }
];
function MusicPlayer({ initialTrackId }) {
    _s();
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [currentTrackIndex, setCurrentTrackIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [playing, setPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [muted, setMuted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPlaylist, setShowPlaylist] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [audioError, setAudioError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const currentTrack = ONLINE_PLAYLIST[currentTrackIndex] || ONLINE_PLAYLIST[0];
    // Update progress bar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MusicPlayer.useEffect": ()=>{
            const audio = audioRef.current;
            if (!audio) return;
            const update = {
                "MusicPlayer.useEffect.update": ()=>{
                    if (audio.duration) setProgress(audio.currentTime / audio.duration * 100);
                }
            }["MusicPlayer.useEffect.update"];
            const handleEnded = {
                "MusicPlayer.useEffect.handleEnded": ()=>{
                    handleNextTrack();
                }
            }["MusicPlayer.useEffect.handleEnded"];
            const handleError = {
                "MusicPlayer.useEffect.handleError": ()=>{
                    setAudioError(true);
                    setPlaying(false);
                }
            }["MusicPlayer.useEffect.handleError"];
            audio.addEventListener('timeupdate', update);
            audio.addEventListener('ended', handleEnded);
            audio.addEventListener('error', handleError);
            return ({
                "MusicPlayer.useEffect": ()=>{
                    audio.removeEventListener('timeupdate', update);
                    audio.removeEventListener('ended', handleEnded);
                    audio.removeEventListener('error', handleError);
                }
            })["MusicPlayer.useEffect"];
        }
    }["MusicPlayer.useEffect"], [
        currentTrackIndex
    ]);
    // When current track index changes, reset error & attempt playback if already playing
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MusicPlayer.useEffect": ()=>{
            setAudioError(false);
            if (audioRef.current) {
                audioRef.current.load();
                if (playing) {
                    audioRef.current.play().catch({
                        "MusicPlayer.useEffect": ()=>setPlaying(false)
                    }["MusicPlayer.useEffect"]);
                }
            }
        }
    }["MusicPlayer.useEffect"], [
        currentTrackIndex
    ]);
    const togglePlay = ()=>{
        const audio = audioRef.current;
        if (!audio) return;
        if (playing) {
            audio.pause();
            setPlaying(false);
        } else {
            setAudioError(false);
            audio.play().then(()=>setPlaying(true)).catch((err)=>{
                console.warn('Playback blocked or failed:', err);
                setAudioError(true);
                setPlaying(false);
            });
        }
    };
    const handleNextTrack = ()=>{
        setCurrentTrackIndex((prev)=>(prev + 1) % ONLINE_PLAYLIST.length);
    };
    const handlePrevTrack = ()=>{
        setCurrentTrackIndex((prev)=>(prev - 1 + ONLINE_PLAYLIST.length) % ONLINE_PLAYLIST.length);
    };
    const toggleMute = ()=>{
        if (!audioRef.current) return;
        audioRef.current.muted = !muted;
        setMuted(!muted);
    };
    if (!visible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("audio", {
                ref: audioRef,
                src: currentTrack.src,
                preload: "metadata"
            }, void 0, false, {
                fileName: "[project]/src/components/home/MusicPlayer.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        scale: 0.8,
                        y: 20
                    },
                    animate: {
                        opacity: 1,
                        scale: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        scale: 0.8,
                        y: 20
                    },
                    transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 24,
                        delay: 1
                    },
                    className: "fixed bottom-6 right-4 z-50",
                    style: {
                        WebkitTapHighlightColor: 'transparent'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                            children: expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    scale: 0.9,
                                    y: 10
                                },
                                animate: {
                                    opacity: 1,
                                    scale: 1,
                                    y: 0
                                },
                                exit: {
                                    opacity: 0,
                                    scale: 0.9,
                                    y: 10
                                },
                                transition: {
                                    type: 'spring',
                                    stiffness: 400,
                                    damping: 28
                                },
                                className: "mb-3 rounded-3xl overflow-hidden",
                                style: {
                                    background: 'rgba(4, 13, 26, 0.95)',
                                    backdropFilter: 'blur(28px)',
                                    border: '1.5px solid rgba(0, 212, 255, 0.3)',
                                    boxShadow: '0 24px 64px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 212, 255, 0.15)',
                                    width: '280px'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5 h-6",
                                                    children: playing ? [
                                                        1,
                                                        2,
                                                        3,
                                                        4,
                                                        5
                                                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                            className: "w-1 rounded-full bg-[#00d4ff]",
                                                            animate: {
                                                                height: [
                                                                    '4px',
                                                                    '22px',
                                                                    '8px',
                                                                    '18px',
                                                                    '4px'
                                                                ]
                                                            },
                                                            transition: {
                                                                duration: 0.8,
                                                                repeat: Infinity,
                                                                delay: i * 0.12,
                                                                ease: 'easeInOut'
                                                            }
                                                        }, i, false, {
                                                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                            lineNumber: 177,
                                                            columnNumber: 27
                                                        }, this)) : [
                                                        1,
                                                        2,
                                                        3,
                                                        4,
                                                        5
                                                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-1 h-1.5 rounded-full bg-[#00d4ff]/40"
                                                        }, i, false, {
                                                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                            lineNumber: 191,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                    lineNumber: 174,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowPlaylist(!showPlaylist),
                                                            className: `p-1.5 rounded-lg transition-colors text-xs font-bold flex items-center gap-1 ${showPlaylist ? 'bg-[#00d4ff]/20 text-[#00d4ff]' : 'bg-white/5 text-white/60 hover:text-white'}`,
                                                            title: "Choose Track",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$music$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListMusic$3e$__["ListMusic"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                                lineNumber: 204,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                            lineNumber: 197,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                setVisible(false);
                                                                audioRef.current?.pause();
                                                            },
                                                            className: "p-1.5 rounded-lg text-white/50 hover:text-white bg-white/5 transition-colors",
                                                            title: "Close Player",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                                lineNumber: 211,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                            lineNumber: 206,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                            lineNumber: 173,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "overflow-hidden mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$disc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Disc$3e$__["Disc"], {
                                                            className: `w-4 h-4 text-[#00d4ff] shrink-0 ${playing ? 'animate-spin' : ''}`,
                                                            style: {
                                                                animationDuration: '4s'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                            lineNumber: 219,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-white font-black text-sm truncate",
                                                            style: {
                                                                fontFamily: 'var(--font-heading)'
                                                            },
                                                            children: currentTrack.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                            lineNumber: 220,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-400 text-xs font-semibold truncate mt-0.5 pl-6",
                                                    children: currentTrack.artist
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                    lineNumber: 224,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                            lineNumber: 217,
                                            columnNumber: 19
                                        }, this),
                                        audioError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-1 rounded-md mb-2 border border-amber-400/20",
                                            children: "⚠️ Network error loading track. Try clicking Next!"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                            lineNumber: 231,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onClick: (e)=>{
                                                const audio = audioRef.current;
                                                if (!audio || !audio.duration) return;
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                const clickX = e.clientX - rect.left;
                                                const pct = clickX / rect.width;
                                                audio.currentTime = pct * audio.duration;
                                            },
                                            className: "w-full h-1.5 rounded-full bg-white/10 my-3 overflow-hidden cursor-pointer group",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                className: "h-full rounded-full bg-gradient-to-r from-[#00d4ff] via-purple-400 to-amber-300",
                                                style: {
                                                    width: `${progress}%`
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                lineNumber: 248,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                            lineNumber: 237,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                            children: showPlaylist && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                initial: {
                                                    opacity: 0,
                                                    height: 0
                                                },
                                                animate: {
                                                    opacity: 1,
                                                    height: 'auto'
                                                },
                                                exit: {
                                                    opacity: 0,
                                                    height: 0
                                                },
                                                className: "overflow-hidden mb-3 border-t border-b border-white/10 py-2 space-y-1 max-h-40 overflow-y-auto custom-scrollbar",
                                                children: ONLINE_PLAYLIST.map((track, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            setCurrentTrackIndex(idx);
                                                            setPlaying(true);
                                                            setShowPlaylist(false);
                                                        },
                                                        className: `w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${idx === currentTrackIndex ? 'bg-[#00d4ff]/20 text-[#00d4ff] font-black' : 'text-gray-300 hover:bg-white/5 font-semibold'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "truncate",
                                                                children: track.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                                lineNumber: 277,
                                                                columnNumber: 29
                                                            }, this),
                                                            idx === currentTrackIndex && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] bg-[#00d4ff] text-slate-950 font-black px-1.5 py-0.5 rounded-full",
                                                                children: "PLAYING"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                                lineNumber: 279,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, track.id, true, {
                                                        fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                        lineNumber: 264,
                                                        columnNumber: 27
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                lineNumber: 257,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                            lineNumber: 255,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between pt-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: toggleMute,
                                                    className: "w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors bg-white/5 border border-white/10",
                                                    title: muted ? 'Unmute' : 'Mute',
                                                    children: muted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VolumeX$3e$__["VolumeX"], {
                                                        className: "w-4 h-4 text-red-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                        lineNumber: 296,
                                                        columnNumber: 32
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                        lineNumber: 296,
                                                        columnNumber: 79
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: handlePrevTrack,
                                                            className: "w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors bg-white/5 border border-white/10",
                                                            title: "Previous Song",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$back$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipBack$3e$__["SkipBack"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                                lineNumber: 305,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                            lineNumber: 300,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: togglePlay,
                                                            className: "w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95",
                                                            style: {
                                                                background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
                                                                boxShadow: '0 4px 20px rgba(0, 212, 255, 0.4)'
                                                            },
                                                            title: playing ? 'Pause' : 'Play',
                                                            children: playing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                                                                className: "w-5 h-5 text-white fill-white"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                                lineNumber: 319,
                                                                columnNumber: 27
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                                className: "w-5 h-5 text-white fill-white ml-0.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                                lineNumber: 321,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                            lineNumber: 309,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: handleNextTrack,
                                                            className: "w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors bg-white/5 border border-white/10",
                                                            title: "Next Song",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$forward$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipForward$3e$__["SkipForward"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                                lineNumber: 330,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                            lineNumber: 325,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                                    lineNumber: 299,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                            lineNumber: 290,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                    lineNumber: 171,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                lineNumber: 156,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                            lineNumber: 154,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                            onClick: ()=>setExpanded(!expanded),
                            whileTap: {
                                scale: 0.92
                            },
                            className: "w-13 h-13 rounded-full flex items-center justify-center relative shadow-2xl",
                            style: {
                                background: 'linear-gradient(135deg, rgba(4, 13, 26, 0.9), rgba(12, 35, 64, 0.9))',
                                backdropFilter: 'blur(24px)',
                                border: '1.5px solid rgba(0, 212, 255, 0.5)',
                                boxShadow: playing ? '0 0 30px rgba(0, 212, 255, 0.6), 0 8px 32px rgba(0, 0, 0, 0.5)' : '0 8px 32px rgba(0, 0, 0, 0.5)'
                            },
                            "aria-label": "Music Player",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__["Music2"], {
                                    className: `w-6 h-6 ${playing ? 'text-[#00d4ff] animate-bounce' : 'text-white'}`
                                }, void 0, false, {
                                    fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                    lineNumber: 354,
                                    columnNumber: 13
                                }, this),
                                playing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                            className: "absolute inset-0 rounded-full border border-[#00d4ff]/60",
                                            animate: {
                                                scale: [
                                                    1,
                                                    1.5
                                                ],
                                                opacity: [
                                                    0.8,
                                                    0
                                                ]
                                            },
                                            transition: {
                                                duration: 1.4,
                                                repeat: Infinity,
                                                ease: 'easeOut'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                            lineNumber: 359,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                            className: "absolute inset-0 rounded-full border border-purple-500/40",
                                            animate: {
                                                scale: [
                                                    1,
                                                    1.8
                                                ],
                                                opacity: [
                                                    0.5,
                                                    0
                                                ]
                                            },
                                            transition: {
                                                duration: 1.8,
                                                repeat: Infinity,
                                                ease: 'easeOut',
                                                delay: 0.3
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                            lineNumber: 364,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/home/MusicPlayer.tsx",
                                    lineNumber: 358,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/home/MusicPlayer.tsx",
                            lineNumber: 340,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/home/MusicPlayer.tsx",
                    lineNumber: 145,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/home/MusicPlayer.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/home/MusicPlayer.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
_s(MusicPlayer, "PN+rE/wNI7fthZUtVm68fRSvpzo=");
_c = MusicPlayer;
var _c;
__turbopack_context__.k.register(_c, "MusicPlayer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/Footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.mjs [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.mjs [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.mjs [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ThemeContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const quickLinks = [
    {
        name: 'Home',
        path: '/'
    },
    {
        name: 'About',
        path: '/about'
    },
    {
        name: 'Events',
        path: '/events'
    },
    {
        name: 'Register',
        path: '/register'
    },
    {
        name: 'Contact',
        path: '/contact'
    }
];
const contactPersons = [
    {
        name: 'Naveeth Khan',
        phone: '9360257573'
    },
    {
        name: 'Farish Sharif',
        phone: '9487233290'
    },
    {
        name: 'Kafil Ahmed',
        phone: '8940210491'
    },
    {
        name: 'MD Thameem',
        phone: '9361900720'
    }
];
const legalLinks = [
    {
        name: 'Privacy Policy',
        path: '/privacy-policy'
    },
    {
        name: 'Terms & Conditions',
        path: '/terms'
    }
];
const socialLinks = [
    {
        label: 'Instagram',
        href: 'https://www.instagram.com/infogram_26/',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "w-5 h-5 fill-current",
            viewBox: "0 0 24 24",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Footer.tsx",
                lineNumber: 33,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/layout/Footer.tsx",
            lineNumber: 32,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }
];
function Footer() {
    _s();
    const currentYear = 2026;
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const isDark = theme === 'dark';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: `pt-16 pb-12 border-t transition-colors duration-300 relative z-10 ${isDark ? 'bg-[#04060e] border-purple-500/20 text-white' : 'bg-white border-slate-200 text-slate-950'}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container-xl mx-auto px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-2 space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    className: "flex items-center gap-2.5 group w-fit",
                                    style: {
                                        WebkitTapHighlightColor: 'transparent'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `w-11 h-11 sm:w-12 sm:h-12 rounded-full border shadow-sm flex items-center justify-center overflow-hidden shrink-0 bg-black transition-all duration-200 ${isDark ? 'border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]' : 'border-[#7c3aed]/40'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: "/logo.png",
                                                alt: "INFOGRAM'26 Logo",
                                                width: 48,
                                                height: 48,
                                                decoding: "async",
                                                className: "w-full h-full object-cover rounded-full transform scale-105"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 59,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 57,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `text-xl font-black tracking-wider ${isDark ? 'text-white' : 'text-slate-950'}`,
                                            style: {
                                                fontFamily: 'var(--font-display)'
                                            },
                                            children: [
                                                "INFOGRAM",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: isDark ? 'text-amber-300' : 'text-[#7c3aed]',
                                                    children: "'26"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 69,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 68,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: `text-sm leading-relaxed font-bold max-w-xs ${isDark ? 'text-slate-300' : 'text-slate-800'}`,
                                    children: "National Level Technical Symposium organized by the Department of Information Technology at C. Abdul Hakeem College of Engineering & Technology."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 pt-2",
                                    children: socialLinks.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: s.href,
                                            target: s.href.startsWith('http') ? '_blank' : undefined,
                                            rel: s.href.startsWith('http') ? 'noopener noreferrer' : undefined,
                                            "aria-label": s.label,
                                            className: `w-[44px] h-[44px] flex items-center justify-center rounded-full border transition-all duration-200 ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-purple-500/20 hover:text-amber-300 hover:border-amber-300/40' : 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-[#7c3aed]/10 hover:text-[#7c3aed] hover:border-[#7c3aed]/40'}`,
                                            style: {
                                                WebkitTapHighlightColor: 'transparent'
                                            },
                                            children: s.icon
                                        }, s.label, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 79,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 77,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Footer.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: `font-black text-xs uppercase tracking-widest mb-5 ${isDark ? 'text-amber-300' : 'text-slate-950'}`,
                                    style: {
                                        fontFamily: 'var(--font-heading)'
                                    },
                                    children: "Quick Links"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-1",
                                    children: quickLinks.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: link.path,
                                                className: `min-h-[40px] flex items-center text-sm font-black transition-colors ${isDark ? 'text-slate-300 hover:text-amber-300' : 'text-slate-900 hover:text-[#7c3aed]'}`,
                                                style: {
                                                    WebkitTapHighlightColor: 'transparent'
                                                },
                                                children: link.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                lineNumber: 105,
                                                columnNumber: 19
                                            }, this)
                                        }, link.name, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 104,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 102,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Footer.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: `font-black text-xs uppercase tracking-widest mb-5 ${isDark ? 'text-amber-300' : 'text-slate-950'}`,
                                    style: {
                                        fontFamily: 'var(--font-heading)'
                                    },
                                    children: "Contact"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 120,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-3",
                                    children: contactPersons.map((person)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "flex items-center gap-2.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                    className: `w-4 h-4 shrink-0 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 126,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5 flex-wrap",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-sm font-black ${isDark ? 'text-white' : 'text-slate-950'}`,
                                                            children: person.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                                            lineNumber: 128,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: isDark ? 'text-slate-500' : 'text-slate-400',
                                                            children: "·"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                                            lineNumber: 129,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: `tel:+91${person.phone}`,
                                                            className: `text-sm font-black transition-colors ${isDark ? 'text-slate-200 hover:text-amber-300' : 'text-slate-900 hover:text-[#7c3aed]'}`,
                                                            style: {
                                                                WebkitTapHighlightColor: 'transparent'
                                                            },
                                                            children: person.phone
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                                            lineNumber: 130,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 127,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, person.name, true, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 125,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-5 space-y-2",
                                    children: legalLinks.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: link.path,
                                            className: `block text-xs font-black uppercase tracking-wider transition-colors ${isDark ? 'text-slate-300 hover:text-amber-300' : 'text-slate-800 hover:text-[#7c3aed]'}`,
                                            style: {
                                                WebkitTapHighlightColor: 'transparent'
                                            },
                                            children: link.name
                                        }, link.name, false, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 144,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 142,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Footer.tsx",
                            lineNumber: 119,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: `font-black text-xs uppercase tracking-widest mb-5 ${isDark ? 'text-amber-300' : 'text-slate-950'}`,
                                    style: {
                                        fontFamily: 'var(--font-heading)'
                                    },
                                    children: "Location"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 159,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "flex items-start gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                    className: `w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 164,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-sm font-black leading-relaxed block ${isDark ? 'text-slate-200' : 'text-slate-900'}`,
                                                            children: [
                                                                "C. Abdul Hakeem College",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                                    lineNumber: 167,
                                                                    columnNumber: 44
                                                                }, this),
                                                                "Hakeem Nagar, Melvisharam,",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                                    lineNumber: 168,
                                                                    columnNumber: 47
                                                                }, this),
                                                                "Ranipet District, TN – 632 509"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                                            lineNumber: 166,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 mt-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                    href: "https://maps.google.com/?q=C.+Abdul+Hakeem+College+of+Engineering+%26+Technology,+Melvisharam,+Ranipet,+Tamil+Nadu+632509",
                                                                    target: "_blank",
                                                                    rel: "noopener noreferrer",
                                                                    className: "inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white text-slate-900 border border-slate-300 hover:bg-slate-100 transition-colors shadow-xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            className: "w-3 h-3 shrink-0",
                                                                            viewBox: "0 0 24 24",
                                                                            fill: "none",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                    d: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                                                                                    fill: "#EA4335"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                                                    lineNumber: 179,
                                                                                    columnNumber: 25
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                                    cx: "12",
                                                                                    cy: "9",
                                                                                    r: "2.5",
                                                                                    fill: "#FFFFFF"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                                                    lineNumber: 180,
                                                                                    columnNumber: 25
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                                                            lineNumber: 178,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: "Google Maps"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                                                            lineNumber: 182,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                                    lineNumber: 172,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                    href: "https://maps.apple.com/?q=C.+Abdul+Hakeem+College+of+Engineering+%26+Technology&ll=12.9365538,79.2319153",
                                                                    target: "_blank",
                                                                    rel: "noopener noreferrer",
                                                                    className: "inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-950 text-white hover:bg-slate-800 border border-slate-700 transition-colors shadow-xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            className: "w-3 h-3 shrink-0 fill-current text-white",
                                                                            viewBox: "0 0 24 24",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                d: "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.1-.97.04-2.17.65-2.86 1.45-.61.71-1.15 1.87-.99 2.99 1.09.08 2.22-.53 2.86-1.34z"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/layout/Footer.tsx",
                                                                                lineNumber: 191,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                                                            lineNumber: 190,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: "Apple Maps"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                                                            lineNumber: 193,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                                    lineNumber: 184,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                                            lineNumber: 171,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 165,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 163,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "flex items-center gap-2 min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                    className: `w-4 h-4 shrink-0 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 199,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "tel:+919043293530",
                                                    className: `text-[10px] sm:text-xs font-black whitespace-nowrap transition-colors ${isDark ? 'text-slate-200 hover:text-amber-300' : 'text-slate-900 hover:text-[#7c3aed]'}`,
                                                    style: {
                                                        WebkitTapHighlightColor: 'transparent'
                                                    },
                                                    title: "Assistant Professor: Mr. M. Mohamed Rafe (9043293530)",
                                                    children: "Assistant Professor: Mr. M. Mohamed Rafe (9043293530)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 200,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 198,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                    className: `w-4 h-4 shrink-0 ${isDark ? 'text-amber-300' : 'text-[#7c3aed]'}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 211,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "mailto:info@cahcet.edu.in",
                                                    className: `text-sm font-black transition-colors ${isDark ? 'text-slate-200 hover:text-amber-300' : 'text-slate-900 hover:text-[#7c3aed]'}`,
                                                    style: {
                                                        WebkitTapHighlightColor: 'transparent'
                                                    },
                                                    children: "info@cahcet.edu.in"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                                    lineNumber: 212,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/layout/Footer.tsx",
                                            lineNumber: 210,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 162,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Footer.tsx",
                            lineNumber: 158,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Footer.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-black ${isDark ? 'border-slate-800 text-slate-300' : 'border-slate-300 text-slate-800'}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                "© ",
                                currentYear,
                                " INFogram'26 · Department of Information Technology, CAHCET. All rights reserved."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Footer.tsx",
                            lineNumber: 229,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "flex items-center gap-2 text-xs font-black",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Designed & Developed by"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 232,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "https://appziio.com",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    title: "appziio — Web & App Development Studio",
                                    "aria-label": "Developed by appziio",
                                    className: `font-black text-xs uppercase tracking-widest transition-all px-3 py-1 rounded-full border ${isDark ? 'bg-purple-500/20 text-amber-300 border-purple-500/40 hover:bg-purple-500/30 shadow-[0_0_12px_rgba(252,211,77,0.4)]' : 'bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/30 hover:bg-[#7c3aed]/20 shadow-xs'}`,
                                    style: {
                                        WebkitTapHighlightColor: 'transparent'
                                    },
                                    children: "appziio"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Footer.tsx",
                                    lineNumber: 233,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Footer.tsx",
                            lineNumber: 231,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Footer.tsx",
                    lineNumber: 227,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layout/Footer.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layout/Footer.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
_s(Footer, "JkSxfi8+JQlqgIgDOc3wQN+nVIw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ThemeToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/ThemeToggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ThemeContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
const NAV_LINKS = [
    {
        name: 'Home',
        path: '/'
    },
    {
        name: 'About',
        path: '/about'
    },
    {
        name: 'Events',
        path: '/events'
    },
    {
        name: 'Register',
        path: '/register'
    },
    {
        name: 'My Ticket',
        path: '/my-ticket'
    },
    {
        name: 'Contact',
        path: '/contact'
    }
];
const drawerVariants = {
    hidden: {
        opacity: 0,
        height: 0
    },
    visible: {
        opacity: 1,
        height: 'auto',
        transition: {
            type: 'spring',
            stiffness: 350,
            damping: 28,
            staggerChildren: 0.04
        }
    },
    exit: {
        opacity: 0,
        height: 0,
        transition: {
            duration: 0.15
        }
    }
};
const itemVariants = {
    hidden: {
        opacity: 0,
        x: -10
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.2
        }
    }
};
function Header() {
    _s();
    const [scrolled, setScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mobileMenuOpen, setMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const isDark = theme === 'dark';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            let ticking = false;
            const handleScroll = {
                "Header.useEffect.handleScroll": ()=>{
                    if (!ticking) {
                        requestAnimationFrame({
                            "Header.useEffect.handleScroll": ()=>{
                                setScrolled(window.scrollY > 20);
                                ticking = false;
                            }
                        }["Header.useEffect.handleScroll"]);
                        ticking = true;
                    }
                }
            }["Header.useEffect.handleScroll"];
            window.addEventListener('scroll', handleScroll, {
                passive: true
            });
            return ({
                "Header.useEffect": ()=>window.removeEventListener('scroll', handleScroll)
            })["Header.useEffect"];
        }
    }["Header.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            setMobileMenuOpen(false);
        }
    }["Header.useEffect"], [
        pathname
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-3 flex justify-center w-full transform-gpu",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `w-full max-w-5xl rounded-full border transition-all duration-300 ${isDark ? scrolled ? 'bg-slate-900/95 border-purple-500/30 shadow-2xl' : 'bg-slate-900/85 border-slate-700/60 shadow-lg' : scrolled ? 'bg-white/95 border-slate-200 shadow-xl' : 'bg-white/90 border-slate-200/90 shadow-md'}`,
            style: {
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                transform: 'translate3d(0,0,0)',
                WebkitTransform: 'translate3d(0,0,0)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-4 sm:px-6 h-15 sm:h-16 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "flex items-center gap-2.5 group active:scale-95 transition-transform duration-150 cursor-pointer",
                            style: {
                                WebkitTapHighlightColor: 'transparent',
                                touchAction: 'manipulation'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center overflow-hidden shrink-0 bg-black border transition-all duration-200 cursor-pointer ${isDark ? 'border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]' : 'border-[#7c3aed]/40 shadow-sm'}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "/logo.png",
                                        alt: "INFOGRAM'26 Logo",
                                        width: 44,
                                        height: 44,
                                        decoding: "async",
                                        className: "w-full h-full object-cover rounded-full transform scale-105 cursor-pointer"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 90,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 87,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs xs:text-sm sm:text-base font-black tracking-wider inline-flex items-center gap-0.5 select-none",
                                    style: {
                                        fontFamily: 'var(--font-display)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: isDark ? 'text-white' : 'text-slate-950',
                                            children: "INFOGRAM"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 100,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: isDark ? 'text-amber-300' : 'text-[#7c3aed]',
                                            children: "'26"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 101,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 82,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "hidden md:flex items-center gap-1",
                            children: NAV_LINKS.map((link)=>{
                                const isActive = pathname === link.path;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: link.path,
                                    className: `relative px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-150 rounded-full active:scale-95 ${isActive ? isDark ? 'bg-purple-500/20 text-amber-300 border border-purple-500/40' : 'bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white shadow-md' : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' : 'text-slate-900 hover:text-[#7c3aed] hover:bg-slate-100 font-black'}`,
                                    style: {
                                        WebkitTapHighlightColor: 'transparent',
                                        fontFamily: 'var(--font-heading)',
                                        touchAction: 'manipulation'
                                    },
                                    children: link.name
                                }, link.path, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 110,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 106,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 sm:gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ThemeToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 132,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: `md:hidden p-2 rounded-full focus:outline-none border active:scale-90 transition-all duration-150 ${isDark ? 'bg-slate-800/90 border-slate-700 text-slate-100' : 'bg-slate-100 border-slate-300 text-slate-950 font-black'}`,
                                    onClick: ()=>setMobileMenuOpen(!mobileMenuOpen),
                                    "aria-label": "Toggle menu",
                                    style: {
                                        WebkitTapHighlightColor: 'transparent',
                                        touchAction: 'manipulation'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                        mode: "wait",
                                        children: mobileMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                            initial: {
                                                rotate: -90,
                                                opacity: 0
                                            },
                                            animate: {
                                                rotate: 0,
                                                opacity: 1
                                            },
                                            exit: {
                                                rotate: 90,
                                                opacity: 0
                                            },
                                            transition: {
                                                duration: 0.12
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 155,
                                                columnNumber: 21
                                            }, this)
                                        }, "close", false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 148,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                            initial: {
                                                rotate: 90,
                                                opacity: 0
                                            },
                                            animate: {
                                                rotate: 0,
                                                opacity: 1
                                            },
                                            exit: {
                                                rotate: -90,
                                                opacity: 0
                                            },
                                            transition: {
                                                duration: 0.12
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/Header.tsx",
                                                lineNumber: 165,
                                                columnNumber: 21
                                            }, this)
                                        }, "menu", false, {
                                            fileName: "[project]/src/components/layout/Header.tsx",
                                            lineNumber: 158,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 146,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 135,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Header.tsx",
                    lineNumber: 80,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    children: mobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        variants: drawerVariants,
                        initial: "hidden",
                        animate: "visible",
                        exit: "exit",
                        className: `md:hidden overflow-hidden rounded-3xl mt-2 border mx-2 mb-2 ${isDark ? 'bg-slate-900/95 border-purple-500/30 text-white shadow-2xl backdrop-blur-xl' : 'bg-white/98 border-slate-200 text-slate-950 shadow-2xl backdrop-blur-xl'}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-4 py-4 space-y-1.5",
                            children: NAV_LINKS.map((link)=>{
                                const isActive = pathname === link.path;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    variants: itemVariants,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: link.path,
                                        onClick: ()=>setMobileMenuOpen(false),
                                        className: `block w-full px-5 py-3 text-sm font-black uppercase tracking-wider rounded-2xl active:scale-95 transition-transform duration-100 ${isActive ? isDark ? 'bg-purple-500/20 text-amber-300 border border-purple-500/40' : 'bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white shadow-md' : isDark ? 'text-slate-100 hover:bg-slate-800' : 'text-slate-950 hover:bg-slate-100'}`,
                                        style: {
                                            WebkitTapHighlightColor: 'transparent',
                                            fontFamily: 'var(--font-heading)',
                                            touchAction: 'manipulation'
                                        },
                                        children: link.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/Header.tsx",
                                        lineNumber: 192,
                                        columnNumber: 23
                                    }, this)
                                }, link.path, false, {
                                    fileName: "[project]/src/components/layout/Header.tsx",
                                    lineNumber: 191,
                                    columnNumber: 21
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/Header.tsx",
                            lineNumber: 187,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/Header.tsx",
                        lineNumber: 176,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/Header.tsx",
                    lineNumber: 174,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/layout/Header.tsx",
            lineNumber: 63,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/layout/Header.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_s(Header, "g5+/1xwVfYspkCMZL9CW/xCZQ6E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/PublicLayout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PublicLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/Footer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ScrollProgress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/ScrollProgress.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2f$MusicPlayer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/home/MusicPlayer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ThemeContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function PublicLayout({ children }) {
    _s();
    const { theme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const isDark = theme === 'dark';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col min-h-screen transition-colors duration-300 relative ${isDark ? 'bg-[#070913] text-white' : 'bg-[#f8fafc] text-slate-950'}`,
        style: {
            isolation: 'isolate'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu",
                children: isDark ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute -top-40 -right-20 w-[600px] h-[600px] opacity-40",
                            style: {
                                background: 'radial-gradient(circle, rgba(126, 34, 206, 0.25) 0%, rgba(7, 9, 19, 0) 70%)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/PublicLayout.tsx",
                            lineNumber: 26,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-1/3 -left-30 w-[500px] h-[500px] opacity-30",
                            style: {
                                background: 'radial-gradient(circle, rgba(217, 119, 6, 0.15) 0%, rgba(7, 9, 19, 0) 70%)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/PublicLayout.tsx",
                            lineNumber: 30,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute -bottom-20 -right-20 w-[550px] h-[550px] opacity-35",
                            style: {
                                background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(7, 9, 19, 0) 70%)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/PublicLayout.tsx",
                            lineNumber: 34,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/PublicLayout.tsx",
                    lineNumber: 25,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute -top-40 -right-20 w-[600px] h-[600px] opacity-50",
                            style: {
                                background: 'radial-gradient(circle, rgba(192, 132, 252, 0.2) 0%, rgba(248, 250, 252, 0) 70%)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/PublicLayout.tsx",
                            lineNumber: 41,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute -bottom-20 -left-20 w-[500px] h-[500px] opacity-40",
                            style: {
                                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(248, 250, 252, 0) 70%)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/PublicLayout.tsx",
                            lineNumber: 45,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/PublicLayout.tsx",
                    lineNumber: 40,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/PublicLayout.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$ScrollProgress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/layout/PublicLayout.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/layout/PublicLayout.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-grow pt-20 relative z-10",
                style: {
                    contain: 'layout'
                },
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/layout/PublicLayout.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/layout/PublicLayout.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$home$2f$MusicPlayer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/layout/PublicLayout.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/PublicLayout.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_s(PublicLayout, "JkSxfi8+JQlqgIgDOc3wQN+nVIw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = PublicLayout;
var _c;
__turbopack_context__.k.register(_c, "PublicLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/ScrollProgress.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ScrollProgress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$scroll$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-scroll.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-spring.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function ScrollProgress() {
    _s();
    const { scrollYProgress } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$scroll$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScroll"])();
    const scaleX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"])(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        style: {
            scaleX,
            transformOrigin: '0%',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, #38bdf8, #0ea5e9)',
            zIndex: 9999,
            willChange: 'transform'
        }
    }, void 0, false, {
        fileName: "[project]/src/components/ui/ScrollProgress.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_s(ScrollProgress, "UYAOtHxiUth0DU6Git6zGRnUBB4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$scroll$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScroll"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"]
    ];
});
_c = ScrollProgress;
var _c;
__turbopack_context__.k.register(_c, "ScrollProgress");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/ThemeToggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.mjs [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.mjs [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/ThemeContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function ThemeToggle() {
    _s();
    const { theme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const isDark = theme === 'dark';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
        onClick: toggleTheme,
        whileHover: {
            scale: 1.05,
            translateY: -1
        },
        whileTap: {
            scale: 0.92
        },
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 25
        },
        "aria-label": "Toggle Dark/Light Theme",
        style: {
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            WebkitTapHighlightColor: 'transparent'
        },
        className: `
        relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 select-none border cursor-pointer
        ${isDark ? 'bg-slate-900/80 text-amber-300 border-purple-500/30 shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] hover:border-purple-400/50' : 'bg-white/85 text-slate-800 border-slate-200 shadow-[0_4px_16px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-[#7c3aed]/30'}
      `,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                animate: {
                    rotate: isDark ? 0 : 180
                },
                transition: {
                    duration: 0.4,
                    ease: 'backOut'
                },
                className: "flex items-center justify-center",
                children: isDark ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                    className: "w-4 h-4 text-purple-300 fill-purple-300/20"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/ThemeToggle.tsx",
                    lineNumber: 39,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                    className: "w-4 h-4 text-amber-500 fill-amber-500/20"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/ThemeToggle.tsx",
                    lineNumber: 41,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ThemeToggle.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "hidden sm:inline font-semibold tracking-wider uppercase text-[10px]",
                children: isDark ? 'OLED Dark' : 'Liquid Light'
            }, void 0, false, {
                fileName: "[project]/src/components/ui/ThemeToggle.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/ThemeToggle.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_s(ThemeToggle, "Q4eAjrIZ0CuRuhycs6byifK2KBk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = ThemeToggle;
var _c;
__turbopack_context__.k.register(_c, "ThemeToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/eventsData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EVENT_PREFIX_MAP",
    ()=>EVENT_PREFIX_MAP,
    "OFFICIAL_EVENTS",
    ()=>OFFICIAL_EVENTS,
    "formatTime",
    ()=>formatTime,
    "formatTimeRange",
    ()=>formatTimeRange,
    "generateApplicantId",
    ()=>generateApplicantId,
    "getEventPrefix",
    ()=>getEventPrefix,
    "isEventMatch",
    ()=>isEventMatch
]);
function formatTime(timeStr) {
    if (!timeStr) return '';
    const trimmed = timeStr.trim();
    if (!trimmed) return '';
    if (/am|pm/i.test(trimmed)) return trimmed;
    const parts = trimmed.split(':');
    let h = parseInt(parts[0], 10);
    if (isNaN(h)) return trimmed;
    const m = parts[1] ? parts[1].padStart(2, '0') : '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    const formattedH = h.toString().padStart(2, '0');
    return `${formattedH}:${m} ${ampm}`;
}
function formatTimeRange(start, end) {
    if (!start) return '';
    const formattedStart = formatTime(start);
    if (!end) return formattedStart;
    const formattedEnd = formatTime(end);
    return `${formattedStart} – ${formattedEnd}`;
}
const OFFICIAL_EVENTS = [
    // ── 1. TECHNICAL EVENTS ──
    {
        id: 'tech-1',
        slug: 'tech-talks',
        name: 'Tech Talks',
        category: 'technical',
        description: 'Present your innovative ideas and research papers to a panel of industry experts on cutting-edge IT topics.',
        rules: [
            'Maximum of 2 members | ₹100 per head',
            'Each team should submit a soft copy of the paper before presentation.',
            'Each team has 5 minutes to present their topic, followed by 2 minutes of questionnaires.',
            'Topics: Quantum Computing, Generative AI, Cybersecurity, or any topic related to IT domain.'
        ],
        venue: 'IT Smart Room; CSE Smart Room',
        date: '2026-08-22',
        startTime: '11:00',
        endTime: '14:00',
        registrationDeadline: '2026-08-20',
        registrationFee: 100,
        maxSlots: 200,
        maxParticipants: 2,
        registeredCount: 0,
        coordinatorName: 'Mohammed Dhaniyal & Masood Nawaz',
        staffIncharge: 'Dr. Gayathri Devi; Mrs. Suganya',
        organizerName: 'Department of Information Technology',
        contactNumber: '7010155779, 9944410994',
        bannerUrl: '/events/tech-talks.png',
        status: 'upcoming',
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'tech-2',
        slug: 'codestorm',
        name: 'Codestorm',
        category: 'technical',
        description: 'Two-round coding & debugging challenge testing speed, accuracy, and problem-solving skills across any programming language.',
        rules: [
            'Maximum of 2 members | ₹50 per head',
            'First round has 20 questions in 30 minutes.',
            'Second round: Coding & Debugging. Participants should solve 5 questions in 1 hour using any language.',
            'Computers will be provided.'
        ],
        venue: 'Lab 5 Tech Tower; Lab 6 Tech Tower',
        date: '2026-08-22',
        startTime: '11:00',
        endTime: '13:00',
        registrationDeadline: '2026-08-20',
        registrationFee: 50,
        maxSlots: 200,
        maxParticipants: 2,
        registeredCount: 0,
        coordinatorName: 'Gunasekaran & Thoufeeq Ahmed',
        staffIncharge: 'Mrs. S. Saranya',
        organizerName: 'Department of Information Technology',
        contactNumber: '9677904695, 9150654995',
        bannerUrl: '/events/codestorm.jpeg',
        status: 'upcoming',
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'tech-3',
        slug: 'pixel-craft',
        name: 'Pixel Craft',
        category: 'technical',
        description: 'Design and develop responsive web interfaces and UI/UX designs on an on-the-spot topic.',
        rules: [
            'Maximum of 2 members | ₹100 per head',
            'No templates will be provided and participants should bring their laptop.',
            'Topic will be given on the spot.'
        ],
        venue: 'III-B IT Class Room',
        date: '2026-08-22',
        startTime: '11:00',
        endTime: '12:00',
        registrationDeadline: '2026-08-20',
        registrationFee: 100,
        maxSlots: 200,
        maxParticipants: 2,
        registeredCount: 0,
        coordinatorName: 'Mathin S & Manikandan T',
        staffIncharge: 'Mr. I Abdullah',
        organizerName: 'Department of Information Technology',
        contactNumber: '6381880659, 8825940089',
        bannerUrl: '/events/pixel-craft.png',
        status: 'upcoming',
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'tech-4',
        slug: 'open-source',
        name: 'Open Source',
        category: 'technical',
        description: 'Single-round open-source workflow challenge: Find, fix, and improve a given codebase using Git and GitHub.',
        rules: [
            'Maximum of 2 members | ₹100 per head',
            'One round: Find, Fix & Improve a given codebase.',
            'Fork → Code → Commit → Push → Pull Request → Complete the open-source workflow.',
            'Bring your laptop.',
            'A laptop with Git/GitHub access and required coding tools is mandatory/recommended for participation.'
        ],
        venue: 'Lab 7 Tech Tower',
        date: '2026-08-22',
        startTime: '12:00',
        endTime: '13:30',
        registrationDeadline: '2026-08-20',
        registrationFee: 100,
        maxSlots: 200,
        maxParticipants: 2,
        registeredCount: 0,
        coordinatorName: 'Saheem & Zahid',
        staffIncharge: 'Mr. M Mohamed Rafee',
        organizerName: 'Department of Information Technology',
        contactNumber: '9489016294, 7639412328',
        bannerUrl: '/events/open-source.jpeg',
        status: 'upcoming',
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'tech-5',
        slug: 'byte-battle',
        name: 'Byte Battle',
        category: 'technical',
        description: 'Fast-paced technical contest testing your knowledge of IT domain concepts.',
        rules: [
            'Maximum of 2 members | ₹50 per head',
            'Participants should bring a mobile phone.',
            'Gadgets, AI are not allowed.'
        ],
        venue: 'Smart Class Room IT',
        date: '2026-08-22',
        startTime: '11:00',
        endTime: '12:00',
        registrationDeadline: '2026-08-20',
        registrationFee: 50,
        maxSlots: 200,
        maxParticipants: 2,
        registeredCount: 0,
        coordinatorName: 'Ezthilarasan & Dinesh Babu',
        staffIncharge: 'Mrs. V. I. Sumaiya Banu',
        organizerName: 'Department of Information Technology',
        contactNumber: '9080249831, 6374468780',
        bannerUrl: '/events/byte-battle.png',
        status: 'upcoming',
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'tech-6',
        slug: 'hack-forge',
        name: 'Hack Forge',
        category: 'technical',
        description: 'Open innovation project pitching contest featuring a 5-minute prototype pitch and 1-minute final pitch.',
        rules: [
            'Maximum of 2 members (Individual / 2 members) | ₹100 per head',
            'Round 1: 5-minute prototype pitch.',
            'Round 2: 1-minute final pitch.'
        ],
        venue: 'Tech Tower Lab 1 & 2',
        date: '2026-08-22',
        startTime: '12:00',
        endTime: '13:30',
        registrationDeadline: '2026-08-20',
        registrationFee: 100,
        maxSlots: 200,
        maxParticipants: 2,
        registeredCount: 0,
        coordinatorName: 'Kashif',
        staffIncharge: 'Mr. Dhanasekar',
        organizerName: 'Department of Information Technology',
        contactNumber: '6380028607',
        bannerUrl: '/events/hack-forge.png',
        status: 'upcoming',
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'tech-7',
        slug: 'clash-of-minds',
        name: 'Clash of Minds',
        category: 'technical',
        description: 'Technical debate contest where one team member speaks for the topic and the other speaks against it.',
        rules: [
            'Team of 2 | ₹50 per head',
            'One participant speaks for the topic and the other against the topic.',
            'Topics will be given on the spot.',
            'Each team gets 6 minutes to present.'
        ],
        venue: 'ECE Seminar Hall',
        date: '2026-08-22',
        startTime: '11:30',
        endTime: '12:30',
        registrationDeadline: '2026-08-20',
        registrationFee: 50,
        maxSlots: 200,
        maxParticipants: 2,
        registeredCount: 0,
        coordinatorName: 'Amirtha Varshini & Keerthana',
        staffIncharge: 'Mrs. Sandhya',
        organizerName: 'Department of Information Technology',
        contactNumber: '9597010159, 9629909942',
        bannerUrl: '/events/clash-of-minds.png',
        status: 'upcoming',
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    // ── 2. NON-TECHNICAL EVENTS ──
    {
        id: 'nontech-1',
        slug: 'mind-matrix',
        name: 'Mind Matrix',
        category: 'non-technical',
        description: 'Connect displayed images on screen to solve non-technical trivia and mind-bending puzzles.',
        rules: [
            'Maximum of 2 members | ₹50 per head',
            'Connect the images displayed on the screen and find the answer.',
            'Non-technical-based questions/hints.'
        ],
        venue: 'MBA Seminar Hall',
        date: '2026-08-22',
        startTime: '12:30',
        endTime: '15:00',
        registrationDeadline: '2026-08-20',
        registrationFee: 50,
        maxSlots: 200,
        maxParticipants: 2,
        registeredCount: 0,
        coordinatorName: 'Naushin & Hema Malini',
        staffIncharge: 'Mrs. Saranya Devi; Mrs. Gayathri',
        organizerName: 'Department of Information Technology',
        contactNumber: '7358170392, 7418575021',
        bannerUrl: '/events/mind-matrix.png',
        status: 'upcoming',
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'nontech-2',
        slug: 'quest-x',
        name: 'Quest X',
        category: 'non-technical',
        description: 'Campus-wide treasure hunt. Follow sequential clues as a team to find the hidden treasure.',
        rules: [
            'Maximum of 4 members | ₹50 per head',
            'Follow the clues in order. No skipping.',
            'Stay together as a team.',
            'First team to find the treasure wins.'
        ],
        venue: 'EEE Class Room',
        date: '2026-08-22',
        startTime: '13:30',
        endTime: '15:00',
        registrationDeadline: '2026-08-20',
        registrationFee: 50,
        maxSlots: 200,
        maxParticipants: 4,
        registeredCount: 0,
        coordinatorName: 'Shyam Sundar & Maithreyan',
        staffIncharge: 'Mrs. Sandhya',
        organizerName: 'Department of Information Technology',
        contactNumber: '9345837870, 9342706675',
        bannerUrl: '/events/quest-x.png',
        status: 'upcoming',
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'nontech-3',
        slug: 'frame-craft',
        name: 'Frame Craft',
        category: 'non-technical',
        description: 'On-spot mobile photography contest capturing campus moments matching the given theme.',
        rules: [
            'Maximum of 1 member | ₹50 per head',
            'On-spot topic will be provided.',
            'Only mobile photos will be accepted.',
            'Photos should be taken inside the college campus and should match the theme.'
        ],
        venue: 'III-A IT Class Room',
        date: '2026-08-22',
        startTime: '14:00',
        endTime: '15:30',
        registrationDeadline: '2026-08-20',
        registrationFee: 50,
        maxSlots: 200,
        maxParticipants: 1,
        registeredCount: 0,
        coordinatorName: 'Jeysha & Siddharth',
        staffIncharge: 'Mrs. Ranjani',
        organizerName: 'Department of Information Technology',
        contactNumber: '9345110882, 8925444109',
        bannerUrl: '/events/frame-craft.png',
        status: 'upcoming',
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'nontech-4',
        slug: 'fun-fiesta',
        name: 'Fun Fiesta',
        category: 'non-technical',
        description: 'High-energy mini-games and spot challenges with exciting prizes throughout the day.',
        rules: [
            'Maximum of 4 members | ₹50 per head',
            'Spot entry mini-games and challenges throughout the day.'
        ],
        venue: 'Drawing Hall (CSE Side)',
        date: '2026-08-22',
        startTime: '12:00',
        endTime: '14:00',
        registrationDeadline: '2026-08-20',
        registrationFee: 50,
        maxSlots: 200,
        maxParticipants: 4,
        registeredCount: 0,
        coordinatorName: 'Jaffreen & Talha',
        staffIncharge: 'Mrs. Ranjani',
        organizerName: 'Department of Information Technology',
        contactNumber: '9344814392, 8610117244',
        bannerUrl: '/events/fun-fiesta.png',
        status: 'upcoming',
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'nontech-5',
        slug: 'artistry',
        name: 'Artistry',
        category: 'non-technical',
        description: 'Fine art, mehendi, and creative illustration contest testing artistic skills and imagination.',
        rules: [
            'Maximum of 1 member | ₹50 per head',
            'Required things should be brought by participants.',
            'No reference materials or phones are allowed.'
        ],
        venue: 'EEE Class Room',
        date: '2026-08-22',
        startTime: '14:00',
        endTime: '15:00',
        registrationDeadline: '2026-08-20',
        registrationFee: 50,
        maxSlots: 200,
        maxParticipants: 1,
        registeredCount: 0,
        coordinatorName: 'Haniya Nikhat & Harshitha',
        staffIncharge: 'Mrs. R. Banu',
        organizerName: 'Department of Information Technology',
        contactNumber: '8248478615, 9629136470',
        bannerUrl: '/events/artistry.png',
        status: 'upcoming',
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'nontech-6',
        slug: 'flavour-fusion',
        name: 'Flavour Fusion',
        category: 'non-technical',
        description: 'No-fire cooking & culinary contest evaluated on food taste, presentation, area cleanliness, and number of dishes. (Exclusively for Girls)',
        rules: [
            'Exclusively for Girls (Girls Only / Only Female Participants)',
            'Maximum of 4 members | ₹50 per head',
            'Pre-cooked food is not allowed. Required things should be brought by yourself.',
            'Winner will be decided based on: Food taste, Presentation, Cleanliness of the place, and Number of dishes.'
        ],
        venue: 'Physics Lab',
        date: '2026-08-22',
        startTime: '11:30',
        endTime: '12:30',
        registrationDeadline: '2026-08-20',
        registrationFee: 50,
        maxSlots: 200,
        maxParticipants: 4,
        registeredCount: 0,
        coordinatorName: 'Jeevitha & Poorna Sree',
        staffIncharge: 'Mrs. R. Banu',
        organizerName: 'Department of Information Technology',
        contactNumber: '9384505002, 9600889789',
        bannerUrl: '/events/flavour-fusion.png',
        status: 'upcoming',
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'nontech-7',
        slug: 'battle-verse',
        name: 'Battle Verse',
        category: 'non-technical',
        description: 'BGMI & Free Fire Battle Royale gaming tournament with strict fair-play guidelines (Solo or Team up to 4).',
        rules: [
            'Maximum of 4 members | Team registration: ₹60 | Solo registration: ₹50 per person',
            'Using emotes is strictly prohibited. If used, the participant/team will be disqualified.',
            'Only BR (Battle Royale) matches are allowed.',
            'People who cause skirmish or quarrel will be eliminated immediately.',
            'Gun skins are allowed, but character skill is prohibited.',
            'Winners (1st and 2nd) will be selected based on Booyah, Chicken Dinner, and Runner Up standings.'
        ],
        venue: 'Auditorium',
        date: '2026-08-22',
        startTime: '14:00',
        endTime: '15:30',
        registrationDeadline: '2026-08-20',
        registrationFee: 60,
        maxSlots: 200,
        maxParticipants: 4,
        registeredCount: 0,
        coordinatorName: 'Meshak & Sanjay V',
        staffIncharge: 'Mr. Dhanasekar',
        organizerName: 'Department of Information Technology',
        contactNumber: '6383598812, 6382143386',
        bannerUrl: '/events/battle-verse.png',
        status: 'upcoming',
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'nontech-8',
        slug: 'mic-drop',
        name: 'Mic Drop',
        category: 'non-technical',
        description: 'Open mic stage for solo singing, poetry, stand-up comedy, and acoustic performances.',
        rules: [
            'Registration: ₹50 per head',
            'Only singing, poetry, comedy, etc. will be allowed.',
            'Dance or heavy acts are not allowed for this event.'
        ],
        venue: 'ECE Seminar Hall',
        date: '2026-08-22',
        startTime: '14:00',
        endTime: '15:30',
        registrationDeadline: '2026-08-20',
        registrationFee: 50,
        maxSlots: 200,
        maxParticipants: 1,
        registeredCount: 0,
        coordinatorName: 'Garnet & Heena',
        staffIncharge: 'Mrs. V. I. Sumaiya Banu; Mrs. S. Saranya',
        organizerName: 'Department of Information Technology',
        contactNumber: '6374139336, 8072672922',
        bannerUrl: '/events/mic-drop.png',
        status: 'upcoming',
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'nontech-9',
        slug: 'reel-it-feel-it',
        name: 'Reel It Feel It',
        category: 'non-technical',
        description: 'Short mobile reel/video contest on an on-the-spot topic filmed inside campus.',
        rules: [
            'Maximum of 2 members | ₹50 per head',
            'An on-spot topic will be provided. Maximum 2 members are allowed.',
            'Only mobiles will be allowed to take videos.',
            'Videos should be taken inside the college campus and should match the topic.'
        ],
        venue: 'IT-A Final Year Class Room',
        date: '2026-08-22',
        startTime: '14:00',
        endTime: '15:30',
        registrationDeadline: '2026-08-20',
        registrationFee: 50,
        maxSlots: 200,
        maxParticipants: 2,
        registeredCount: 0,
        coordinatorName: 'Naveeth Khan & Faizal Ahmed',
        staffIncharge: 'Mr. I Abdullah',
        organizerName: 'Department of Information Technology',
        contactNumber: '9360257573, 9003710032',
        bannerUrl: '/events/reel-it-feel-it.png',
        status: 'upcoming',
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
const EVENT_PREFIX_MAP = {
    'tech-talks': 'TALK',
    'tech talks': 'TALK',
    'codestorm': 'CODE',
    'pixel-craft': 'PIXL',
    'pixel craft': 'PIXL',
    'open-source': 'OPEN',
    'open source': 'OPEN',
    'byte-battle': 'BYTE',
    'byte battle': 'BYTE',
    'hack-forge': 'HACK',
    'hack forge': 'HACK',
    'clash-of-minds': 'MIND',
    'clash of minds': 'MIND',
    'mind-matrix': 'MATX',
    'mind matrix': 'MATX',
    'quest-x': 'QSTX',
    'quest x': 'QSTX',
    'frame-craft': 'FRAM',
    'frame craft': 'FRAM',
    'fun-fiesta': 'FEST',
    'fun fiesta': 'FEST',
    'artistry': 'ARTS',
    'flavour-fusion': 'FOOD',
    'flavour fusion': 'FOOD',
    'battle-verse': 'BGMI',
    'battle verse': 'BGMI',
    'mic-drop': 'MICS',
    'mic drop': 'MICS',
    'reel-it-feel-it': 'REEL',
    'reel it feel it': 'REEL'
};
function getEventPrefix(eventNameOrSlug) {
    if (!eventNameOrSlug) return 'GENR';
    const norm = eventNameOrSlug.toLowerCase().trim();
    if (EVENT_PREFIX_MAP[norm]) return EVENT_PREFIX_MAP[norm];
    const cleaned = eventNameOrSlug.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length >= 4) return cleaned.slice(0, 4);
    return cleaned.padEnd(4, 'X');
}
function generateApplicantId(eventList) {
    const num = Math.floor(10000 + Math.random() * 90000);
    const firstEv = eventList && eventList.length > 0 ? eventList[0] : '';
    const prefix = getEventPrefix(firstEv);
    return `INFO26-${prefix}-${num}`;
}
function isEventMatch(candidate, event) {
    if (!candidate || !event) return false;
    const norm = (s)=>s ? String(s).toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    const targetNorms = [
        norm(event.id),
        event.slug ? norm(event.slug) : '',
        norm(event.name)
    ].filter(Boolean);
    if (typeof candidate === 'string') {
        const cNorm = norm(candidate);
        if (!cNorm) return false;
        return targetNorms.some((t)=>cNorm === t || cNorm.includes(t) || t.includes(cNorm));
    }
    if (typeof candidate === 'object') {
        const rawList = [
            ...Array.isArray(candidate.selectedEvents) ? candidate.selectedEvents : candidate.selectedEvents ? [
                candidate.selectedEvents
            ] : [],
            ...Array.isArray(candidate.eventNames) ? candidate.eventNames : candidate.eventNames ? [
                candidate.eventNames
            ] : [],
            ...Array.isArray(candidate.events) ? candidate.events : candidate.events ? [
                candidate.events
            ] : []
        ].map(String);
        return rawList.some((item)=>{
            const itemNorm = norm(item);
            if (!itemNorm) return false;
            return targetNorms.some((t)=>itemNorm === t || itemNorm.includes(t) || t.includes(itemNorm));
        });
    }
    return false;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/firebase/config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "app",
    ()=>app,
    "auth",
    ()=>auth,
    "db",
    ()=>db,
    "default",
    ()=>__TURBOPACK__default__export__,
    "isFirebaseConfigured",
    ()=>isFirebaseConfigured,
    "storage",
    ()=>storage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// ============================================================
// Firebase Configuration — INFOGRAM'26 Production Credentials
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$DugxmK6F$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a___as__getFirestore$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/common-DugxmK6F.esm.js [app-client] (ecmascript) <export a_ as getFirestore>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$DugxmK6F$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__b0__as__initializeFirestore$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/common-DugxmK6F.esm.js [app-client] (ecmascript) <export b0 as initializeFirestore>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2d$DGK4UgBf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__getAuth$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index-DGK4UgBf.js [app-client] (ecmascript) <export D as getAuth>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/storage/dist/index.esm.js [app-client] (ecmascript)");
;
;
;
;
const firebaseConfig = {
    apiKey: ("TURBOPACK compile-time value", "AIzaSyDGPuGlZhb_lFur3YPAegpdr8aM4BUd-zY") || "AIzaSyDGPuGlZhb_lFur3YPAegpdr8aM4BUd-zY",
    authDomain: ("TURBOPACK compile-time value", "infogram26.firebaseapp.com") || "infogram26.firebaseapp.com",
    projectId: ("TURBOPACK compile-time value", "infogram26") || "infogram26",
    storageBucket: ("TURBOPACK compile-time value", "infogram26.firebasestorage.app") || "infogram26.firebasestorage.app",
    messagingSenderId: ("TURBOPACK compile-time value", "207965452211") || "1083758362629",
    appId: ("TURBOPACK compile-time value", "1:207965452211:web:aec06e1299bf5a27233dc6") || "1:1083758362629:web:38b344efbc36746efbdba4",
    measurementId: ("TURBOPACK compile-time value", "G-11PB2J23P7") || "G-11PB2J23P7"
};
const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.projectId !== '');
const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApps"])().length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApp"])() : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initializeApp"])(firebaseConfig);
// ─── Singleton Auth ───────────────────────────────────────────
let _auth = null;
try {
    _auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2d$DGK4UgBf$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__getAuth$3e$__["getAuth"])(app);
} catch  {
    _auth = null;
}
const auth = _auth;
// ─── Singleton Firestore ──────────────────────────────────────
let _db = null;
try {
    _db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$DugxmK6F$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a___as__getFirestore$3e$__["getFirestore"])(app);
} catch  {
    try {
        _db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$DugxmK6F$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__b0__as__initializeFirestore$3e$__["initializeFirestore"])(app, {});
    } catch  {
        _db = null;
    }
}
const db = _db;
// ─── Singleton Storage ────────────────────────────────────────
let _storage = null;
try {
    _storage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStorage"])(app);
} catch  {
    _storage = null;
}
const storage = _storage;
const __TURBOPACK__default__export__ = app;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/eventStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useEventStore",
    ()=>useEventStore
]);
// ============================================================
// Event & Organizer Store — Zustand with Persistence
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$DugxmK6F$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__A__as__doc$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/common-DugxmK6F.esm.js [app-client] (ecmascript) <export A as doc>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$eventsData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/eventsData.ts [app-client] (ecmascript)");
;
;
;
;
;
const INITIAL_ORGANIZERS = [];
const INITIAL_EVENTS = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$eventsData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OFFICIAL_EVENTS"];
const INITIAL_REGISTRATIONS = [];
const useEventStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        events: INITIAL_EVENTS,
        organizers: INITIAL_ORGANIZERS,
        registrations: INITIAL_REGISTRATIONS,
        addEvent: (eventData)=>{
            const newId = `evt-${Date.now()}`;
            const newSlug = eventData.slug || eventData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const newEvent = {
                ...eventData,
                id: newId,
                slug: newSlug,
                registeredCount: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            set((state)=>({
                    events: [
                        newEvent,
                        ...state.events
                    ]
                }));
            if (eventData.organizerUid) {
                get().assignOrganizerToEvent(eventData.organizerUid, newId);
            }
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"] && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFirebaseConfigured"]) {
                try {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$DugxmK6F$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__A__as__doc$3e$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'events', newId), {
                        ...newEvent,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }).catch((err)=>console.error("Firestore sync add error:", err));
                } catch (e) {
                    console.error("Firestore add error:", e);
                }
            }
            return newEvent;
        },
        updateEvent: (id, updates)=>{
            set((state)=>{
                const updatedEvents = state.events.map((evt)=>evt.id === id ? {
                        ...evt,
                        ...updates,
                        updatedAt: new Date()
                    } : evt);
                let updatedOrganizers = state.organizers;
                if (updates.organizerUid) {
                    const assignedEvt = updatedEvents.find((e)=>e.id === id);
                    updatedOrganizers = state.organizers.map((org)=>{
                        if (org.uid === updates.organizerUid) {
                            return {
                                ...org,
                                assignedEventId: id,
                                assignedEventName: assignedEvt?.name
                            };
                        }
                        return org;
                    });
                }
                return {
                    events: updatedEvents,
                    organizers: updatedOrganizers
                };
            });
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"] && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFirebaseConfigured"]) {
                try {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$DugxmK6F$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__A__as__doc$3e$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'events', id), {
                        ...updates,
                        updatedAt: new Date().toISOString()
                    }, {
                        merge: true
                    }).catch((err)=>console.error("Firestore sync update error:", err));
                } catch (e) {
                    console.error("Firestore update error:", e);
                }
            }
        },
        deleteEvent: (id)=>{
            set((state)=>({
                    events: state.events.filter((evt)=>evt.id !== id),
                    organizers: state.organizers.map((org)=>org.assignedEventId === id ? {
                            ...org,
                            assignedEventId: undefined,
                            assignedEventName: undefined
                        } : org)
                }));
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"] && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFirebaseConfigured"]) {
                try {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$DugxmK6F$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__A__as__doc$3e$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'events', id)).catch((err)=>console.error("Firestore sync delete error:", err));
                } catch (e) {
                    console.error("Firestore delete error:", e);
                }
            }
        },
        addOrganizer: (organizerData)=>{
            const newUid = `org-${Date.now()}`;
            const assignedEvt = get().events.find((e)=>e.id === organizerData.assignedEventId);
            const newOrganizer = {
                ...organizerData,
                uid: newUid,
                role: 'organizer',
                assignedEventName: assignedEvt?.name,
                createdAt: new Date(),
                isActive: true
            };
            set((state)=>({
                    organizers: [
                        newOrganizer,
                        ...state.organizers
                    ]
                }));
            if (organizerData.assignedEventId) {
                get().assignOrganizerToEvent(newUid, organizerData.assignedEventId);
            }
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"] && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFirebaseConfigured"]) {
                try {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$common$2d$DugxmK6F$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__A__as__doc$3e$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', newUid), {
                        ...newOrganizer,
                        createdAt: new Date().toISOString()
                    }).catch((err)=>console.error("Firestore organizer sync error:", err));
                } catch (e) {
                    console.error("Firestore organizer sync error:", e);
                }
            }
            return newOrganizer;
        },
        updateOrganizer: (uid, updates)=>{
            set((state)=>({
                    organizers: state.organizers.map((org)=>org.uid === uid ? {
                            ...org,
                            ...updates
                        } : org)
                }));
        },
        assignOrganizerToEvent: (organizerUid, eventId)=>{
            set((state)=>{
                const targetEvt = state.events.find((e)=>e.id === eventId);
                const targetOrg = state.organizers.find((o)=>o.uid === organizerUid);
                const updatedEvents = state.events.map((evt)=>{
                    if (evt.id === eventId) {
                        return {
                            ...evt,
                            organizerUid,
                            organizerName: targetOrg?.displayName || evt.organizerName
                        };
                    }
                    return evt;
                });
                const updatedOrganizers = state.organizers.map((org)=>{
                    if (org.uid === organizerUid) {
                        return {
                            ...org,
                            assignedEventId: eventId,
                            assignedEventName: targetEvt?.name
                        };
                    }
                    return org;
                });
                return {
                    events: updatedEvents,
                    organizers: updatedOrganizers
                };
            });
        },
        getEventByOrganizer: (organizerUid, assignedEventId)=>{
            const { events, organizers } = get();
            if (assignedEventId) {
                const evt = events.find((e)=>e.id === assignedEventId);
                if (evt) return evt;
            }
            if (organizerUid) {
                const org = organizers.find((o)=>o.uid === organizerUid);
                if (org?.assignedEventId) {
                    const evt = events.find((e)=>e.id === org.assignedEventId);
                    if (evt) return evt;
                }
                return events.find((e)=>e.organizerUid === organizerUid);
            }
            return events[0];
        },
        getRegistrationsForEvent: (eventId)=>{
            const { registrations, events } = get();
            const targetEvt = events.find((e)=>e.id === eventId || e.slug === eventId || e.name.toLowerCase() === eventId.toLowerCase());
            if (!targetEvt) {
                return registrations.filter((r)=>Array.isArray(r.selectedEvents) && r.selectedEvents.includes(eventId) || Array.isArray(r.events) && r.events.includes(eventId) || Array.isArray(r.eventNames) && r.eventNames.includes(eventId));
            }
            return registrations.filter((r)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$eventsData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEventMatch"])(r, targetEvt));
        }
    }), {
    name: 'infogram26-event-store-v17'
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1meqmtj._.js.map