/* @flow */

import BaseQuestion from "./BaseQuestion";
import { SearchByMap } from "./mixins";

var questions = {
    "Female": "-male",
    "Male": " -female",
    "Neither/Both/Something else": "",
};

/*::`*/@SearchByMap(questions)/*::`;*/
export default class Gender extends BaseQuestion {
    // flow:disable
    static defaultProps = {
        name: "gender",
        question: "Do you identify as…",
        answers: Object.keys(questions),
    };

    // flow:disable
    static summaryLabel = "How do you identify?";

    // flow:disable
    static get headingValue() {
        switch (this.answer) {
        case "Male":
            return "for men";
        case "Female":
            return "for women";
        default:
            // important to not return "" here because it will
            // be followed by the age string and otherwise would
            // say "42 services aged 26 or younger"
            return "for people";
        }
    }
}
