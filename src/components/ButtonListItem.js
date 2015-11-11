/* @flow */

import React from "react";
import classnames from "classnames";

export default class ButtonListItem extends React.Component {
    static propTypes = {
        primaryText: React.PropTypes.node.isRequired,
        secondaryText: React.PropTypes.node,

        leftIcon: React.PropTypes.node,
        rightIcon: React.PropTypes.node,
    };

    static defaultProps = {
        className: "",
    };

    static sampleProps = {
        default: {
            primaryText: "Primary Text",
            secondaryText: "Secondary Text",
        },
    };

    render(): ReactElement {
        let {
            className,
            primaryText,
            secondaryText,
            leftIcon,
            rightIcon,
            ...rest,
        } = this.props;

        return (
            <a
                aria-role="button"
                tabIndex="0"
                className={classnames(
                    "ListItem",
                    className,
                    {
                        "has-right-icon": rightIcon,
                        "has-left-icon": leftIcon,
                    }
                )}
                {...rest}
            >
                <div>
                    <div className="leftIcon">
                        {leftIcon}
                    </div>
                    <div className="primaryText">
                        {primaryText}
                    </div>
                    <div className="secondaryText">
                        {secondaryText}
                    </div>
                    <div className="rightIcon">
                        {rightIcon}
                    </div>
                </div>
            </a>
        )
    }
}
