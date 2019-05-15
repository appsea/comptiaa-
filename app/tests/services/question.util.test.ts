import { QuestionUtil } from "~/services/question.util";
import { IQuestion } from "~/shared/questions.model";
import * as TKUnit from "../TKUnit";

describe("Question Util ", () => {
    it("count Correct Options", () => {
        const iq: IQuestion = { description: "test" } as any as IQuestion;
        const actualCorrectAnswers = QuestionUtil.countCorrectOptions(iq);
        TKUnit.assert(actualCorrectAnswers === 3, "Correct option is 3 but actual is "  + actualCorrectAnswers);
    });
});
