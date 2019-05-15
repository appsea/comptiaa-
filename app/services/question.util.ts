import { IQuestion } from "~/shared/questions.model";

export class QuestionUtil {

    static isCorrect(question: IQuestion) {
        let isCorrect: boolean;
        for (const option of question.options) {
            isCorrect = option.selected && option.correct;
        }

        return isCorrect;
    }

    static countCorrectOptions(question: IQuestion) {
        let count = 0;
        for (const option of question.options) {
            if (option.correct) {
                count = count + 1;
            }
        }

        return count;
    }

    static isSkipped(question: IQuestion) {
        let isSkipped = true;
        for (const option of question.options) {
            if (option.selected) {
                isSkipped = false;
                break;
            }
        }

        return isSkipped;
    }

    static isWrong(question: IQuestion) {
        return !this.isSkipped(question) && !this.isCorrect(question);
    }

    static isOptionUpdated(question: IQuestion) {
        return !this.isCorrect(question);
    }

    private constructor() {}
}
