declare module 'ip6' {
    export function parse(ip: string): bigint;
    export function toLong(parsedIp: bigint): bigint;
    export function fromLong(longIp: bigint): string;
    // Add other functions and types as needed
}