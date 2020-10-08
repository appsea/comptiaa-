import { getResources } from "@nativescript/core/application";
import { FormattedString } from "@nativescript/core/text/formatted-string";
import { Span } from "@nativescript/core/text/span";

getResources().linkUrls = (string: string) => {
    const tokens: Array<string> = getResources().tokenizeByUrl(string);
    const formattedString = new FormattedString();
    tokens.forEach((str) => {
        const span = new Span();
        span.text = str;
        if (str.indexOf("http") === 0 || str.indexOf("www") === 0) {
            span.textDecoration = "underline";
            span.className = "url";
        }
        formattedString.spans.push(span);
    });

    return formattedString;
};

getResources().tokenizeByUrl = (string: string) => {
    const tokens: Array<string> = [];
    const HTTP: string = "http";
    const WWW: string = "www";
    let searchString = HTTP;
    if (string.indexOf(HTTP) === -1 || string.indexOf(HTTP) > string.indexOf(WWW)) {
        searchString = WWW;
    }
    if (string.indexOf(searchString) !== -1) {
        tokens.push(string.substr(0, string.indexOf(searchString)));
        const remaining: string = string.substr(string.indexOf(searchString));
        if (remaining.indexOf(" ") !== -1) {
            tokens.push(remaining.substr(0, remaining.indexOf(" ")));
            getResources().tokenizeByUrl(remaining.substr(remaining.indexOf(" "))).forEach((t) => {
                tokens.push(t);
            });
        } else {
            tokens.push(remaining);
        }
    } else {
        tokens.push(string);
    }

    return tokens;
};

getResources().highlightSearch = (sentence, searchText, className) => {
    const formattedString = new FormattedString();
    if (sentence && sentence.trim() !== "") {
        if (!searchText) {
            const span = new Span();
            span.text = sentence;
            span.className = className;
            formattedString.spans.push(span);
        } else {
            const indexes: Array<number> = [];
            if (searchText && sentence) {
                let pos: number = sentence.toLowerCase().indexOf(searchText.toLowerCase());
                while (pos !== -1) {
                    indexes.push(pos);
                    pos = sentence.toLowerCase().indexOf(searchText.toLowerCase(), pos + searchText.length);
                }
            }
            const tokens: Array<string> = [];
            if (indexes.length > 0) {
                let start = 0;
                for (const item of indexes) {
                    tokens.push(sentence.substring(start, item));
                    start = item;
                    tokens.push(sentence.substring(start, start + searchText.length));
                    start = start + searchText.length;
                }
                tokens.push(sentence.substring(start));
            } else {
                tokens.push(sentence);
            }
            tokens.forEach((str) => {
                const span = new Span();
                span.text = str;
                if (str.toLocaleLowerCase() === searchText.toLowerCase()) {
                    if (className && className !== "") {
                        span.className = className + " highlight";
                    } else {
                        span.className = "highlight";
                    }
                } else if (className && className !== "") {
                    span.className = className;
                }
                formattedString.spans.push(span);
            });
        }
    }

    return formattedString;
};
