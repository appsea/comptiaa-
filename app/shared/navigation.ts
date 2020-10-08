import * as frameModule from "@nativescript/core/ui/frame";
import { SettingsService } from "~/services/settings.service";
import { IState } from "./questions.model";

export function route() {
    let path = SettingsService.getInstance().getRoute();
    if (!path) {
        path = "question/practice-page";
    }
    if (!path.endsWith("-page")) {
        path = path + "-page";
    }
    toPage(path);
}

export function	gotoResultPage(state: IState) {
    frameModule.topmost().navigate({
        moduleName: "shared/result/result-page",
        clearHistory: true,
        context: state,
        transition: {
            name: "fade"
        }
    });
}

export function	gotoEditPage(state: IState) {
    frameModule.topmost().navigate({
        moduleName: "question/edit-question-page",
        context: state,
        transition: {
            name: "fade"
        }
    });
}

export function	gotoQuestionMap(state: IState) {
    frameModule.topmost().navigate({
        moduleName: "question/map-page",
        context: state,
        transition: {
            name: "fade"
        }
    });
}

export function	toPage(path: string) {
    frameModule.topmost().navigate({
        moduleName: path,
        transition: {
            name: "fade"
        }
    });
}

export function	gotoDetailsPage(state: IState) {
    frameModule.topmost().navigate({
        moduleName: "shared/details/detailed-result-page",
        context: state,
        transition: {
            name: "fade"
        }
    });
}

export function	goBack() {
    frameModule.topmost().goBack();
}
