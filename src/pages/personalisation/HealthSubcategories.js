/* @flow */

import BaseQuestion from "./BaseQuestion";
import { remove } from "../../iss/Search";

export default class HealthSubcategories extends BaseQuestion {
    static title = "Health";
    static propTypes = BaseQuestion.propTypes;
    static defaultProps = {
        name: "sub-health",
        question: "What sort of help do you need?",
        answers: {
            "Children": remove("(community health)")
                .append("health children"),
            "Maternal & child health": remove("(community health)")
                .remove({healthcare_card_holders: true})
                .append("maternal child health"),
            "Hospital": remove("(community health)")
                .remove({healthcare_card_holders: true})
                .append("(public hospital services)")
                .append("-pac")
                .append("-medicare"),
        },
    };
}
