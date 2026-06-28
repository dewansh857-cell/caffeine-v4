import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ChatMessage {
    content: string;
    role: string;
}
export interface ChatResponse {
    status: Variant_error_success;
    content?: string;
    errorMessage?: string;
}
export interface ChatRequest {
    messages: Array<ChatMessage>;
}
export enum Variant_error_success {
    error = "error",
    success = "success"
}
export interface backendInterface {
    chat(request: ChatRequest): Promise<ChatResponse>;
}
