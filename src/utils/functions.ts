export namespace Functions {
    export const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    export const utf8_to_b64 = (str: string) => {
        return window.btoa(unescape(encodeURIComponent(str)));
    }

    export const getRandomInt = (min: number, max: number) => {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

}
