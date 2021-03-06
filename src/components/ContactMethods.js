/* @flow */

import React from "react";
import _ from "underscore";

import Collapser from "./Collapser";
import Email from "./Email";
import Phone from "./Phone";
import Web from "./Web";
import fixtures from "../../fixtures/services";
import ServiceFactory from "../../fixtures/factories/Service";
import sendEvent from "../google-tag-manager";

import type { Service } from "../iss";

type Props = {
    object: Service,
    expanded?: boolean
}

class ContactMethods extends React.Component<Props, void> {
    static sampleProps = {
        closed: {
            object: ServiceFactory({
                phones: fixtures.ixa.phones,
                emails: [],
                web: null,
            }),
            expanded: false,
        },
        open: {
            object: ServiceFactory({
                phones: fixtures.ixa.phones,
                emails: [],
                web: null,
            }),
            expanded: true,
        },
        "two numbers": {
            object: ServiceFactory({
                phones: [
                    {kind: "phone", number: "(03) 3333 3333"},
                    {kind: "phone", number: "(03) 5555 5555"},
                ],
                emails: [],
                web: null,
            }),
            expanded: false,
        },
    };

    get phones(): Array<Object> {
        return this.props.object.Phones()
    }

    get emails(): Array<Object> {
        return this.props.object.emails || [];
    }

    recordClick(): void {
        sendEvent({
            event: "clickOtherContactOptions",
        })
    }

    render() {
        let assignComponent = (component) =>
            (record) =>
                Object.assign({ component: component }, record);
        let phones = this.phones.map(assignComponent(Phone));
        let emails = this.emails.map(assignComponent(Email));
        let contacts = [].concat(
            _.rest(phones),
            _.rest(emails),
        );

        let beforeFoldContacts = _.compact([].concat(
            _.first(phones),
            _.first(emails),
        ));

        if (this.props.object.web) {
            beforeFoldContacts = beforeFoldContacts.concat({
                component: Web,
                url: this.props.object.web,
            });
        }

        if (contacts.length > 0) {
            /* render one contact method per type and
             * then put the rest in a collapser */
            return (
                <div className="ContactMethods">
                    {beforeFoldContacts.map(this.renderContactMethod)}
                    <Collapser
                        message="Other contact options"
                        expanded={this.props.expanded}
                        onClick={this.recordClick.bind(this)}
                    >
                        {contacts.map(this.renderContactMethod)}
                    </Collapser>
                </div>
            );

        } else if (beforeFoldContacts.length > 0) {
            /* render 1 contact method of each type */
            return (
                <div className="ContactMethods">
                    {beforeFoldContacts.map(this.renderContactMethod)}
                </div>
            );
        } else {
            return <span />;
        }
    }

    renderContactMethod(record: Object, idx: number) {
        Object.assign(record, {key: idx});
        return React.createElement(record.component, record);
    }
}

export default ContactMethods;
