import { EventData } from "tns-core-modules/data/observable";
import { QuestionViewModel } from "~/question/question-view-model";
import { QuestionService } from "~/services/question.service";
import * as navigationModule from "../shared/navigation";

export function onDrawerButtonTap(args: EventData) {
    QuestionViewModel.showDrawer();
}

export function onPageLoaded(args: EventData) {
    if (!QuestionService.getInstance().hasQuestions()) {
        QuestionService.getInstance().checkQuestionUpdate();
    }
    navigationModule.route();
}
