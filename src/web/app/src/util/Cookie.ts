
export default class Cookie {
    static get(key: string): string | undefined {
        return document.cookie
            .split("; ")
            .find((cookie) => cookie.startsWith(`${key}=`))
            ?.split("=")[1];
    }
}
