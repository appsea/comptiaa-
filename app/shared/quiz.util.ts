import { getResources } from "tns-core-modules/application";
import { isAndroid, isIOS } from "tns-core-modules/platform";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as frame from "tns-core-modules/ui/frame";
import * as utils from "tns-core-modules/utils/utils";

export class QuizUtil {

    static days: Array<string> = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    static months: Array<string> = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    static getDate() {
        const d = new Date();

        return d.toISOString();
    }

    static getDateString(date: Date): string {
        let dateString: string = "";
        dateString += QuizUtil.days[date.getDay()];
        dateString += " " + QuizUtil.months[date.getMonth()];
        dateString += " " + date.getDate();
        // dateString += " " + date.getFullYear().toString().substr(2,2);
        dateString += ", " + date.getHours();
        const minutes: number = date.getMinutes();
        dateString += ":" + (minutes < 10 ? "0" + minutes : minutes);

        return dateString;
    }

    static showKeyboard(myTextfield) {
        if (myTextfield.ios) {
            myTextfield.focus();
        }

        if (myTextfield.android) {
            setTimeout(() => {
                myTextfield.android.requestFocus();
                const imm = utils.ad.getInputMethodManager();
                imm.showSoftInput(myTextfield.android, 0);
            }, 300);
        }
    }

    static hideKeyboard() {
        if (isAndroid) {
            utils.ad.dismissSoftInput();
        } else if (isIOS) {
            frame.topmost().nativeView.endEditing(true);
        }
    }

    static openUrl(str: string) {
        const tokens: Array<string> = getResources().tokenizeByUrl(str);
        const urls: Array<string> = QuizUtil.extractUrls(tokens);
        if (urls.length === 1) {
            utils.openUrl(urls[0]);
        } else if (urls.length > 1) {
            dialogs.action({
                message: "Please select the URL you want to visit:",
                cancelButtonText: "Cancel",
                actions: urls
            }).then((result) => {
                utils.openUrl(result);
            });
        }
    }

    static extractUrls(tokens: Array<string>) {
        const urls: Array<string> = [];
        tokens.forEach((str) => {
            if (str.indexOf("http") === 0) {
                urls.push(str);
            } else if (str.indexOf("www") === 0) {
                urls.push("https://" + str);
            }
        });

        return urls;
    }

    private constructor() {
    }
}
