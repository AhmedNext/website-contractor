"use client";
import { useSyncExternalStore } from "react";
const subscribe=()=>()=>{};
const clientSnapshot=()=>true;
const serverSnapshot=()=>false;
// Keep prerendered inputs disabled until their own interactive bundle has hydrated.
export function useHydrated(){return useSyncExternalStore(subscribe,clientSnapshot,serverSnapshot);}
