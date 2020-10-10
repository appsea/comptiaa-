import { AndroidActivityBackPressedEventData, AndroidApplication } from "@nativescript/core/application";
import { EventData } from "@nativescript/core/data/observable";
import { isAndroid } from "@nativescript/core/platform";
import * as ButtonModule from "@nativescript/core/ui/button";
import * as dialogs from "@nativescript/core/ui/dialogs";
import { topmost } from "@nativescript/core/ui/frame";
import { SwipeDirection } from "@nativescript/core/ui/gestures";
import { Label } from "@nativescript/core/ui/label";
import { NavigatedData, Page } from "@nativescript/core/ui/page";
import { CreateViewEventData } from "@nativescript/core/ui/placeholder";
import { Repeater } from "@nativescript/core/ui/repeater";
import { ScrollView } from "@nativescript/core/ui/scroll-view";
import { TextView } from "@nativescript/core/ui/text-view";
import * as Toast from "nativescript-toast";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { screen } from "tns-core-modules/platform";
import { AdService } from "~/admob/ad.service";
import { ConnectionService } from "~/shared/connection.service";
import { QuizUtil } from "~/shared/quiz.util";
import { SelectedPageService } from "~/shared/selected-page-service";
import * as constantsModule from "../shared/constants";
import { QuestionViewModel } from "./question-view-model";

let vm: QuestionViewModel;
let optionList: Repeater;
let suggestionButton: ButtonModule.Button;
let defaultExplanation: Label;
let explanationHeader: Label;
let _page: any;
let scrollView: ScrollView;
let banner: any;
let loaded: boolean = false;

export function onPageLoaded(args: EventData): void {
    if (!isAndroid) {
        return;
    }
    loaded = false;
    setTimeout(() => showBannerAd(), 1000);
}

export function resetBanner() {
    if (banner) {
        banner.height = "0";
    }
    loaded = false;
    AdService.getInstance().hideAd();
}

/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize the page binding context.
*************************************************************/
export function onNavigatingTo(args) {
    /* ***********************************************************
    * The "onNavigatingTo" event handler lets you detect if the user navigated with a back button.
    * Skipping the re-initialization on back navigation means the user will see the
    * page in the same data state that he left it in before navigating.
    *************************************************************/
    if (args.isBackNavigation) {
        return;
    }
    const page = <Page>args.object;
    page.on(AndroidApplication.activityBackPressedEvent, onActivityBackPressedEvent, this);
    banner = page.getViewById("banner");
    suggestionButton = page.getViewById("suggestionButton");
    _page = page;
    optionList = page.getViewById("optionList");
    scrollView = page.getViewById("scrollView");
    vm = new QuestionViewModel(constantsModule.PRACTICE);
    page.bindingContext = vm;
    vm.showIfSelected();
    SelectedPageService.getInstance().updateSelectedPage("practice");
    explanationHeader = page.getViewById("explanationHeader");
    defaultExplanation = page.getViewById("defaultExplanation");
    explanationHeader.visibility = "hidden";
    defaultExplanation.visibility = "hidden";
    suggestionButton.visibility = "hidden";
}

export function onActivityBackPressedEvent(args: AndroidActivityBackPressedEventData) {
    previous();
    args.cancel = true;
}

/* ***********************************************************
* According to guidelines, if you have a drawer on your page, you should always
* have a button that opens it. Get a reference to the RadSideDrawer view and
* use the showDrawer() function to open the app drawer section.
*************************************************************/
export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function handleSwipe(args) {
    if (args.direction === SwipeDirection.left) {
        next();
    } else if (args.direction === SwipeDirection.right) {
        previous();
    }
}

export function moveToLast() {
    suggestionButton = _page.getViewById("suggestionButton");
    if (suggestionButton && scrollView) {
        const locationRelativeTo = suggestionButton.getLocationRelativeTo(scrollView);
        if (locationRelativeTo) {
            scrollView.scrollToVerticalOffset(locationRelativeTo.y, false);
        }
    }
}

export function goToEditPage(): void {
    vm.goToEditPage();
}

export function previous(): void {
    if (!vm) {
        vm = new QuestionViewModel(constantsModule.PRACTICE);
    }
    vm.previous();
    if (scrollView) {
        scrollView.scrollToVerticalOffset(0, false);
    }
}

export function flag(): void {
    vm.flag();
}

function showBannerAd(): void {
    if (AdService.getInstance().showAd && (!loaded || (banner && banner.height === "auto"))) {
        AdService.getInstance().showSmartBanner().then(
            () => {
                loaded = true;
                banner.height = AdService.getInstance().getAdHeight() + "dpi";
            },
            (error) => {
                resetBanner();
            }
        );
    }
}

export function next(): void {
    if (AdService.getInstance().showAd && !ConnectionService.getInstance().isConnected()) {
        dialogs.alert("Please connect to internet so that we can fetch next question for you!");
        resetBanner();
    } else {
        vm.next();
        showBannerAd();
        if (scrollView) {
            scrollView.scrollToVerticalOffset(0, false);
        }
    }
}

export function submit(): void {
    vm.submit();
}

export function quit(): void {
    vm.quit();
}

export function showAnswer(): void {
    vm.showAnswer();
    optionList.refresh();
}

export function selectOption(args): void {
    if (!vm.enableSelection()) {
        vm.selectOption(args);
        if (vm.allOptionSelected()) {
            vm.showAnswer();
            vm.updatePracticeStats();
        } else {
            Toast.makeText("Select one more option!", "long").show();
        }
    }
    optionList.refresh();
}

export function openUrl(arg: EventData) {
    const lbl: Label = arg.object as Label;
    QuizUtil.openUrl(lbl.text);
}
